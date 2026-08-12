-- Ashur administration foundation. Unapplied; local review and testing required.
begin;

create type public.admin_role as enum ('super_admin','admin','support','analyst','security_viewer');
create type public.admin_membership_status as enum ('active','suspended','revoked');
create type public.admin_permission as enum (
  'dashboard.read','users.list','users.read','users.pii_reveal','notes.write',
  'outbox.read','outbox.provider_id.read','audit.read','security.read','admins.manage'
);
create type public.admin_audit_result as enum ('success','denied','failed');

create table public.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role public.admin_role not null,
  status public.admin_membership_status not null default 'active',
  granted_by uuid references auth.users(id) on delete restrict,
  granted_at timestamptz not null default now(),
  revoked_by uuid references auth.users(id) on delete restrict,
  revoked_at timestamptz,
  revocation_reason text check (revocation_reason is null or char_length(btrim(revocation_reason)) between 10 and 500),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_membership_revocation_check check (
    (status = 'revoked' and revoked_by is not null and revoked_at is not null and revocation_reason is not null)
    or (status <> 'revoked' and revoked_by is null and revoked_at is null and revocation_reason is null)
  )
);

create table public.admin_role_permissions (
  role public.admin_role not null,
  permission public.admin_permission not null,
  created_at timestamptz not null default now(),
  primary key (role, permission)
);

create table public.admin_audit_events (
  event_id uuid primary key default extensions.gen_random_uuid(),
  actor_admin_id uuid not null references auth.users(id) on delete restrict,
  actor_role public.admin_role,
  action_type text not null check (action_type ~ '^[a-z][a-z0-9_.]{2,79}$'),
  target_type text not null check (target_type ~ '^[a-z][a-z0-9_]{1,39}$'),
  target_id text check (target_id is null or char_length(target_id) between 1 and 160),
  reason text check (reason is null or char_length(btrim(reason)) between 10 and 500),
  correlation_id uuid not null,
  result public.admin_audit_result not null,
  sanitized_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(sanitized_summary) = 'object' and octet_length(sanitized_summary::text) <= 4096),
  safe_error_category text check (safe_error_category is null or safe_error_category ~ '^[a-z][a-z0-9_]{2,79}$'),
  created_at timestamptz not null default now()
);

