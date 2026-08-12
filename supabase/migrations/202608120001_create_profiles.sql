-- Unapplied clean migration for Ashur registration.
-- `accepted_at` records when the server receives the acceptance submission from an
-- authenticated, email-verified user; document versions are selected server-side.
begin;

create extension if not exists pgcrypto with schema extensions;

-- Deliberately not IF NOT EXISTS: an unexpected pre-existing object must abort the transaction.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 160),
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  owns_or_manages_business boolean not null,
  business_name text,
  business_type text,
  business_type_other text,
  branch_count integer,
  heard_about_ashur boolean not null,
  awareness_source text,
  preferred_language text not null check (preferred_language in ('en', 'ar')),
  marketing_consent boolean not null default false,
  marketing_consent_updated_at timestamptz not null default now(),
  registration_payload_hash text not null check (registration_payload_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_business_type_check check (business_type is null or business_type in ('retail','restaurant','grocery','pharmacy','fashion','electronics','beauty','services','wholesale','other')),
  constraint profiles_awareness_source_check check (awareness_source is null or awareness_source in ('social','referral','representative','event','search','other')),
  constraint profiles_business_fields_check check (
    (owns_or_manages_business and business_name is not null and char_length(btrim(business_name)) between 2 and 200 and business_type is not null and branch_count between 1 and 1000 and ((business_type = 'other' and business_type_other is not null and char_length(btrim(business_type_other)) between 2 and 120) or (business_type <> 'other' and business_type_other is null)))
    or
    (not owns_or_manages_business and business_name is null and business_type is null and business_type_other is null and branch_count is null)
  ),
  constraint profiles_awareness_fields_check check (heard_about_ashur or (not heard_about_ashur and awareness_source is null))
);

create table public.user_legal_acceptances (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('terms', 'privacy')),
  document_version text not null check (document_version ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$'),
  accepted_at timestamptz not null default now(),
  preferred_language_at_acceptance text not null check (preferred_language_at_acceptance in ('en', 'ar')),
  created_at timestamptz not null default now(),
  unique (user_id, document_type, document_version)
);

create table public.transactional_email_outbox (
  id uuid primary key default extensions.gen_random_uuid(),
  event_key text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_type text not null check (template_type = 'account_created_welcome'),
  preferred_language text not null check (preferred_language in ('en', 'ar')),
  delivery_status text not null default 'pending' check (delivery_status in ('pending','claimed','sending','failed','reconciliation_required','sent')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 5),
  last_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  claim_token uuid,
  claim_expires_at timestamptz,
  send_started_at timestamptz,
  provider_message_id text check (provider_message_id is null or char_length(provider_message_id) between 1 and 256),
  provider_idempotency_key text not null unique,
  last_error_category text check (last_error_category is null or last_error_category in ('provider_rejected','provider_rate_limited','provider_unavailable','delivery_unknown','database_completion_failed')),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (user_id, template_type),
  constraint outbox_sent_state_check check ((delivery_status = 'sent' and sent_at is not null and provider_message_id is not null) or (delivery_status <> 'sent' and sent_at is null)),
  constraint outbox_claim_state_check check ((delivery_status in ('claimed','sending') and claim_token is not null and claim_expires_at is not null) or (delivery_status not in ('claimed','sending') and claim_token is null and claim_expires_at is null))
);

alter table public.profiles enable row level security;
alter table public.user_legal_acceptances enable row level security;
alter table public.transactional_email_outbox enable row level security;

revoke all on public.profiles from public, anon, authenticated, service_role;
revoke all on public.user_legal_acceptances from public, anon, authenticated, service_role;
revoke all on public.transactional_email_outbox from public, anon, authenticated, service_role;