create table public.admin_notes (
  note_id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  author_admin_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  supersedes_note_id uuid references public.admin_notes(note_id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint admin_note_no_self_supersede check (supersedes_note_id is null or supersedes_note_id <> note_id)
);

insert into public.admin_role_permissions (role, permission) values
  ('super_admin','dashboard.read'),('super_admin','users.list'),('super_admin','users.read'),('super_admin','users.pii_reveal'),('super_admin','notes.write'),('super_admin','outbox.read'),('super_admin','outbox.provider_id.read'),('super_admin','audit.read'),('super_admin','security.read'),('super_admin','admins.manage'),
  ('admin','dashboard.read'),('admin','users.list'),('admin','users.read'),('admin','users.pii_reveal'),('admin','notes.write'),('admin','outbox.read'),('admin','outbox.provider_id.read'),('admin','audit.read'),('admin','security.read'),
  ('support','dashboard.read'),('support','users.list'),('support','users.read'),('support','notes.write'),('support','outbox.read'),
  ('analyst','dashboard.read'),
  ('security_viewer','dashboard.read'),('security_viewer','audit.read'),('security_viewer','security.read'),('security_viewer','outbox.read');

alter table public.admin_memberships enable row level security;
alter table public.admin_memberships force row level security;
alter table public.admin_role_permissions enable row level security;
alter table public.admin_role_permissions force row level security;
alter table public.admin_audit_events enable row level security;
alter table public.admin_audit_events force row level security;
alter table public.admin_notes enable row level security;
alter table public.admin_notes force row level security;

revoke all on public.admin_memberships from public, anon, authenticated, service_role;
revoke all on public.admin_role_permissions from public, anon, authenticated, service_role;
revoke all on public.admin_audit_events from public, anon, authenticated, service_role;
revoke all on public.admin_notes from public, anon, authenticated, service_role;
grant select, insert, update on public.admin_memberships to service_role;
grant select on public.admin_role_permissions to service_role;
grant select, insert on public.admin_audit_events to service_role;
grant select, insert on public.admin_notes to service_role;

create function public.admin_authorize(p_actor_id uuid, p_permission public.admin_permission)
returns public.admin_role
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role;
begin
  select m.role into v_role
  from public.admin_memberships as m
  join public.admin_role_permissions as rp on rp.role = m.role and rp.permission = p_permission
  where m.user_id = p_actor_id and m.status = 'active'
  for share of m;
  if v_role is null then raise exception 'admin_permission_denied' using errcode = '42501'; end if;
  return v_role;
end;
$$;

create function public.admin_record_attempt(
  p_actor_id uuid, p_action text, p_target_type text, p_target_id text,
  p_correlation_id uuid, p_result public.admin_audit_result, p_error_category text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_id uuid;
begin
  if not exists (select 1 from auth.users as u where u.id = p_actor_id) then return null; end if;
  select m.role into v_role from public.admin_memberships as m where m.user_id = p_actor_id;
  insert into public.admin_audit_events(actor_admin_id,actor_role,action_type,target_type,target_id,correlation_id,result,safe_error_category)
  values (p_actor_id,v_role,p_action,p_target_type,p_target_id,p_correlation_id,p_result,p_error_category)
  returning event_id into v_id;
  return v_id;
end;
$$;

create function public.admin_bootstrap_first_super_admin(p_user_id uuid, p_correlation_id uuid)
returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(867530901);
  if exists (select 1 from public.admin_memberships) then raise exception 'admin_bootstrap_already_completed'; end if;
  if not exists (select 1 from auth.users as u where u.id = p_user_id and u.email_confirmed_at is not null) then raise exception 'verified_user_required'; end if;
  if not exists (select 1 from auth.mfa_factors as f where f.user_id = p_user_id and f.status = 'verified') then raise exception 'verified_mfa_required'; end if;
  insert into public.admin_memberships(user_id,role,status,granted_by) values (p_user_id,'super_admin','active',p_user_id);
  insert into public.admin_audit_events(actor_admin_id,actor_role,action_type,target_type,target_id,reason,correlation_id,result,sanitized_summary)
  values (p_user_id,'super_admin','admin.bootstrap','admin_membership',p_user_id::text,'Initial trusted local administrator bootstrap',p_correlation_id,'success','{"role":"super_admin"}'::jsonb);
  return true;
end;
$$;

create function public.admin_manage_membership(
  p_actor_id uuid, p_target_id uuid, p_role public.admin_role, p_status public.admin_membership_status,
  p_reason text, p_correlation_id uuid
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare v_actor_role public.admin_role; v_before public.admin_memberships; v_active_supers integer;
begin
  v_actor_role := public.admin_authorize(p_actor_id,'admins.manage');
  if v_actor_role <> 'super_admin' then raise exception 'admin_permission_denied' using errcode='42501'; end if;
  if p_actor_id = p_target_id then raise exception 'self_membership_change_denied' using errcode='42501'; end if;
  if char_length(btrim(p_reason)) not between 10 and 500 then raise exception 'invalid_reason'; end if;
  perform pg_advisory_xact_lock(867530902);
  select * into v_before from public.admin_memberships as m where m.user_id=p_target_id for update;
  if v_before.user_id is null then
    if not exists(select 1 from auth.users as u where u.id=p_target_id and u.email_confirmed_at is not null) then raise exception 'verified_user_required'; end if;
    insert into public.admin_memberships(user_id,role,status,granted_by) values(p_target_id,p_role,p_status,p_actor_id);
  else
    if v_before.role='super_admin' and v_before.status='active' and (p_role<>'super_admin' or p_status<>'active') then
      select count(*) into v_active_supers from public.admin_memberships as m where m.role='super_admin' and m.status='active';
      if v_active_supers <= 1 then raise exception 'last_super_admin_protected' using errcode='23514'; end if;
    end if;
    update public.admin_memberships set role=p_role,status=p_status,version=version+1,updated_at=now(),
      revoked_by=case when p_status='revoked' then p_actor_id else null end,
      revoked_at=case when p_status='revoked' then now() else null end,
      revocation_reason=case when p_status='revoked' then btrim(p_reason) else null end
    where user_id=p_target_id;
  end if;
  insert into public.admin_audit_events(actor_admin_id,actor_role,action_type,target_type,target_id,reason,correlation_id,result,sanitized_summary)
  values(p_actor_id,v_actor_role,'admin.membership_changed','admin_membership',p_target_id::text,btrim(p_reason),p_correlation_id,'success',jsonb_build_object('role',p_role,'status',p_status));
  return true;
end;
$$;

create function public.admin_get_me(p_actor_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role;
begin
  v_role := public.admin_authorize(p_actor_id,'dashboard.read');
  return jsonb_build_object('userId',p_actor_id,'role',v_role,'status','active','permissions',
    (select coalesce(jsonb_agg(rp.permission order by rp.permission),'[]'::jsonb) from public.admin_role_permissions rp where rp.role=v_role));
end;
$$;

create function public.admin_dashboard_summary(p_actor_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_now timestamptz:=now();
begin
  v_role := public.admin_authorize(p_actor_id,'dashboard.read');
  return jsonb_build_object(
    'dataTimestamp',v_now,'reportingTimezone','Asia/Baghdad','queryStatus','ok',
    'accounts',jsonb_build_object(
      'total',(select count(*) from auth.users),
      'today',(select count(*) from auth.users u where (u.created_at at time zone 'Asia/Baghdad')::date=(v_now at time zone 'Asia/Baghdad')::date),
      'last7Days',(select count(*) from auth.users u where u.created_at>=v_now-interval '7 days'),
      'last30Days',(select count(*) from auth.users u where u.created_at>=v_now-interval '30 days'),
      'verified',(select count(*) from auth.users u where u.email_confirmed_at is not null),
      'unverified',(select count(*) from auth.users u where u.email_confirmed_at is null),
      'completedProfiles',(select count(*) from public.profiles),
      'incompleteProfiles',(select count(*) from auth.users u where not exists(select 1 from public.profiles p where p.id=u.id))
    ),
    'language',(select coalesce(jsonb_object_agg(x.preferred_language,x.count),'{}'::jsonb) from (select p.preferred_language,count(*) from public.profiles p group by p.preferred_language) x),
    'businessOwnership',(select jsonb_build_object('owners',count(*) filter(where p.owns_or_manages_business),'nonOwners',count(*) filter(where not p.owns_or_manages_business)) from public.profiles p),
    'businessTypes',(select coalesce(jsonb_object_agg(x.business_type,x.count),'{}'::jsonb) from (select p.business_type,count(*) from public.profiles p where p.business_type is not null group by p.business_type) x),
    'branchDistribution',(select jsonb_build_object('1',count(*) filter(where p.branch_count=1),'2to5',count(*) filter(where p.branch_count between 2 and 5),'6to20',count(*) filter(where p.branch_count between 6 and 20),'21plus',count(*) filter(where p.branch_count>=21)) from public.profiles p),
    'awarenessSources',(select coalesce(jsonb_object_agg(x.awareness_source,x.count),'{}'::jsonb) from (select coalesce(p.awareness_source,'not_specified') awareness_source,count(*) from public.profiles p group by coalesce(p.awareness_source,'not_specified')) x),
    'outbox',(select jsonb_build_object('total',count(*),'reconciliationRequired',count(*) filter(where o.delivery_status='reconciliation_required'),'byStatus',coalesce((select jsonb_object_agg(y.delivery_status,y.count) from (select delivery_status,count(*) from public.transactional_email_outbox group by delivery_status)y),'{}'::jsonb)) from public.transactional_email_outbox o),
    'availability',jsonb_build_object('authAccounts',true,'profiles',true,'outbox',true,'registrationStarted',false,'trials',false,'downloads',false,'licensing',false,'payments',false,'support',false,'revenue',false)
  );
end;
$$;

create function public.admin_list_users(
  p_actor_id uuid,p_limit integer,p_offset integer,p_search text,p_sort text,p_direction text,p_filter jsonb
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_total bigint; v_rows jsonb;
begin
  v_role:=public.admin_authorize(p_actor_id,'users.list');
  if p_limit not between 1 and 100 or p_offset not between 0 and 100000 or char_length(coalesce(p_search,''))>160 then raise exception 'invalid_pagination'; end if;
  if p_sort not in ('created_at','full_name','email_verified','preferred_language') or p_direction not in ('asc','desc') then raise exception 'invalid_sort'; end if;
  if exists(select 1 from jsonb_object_keys(coalesce(p_filter,'{}'::jsonb)) k where k not in ('verified','profileCompleted','language','ownsBusiness')) then raise exception 'invalid_filter'; end if;
  with base as (
    select u.id,u.email,u.email_confirmed_at,u.created_at,u.last_sign_in_at,p.full_name,p.phone_e164,p.preferred_language,p.owns_or_manages_business,p.business_name,p.business_type,p.branch_count,p.awareness_source,(p.id is not null) profile_completed
    from auth.users u left join public.profiles p on p.id=u.id
    where (coalesce(p_search,'')='' or u.id::text=p_search or lower(u.email)=lower(p_search) or p.phone_e164=p_search or p.full_name ilike '%'||replace(replace(p_search,'%','\%'),'_','\_')||'%' escape '\')
      and (not (p_filter?'verified') or (u.email_confirmed_at is not null)=(p_filter->>'verified')::boolean)
      and (not (p_filter?'profileCompleted') or (p.id is not null)=(p_filter->>'profileCompleted')::boolean)
      and (not (p_filter?'language') or p.preferred_language=p_filter->>'language')
      and (not (p_filter?'ownsBusiness') or p.owns_or_manages_business=(p_filter->>'ownsBusiness')::boolean)
  ), page as (
    select * from base order by
      case when p_sort='created_at' and p_direction='asc' then created_at end asc,
      case when p_sort='created_at' and p_direction='desc' then created_at end desc,
      case when p_sort='full_name' and p_direction='asc' then full_name end asc nulls last,
      case when p_sort='full_name' and p_direction='desc' then full_name end desc nulls last,
      case when p_sort='email_verified' and p_direction='asc' then email_confirmed_at end asc nulls last,
      case when p_sort='email_verified' and p_direction='desc' then email_confirmed_at end desc nulls last,
      case when p_sort='preferred_language' and p_direction='asc' then preferred_language end asc nulls last,
      case when p_sort='preferred_language' and p_direction='desc' then preferred_language end desc nulls last,
      id asc limit p_limit offset p_offset
  )
  select (select count(*) from base),coalesce(jsonb_agg(jsonb_build_object('id',id,'fullName',full_name,'emailMasked',public.admin_mask_email(email),'phoneMasked',public.admin_mask_phone(phone_e164),'emailVerified',email_confirmed_at is not null,'profileCompleted',profile_completed,'preferredLanguage',preferred_language,'ownsBusiness',owns_or_manages_business,'businessName',business_name,'businessType',business_type,'branchCount',branch_count,'awarenessSource',awareness_source,'createdAt',created_at,'lastSignInAt',last_sign_in_at)),'[]'::jsonb) into v_total,v_rows from page;
  return jsonb_build_object('items',v_rows,'total',v_total,'limit',p_limit,'offset',p_offset);
end;
$$;

create function public.admin_mask_email(p_value text) returns text language sql immutable set search_path = '' as $$
  select case when p_value is null then null when position('@' in p_value)<=1 then '***' else left(p_value,1)||'***@'||split_part(p_value,'@',2) end
$$;
create function public.admin_mask_phone(p_value text) returns text language sql immutable set search_path = '' as $$
  select case when p_value is null then null when length(p_value)<5 then '***' else left(p_value,3)||repeat('*',greatest(length(p_value)-5,3))||right(p_value,2) end
$$;

create function public.admin_get_user(p_actor_id uuid,p_user_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_result jsonb;
begin
  v_role:=public.admin_authorize(p_actor_id,'users.read');
  select jsonb_build_object('id',u.id,'fullName',p.full_name,'emailMasked',public.admin_mask_email(u.email),'phoneMasked',public.admin_mask_phone(p.phone_e164),'emailVerified',u.email_confirmed_at is not null,'profileCompleted',p.id is not null,'preferredLanguage',p.preferred_language,'ownsBusiness',p.owns_or_manages_business,'businessName',p.business_name,'businessType',p.business_type,'businessTypeOther',p.business_type_other,'branchCount',p.branch_count,'awarenessSource',p.awareness_source,'createdAt',u.created_at,'lastSignInAt',u.last_sign_in_at,'notes',coalesce((select jsonb_agg(jsonb_build_object('id',n.note_id,'body',n.body,'authorId',n.author_admin_id,'supersedesNoteId',n.supersedes_note_id,'createdAt',n.created_at) order by n.created_at desc) from public.admin_notes n where n.user_id=u.id),'[]'::jsonb)) into v_result
  from auth.users u left join public.profiles p on p.id=u.id where u.id=p_user_id;
  if v_result is null then raise exception 'user_not_found'; end if;
  return v_result;
end;
$$;

create function public.admin_reveal_user_pii(p_actor_id uuid,p_user_id uuid,p_reason text,p_correlation_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_result jsonb;
begin
  v_role:=public.admin_authorize(p_actor_id,'users.pii_reveal');
  if char_length(btrim(p_reason)) not between 10 and 500 then raise exception 'invalid_reason'; end if;
  select jsonb_build_object('email',u.email,'phone',p.phone_e164) into v_result from auth.users u left join public.profiles p on p.id=u.id where u.id=p_user_id;
  if v_result is null then raise exception 'user_not_found'; end if;
  insert into public.admin_audit_events(actor_admin_id,actor_role,action_type,target_type,target_id,reason,correlation_id,result,sanitized_summary)
  values(p_actor_id,v_role,'user.pii_revealed','user',p_user_id::text,btrim(p_reason),p_correlation_id,'success','{"fields":["email","phone"]}'::jsonb);
  return v_result;
end;
$$;

create function public.admin_add_internal_note(p_actor_id uuid,p_user_id uuid,p_body text,p_supersedes uuid,p_correlation_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_note public.admin_notes;
begin
  v_role:=public.admin_authorize(p_actor_id,'notes.write');
  if p_supersedes is not null and not exists(select 1 from public.admin_notes n where n.note_id=p_supersedes and n.user_id=p_user_id) then raise exception 'invalid_supersedes'; end if;
  insert into public.admin_notes(user_id,author_admin_id,body,supersedes_note_id) values(p_user_id,p_actor_id,btrim(p_body),p_supersedes) returning * into v_note;
  insert into public.admin_audit_events(actor_admin_id,actor_role,action_type,target_type,target_id,correlation_id,result,sanitized_summary)
  values(p_actor_id,v_role,'user.note_added','user',p_user_id::text,p_correlation_id,'success',jsonb_build_object('noteId',v_note.note_id,'supersedesNoteId',p_supersedes));
  return jsonb_build_object('id',v_note.note_id,'body',v_note.body,'authorId',v_note.author_admin_id,'supersedesNoteId',v_note.supersedes_note_id,'createdAt',v_note.created_at);
end;
$$;

create function public.admin_list_outbox(p_actor_id uuid,p_limit integer,p_offset integer,p_status text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_provider boolean; v_rows jsonb; v_total bigint;
begin
  v_role:=public.admin_authorize(p_actor_id,'outbox.read');
  v_provider:=exists(select 1 from public.admin_role_permissions rp where rp.role=v_role and rp.permission='outbox.provider_id.read');
  if p_limit not between 1 and 100 or p_offset not between 0 and 100000 or (p_status is not null and p_status not in ('pending','claimed','sending','failed','reconciliation_required','sent')) then raise exception 'invalid_filter'; end if;
  select count(*) into v_total from public.transactional_email_outbox o where p_status is null or o.delivery_status=p_status;
  select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'eventType',o.template_type,'recipientReference',left(o.user_id::text,8)||'â€¦','status',o.delivery_status,'attemptCount',o.attempt_count,'lastAttemptAt',o.last_attempt_at,'nextAttemptAt',o.next_attempt_at,'sentAt',o.sent_at,'reconciliationRequired',o.delivery_status='reconciliation_required','providerMessageId',case when v_provider then o.provider_message_id else null end,'failureCategory',o.last_error_category) order by o.created_at desc),'[]'::jsonb) into v_rows
  from (select * from public.transactional_email_outbox o where p_status is null or o.delivery_status=p_status order by o.created_at desc limit p_limit offset p_offset)o;
  return jsonb_build_object('items',v_rows,'total',v_total,'limit',p_limit,'offset',p_offset);
end;
$$;

create function public.admin_list_audit_events(p_actor_id uuid,p_limit integer,p_offset integer,p_filters jsonb,p_security_only boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_role public.admin_role; v_rows jsonb; v_total bigint;
begin
  v_role:=public.admin_authorize(p_actor_id,case when p_security_only then 'security.read'::public.admin_permission else 'audit.read'::public.admin_permission end);
  if p_limit not between 1 and 100 or p_offset not between 0 and 100000 then raise exception 'invalid_pagination'; end if;
  if exists(select 1 from jsonb_object_keys(coalesce(p_filters,'{}'::jsonb)) k where k not in ('actorId','action','result','targetType','correlationId','from','to')) then raise exception 'invalid_filter'; end if;
  with filtered as (
    select e.* from public.admin_audit_events e where
      (not(p_filters?'actorId') or e.actor_admin_id=(p_filters->>'actorId')::uuid) and
      (not(p_filters?'action') or e.action_type=p_filters->>'action') and
      (not(p_filters?'result') or e.result::text=p_filters->>'result') and
      (not(p_filters?'targetType') or e.target_type=p_filters->>'targetType') and
      (not(p_filters?'correlationId') or e.correlation_id=(p_filters->>'correlationId')::uuid) and
      (not(p_filters?'from') or e.created_at>=(p_filters->>'from')::timestamptz) and
      (not(p_filters?'to') or e.created_at<=(p_filters->>'to')::timestamptz) and
      (not p_security_only or e.result in ('denied','failed') or e.action_type like 'admin.%' or e.action_type='user.pii_revealed' or e.action_type like 'outbox.%')
  ), page as (select * from filtered order by created_at desc,event_id desc limit p_limit offset p_offset)
  select (select count(*) from filtered),coalesce(jsonb_agg(jsonb_build_object('id',event_id,'actorId',actor_admin_id,'actorRole',actor_role,'action',action_type,'targetType',target_type,'targetId',target_id,'reason',reason,'correlationId',correlation_id,'result',result,'summary',sanitized_summary,'errorCategory',safe_error_category,'createdAt',created_at)),'[]'::jsonb) into v_total,v_rows from page;
  return jsonb_build_object('items',v_rows,'total',v_total,'limit',p_limit,'offset',p_offset);
end;
$$;

-- Browser roles get no table or function access. Only the trusted server API may execute.
revoke all on function public.admin_authorize(uuid,public.admin_permission) from public,anon,authenticated;
revoke all on function public.admin_record_attempt(uuid,text,text,text,uuid,public.admin_audit_result,text) from public,anon,authenticated;
revoke all on function public.admin_bootstrap_first_super_admin(uuid,uuid) from public,anon,authenticated;
revoke all on function public.admin_manage_membership(uuid,uuid,public.admin_role,public.admin_membership_status,text,uuid) from public,anon,authenticated;
revoke all on function public.admin_get_me(uuid) from public,anon,authenticated;
revoke all on function public.admin_dashboard_summary(uuid) from public,anon,authenticated;
revoke all on function public.admin_list_users(uuid,integer,integer,text,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.admin_mask_email(text) from public,anon,authenticated;
revoke all on function public.admin_mask_phone(text) from public,anon,authenticated;
revoke all on function public.admin_get_user(uuid,uuid) from public,anon,authenticated;
revoke all on function public.admin_reveal_user_pii(uuid,uuid,text,uuid) from public,anon,authenticated;
revoke all on function public.admin_add_internal_note(uuid,uuid,text,uuid,uuid) from public,anon,authenticated;
revoke all on function public.admin_list_outbox(uuid,integer,integer,text) from public,anon,authenticated;
revoke all on function public.admin_list_audit_events(uuid,integer,integer,jsonb,boolean) from public,anon,authenticated;

grant execute on function public.admin_authorize(uuid,public.admin_permission) to service_role;
grant execute on function public.admin_record_attempt(uuid,text,text,text,uuid,public.admin_audit_result,text) to service_role;
grant execute on function public.admin_bootstrap_first_super_admin(uuid,uuid) to service_role;
grant execute on function public.admin_manage_membership(uuid,uuid,public.admin_role,public.admin_membership_status,text,uuid) to service_role;
grant execute on function public.admin_get_me(uuid) to service_role;
grant execute on function public.admin_dashboard_summary(uuid) to service_role;
grant execute on function public.admin_list_users(uuid,integer,integer,text,text,text,jsonb) to service_role;
grant execute on function public.admin_get_user(uuid,uuid) to service_role;
grant execute on function public.admin_reveal_user_pii(uuid,uuid,text,uuid) to service_role;
grant execute on function public.admin_add_internal_note(uuid,uuid,text,uuid,uuid) to service_role;
grant execute on function public.admin_list_outbox(uuid,integer,integer,text) to service_role;
grant execute on function public.admin_list_audit_events(uuid,integer,integer,jsonb,boolean) to service_role;

commit;