grant select (id, full_name, phone_e164, owns_or_manages_business, business_name, business_type, business_type_other, branch_count, heard_about_ashur, awareness_source, preferred_language, marketing_consent, marketing_consent_updated_at, created_at, updated_at) on public.profiles to authenticated;
grant update (full_name, phone_e164, owns_or_manages_business, business_name, business_type, business_type_other, branch_count, heard_about_ashur, awareness_source, preferred_language, marketing_consent) on public.profiles to authenticated;
grant select on public.user_legal_acceptances to authenticated;
grant select on public.profiles to service_role;
grant select on public.user_legal_acceptances to service_role;
grant select on public.transactional_email_outbox to service_role;

create policy profiles_select_own on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy legal_acceptances_select_own on public.user_legal_acceptances for select to authenticated using (user_id = (select auth.uid()));
-- Intentionally no browser-role policies exist on the outbox and no INSERT/DELETE policies exist on any table.

create function public.set_profile_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  if new.marketing_consent is distinct from old.marketing_consent then
    new.marketing_consent_updated_at = now();
  else
    new.marketing_consent_updated_at = old.marketing_consent_updated_at;
  end if;
  return new;
end;
$$;
revoke all on function public.set_profile_updated_at() from public, anon, authenticated;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_profile_updated_at();

-- Service-only transactional finalization. The Edge Function derives p_user_id from
-- auth.getUser(), selects legal versions server-side, and validates all arguments.
create function public.finalize_ashur_registration(
  p_user_id uuid,
  p_full_name text,
  p_phone_e164 text,
  p_owns_business boolean,
  p_business_name text,
  p_business_type text,
  p_business_type_other text,
  p_branch_count integer,
  p_heard_about_ashur boolean,
  p_awareness_source text,
  p_preferred_language text,
  p_marketing_consent boolean,
  p_terms_selected boolean,
  p_privacy_selected boolean,
  p_terms_version text,
  p_privacy_version text,
  p_payload_hash text
) returns public.profiles
language plpgsql security definer set search_path = '' as $$
declare
  existing public.profiles;
  verified_at timestamptz;
begin
  select u.email_confirmed_at into verified_at from auth.users as u where u.id = p_user_id;
  if verified_at is null then raise exception 'verified_user_required' using errcode = '42501'; end if;
  if p_terms_selected is not true or p_privacy_selected is not true then raise exception 'legal_acceptance_required' using errcode = '23514'; end if;

  insert into public.profiles (id, full_name, phone_e164, owns_or_manages_business, business_name, business_type, business_type_other, branch_count, heard_about_ashur, awareness_source, preferred_language, marketing_consent, registration_payload_hash)
  values (p_user_id, btrim(p_full_name), p_phone_e164, p_owns_business, nullif(btrim(p_business_name), ''), p_business_type, nullif(btrim(p_business_type_other), ''), p_branch_count, p_heard_about_ashur, p_awareness_source, p_preferred_language, p_marketing_consent, p_payload_hash)
  on conflict (id) do nothing;

  select * into existing from public.profiles where id = p_user_id;
  if existing.id is null then raise exception 'profile_creation_failed'; end if;
  if existing.registration_payload_hash <> p_payload_hash then raise exception 'registration_already_completed' using errcode = '23505'; end if;

  insert into public.user_legal_acceptances (user_id, document_type, document_version, preferred_language_at_acceptance)
  values (p_user_id, 'terms', p_terms_version, p_preferred_language), (p_user_id, 'privacy', p_privacy_version, p_preferred_language)
  on conflict (user_id, document_type, document_version) do nothing;

  insert into public.transactional_email_outbox (event_key, user_id, template_type, preferred_language, provider_idempotency_key)
  values ('account_created_welcome:' || p_user_id::text, p_user_id, 'account_created_welcome', p_preferred_language, 'ashur-welcome-' || p_user_id::text)
  on conflict (user_id, template_type) do nothing;

  return existing;
end;
$$;

create function public.claim_transactional_email(p_user_id uuid, p_template_type text)
returns table(outbox_id uuid, claim_token uuid, preferred_language text, attempt_count integer, provider_idempotency_key text)
language plpgsql security definer set search_path = '' as $$
begin
  return query
  update public.transactional_email_outbox as o
  set delivery_status = 'claimed', attempt_count = o.attempt_count + 1, last_attempt_at = now(),
      claim_token = extensions.gen_random_uuid(), claim_expires_at = now() + interval '10 minutes', send_started_at = null, last_error_category = null
  where o.user_id = p_user_id and o.template_type = p_template_type and o.attempt_count < 5
    and ((o.delivery_status in ('pending','failed') and o.next_attempt_at <= now())
      or (o.delivery_status = 'claimed' and o.claim_expires_at < now() and o.send_started_at is null))
  returning o.id, o.claim_token, o.preferred_language, o.attempt_count, o.provider_idempotency_key;
end;
$$;

create function public.mark_transactional_email_sending(p_outbox_id uuid, p_claim_token uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare changed boolean;
begin
  update public.transactional_email_outbox set delivery_status = 'sending', send_started_at = now()
  where id = p_outbox_id and claim_token = p_claim_token and delivery_status = 'claimed' and claim_expires_at > now()
  returning true into changed;
  return coalesce(changed, false);
end;
$$;

create function public.complete_transactional_email(
  p_outbox_id uuid, p_claim_token uuid, p_accepted boolean, p_provider_message_id text, p_error_category text
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare changed boolean;
begin
  update public.transactional_email_outbox as o
  set delivery_status = case when p_accepted then 'sent' else 'failed' end,
      provider_message_id = case when p_accepted then nullif(p_provider_message_id, '') else null end,
      sent_at = case when p_accepted then now() else null end,
      next_attempt_at = case when p_accepted then o.next_attempt_at else now() + make_interval(secs => least(3600, 30 * power(2, greatest(o.attempt_count - 1, 0))::integer)) end,
      last_error_category = case when p_accepted then null else p_error_category end,
      claim_token = null, claim_expires_at = null
  where o.id = p_outbox_id and o.claim_token = p_claim_token and o.delivery_status = 'sending'
    and ((p_accepted and nullif(p_provider_message_id, '') is not null) or (not p_accepted and p_error_category in ('provider_rejected','provider_rate_limited','provider_unavailable')))
  returning true into changed;
  return coalesce(changed, false);
end;
$$;

create function public.mark_transactional_email_unknown(p_outbox_id uuid, p_claim_token uuid, p_error_category text, p_provider_message_id text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare changed boolean;
begin
  update public.transactional_email_outbox
  set delivery_status = 'reconciliation_required', last_error_category = p_error_category,
      provider_message_id = coalesce(nullif(p_provider_message_id, ''), provider_message_id), claim_token = null, claim_expires_at = null
  where id = p_outbox_id and claim_token = p_claim_token and delivery_status = 'sending'
    and p_error_category in ('delivery_unknown','database_completion_failed')
  returning true into changed;
  return coalesce(changed, false);
end;
$$;

revoke all on function public.finalize_ashur_registration(uuid,text,text,boolean,text,text,text,integer,boolean,text,text,boolean,boolean,boolean,text,text,text) from public, anon, authenticated;
revoke all on function public.claim_transactional_email(uuid,text) from public, anon, authenticated;
revoke all on function public.mark_transactional_email_sending(uuid,uuid) from public, anon, authenticated;
revoke all on function public.complete_transactional_email(uuid,uuid,boolean,text,text) from public, anon, authenticated;
revoke all on function public.mark_transactional_email_unknown(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.finalize_ashur_registration(uuid,text,text,boolean,text,text,text,integer,boolean,text,text,boolean,boolean,boolean,text,text,text) to service_role;
grant execute on function public.claim_transactional_email(uuid,text) to service_role;
grant execute on function public.mark_transactional_email_sending(uuid,uuid) to service_role;
grant execute on function public.complete_transactional_email(uuid,uuid,boolean,text,text) to service_role;
grant execute on function public.mark_transactional_email_unknown(uuid,uuid,text,text) to service_role;

commit;
