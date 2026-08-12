set role service_role;
do $$
declare r jsonb; note jsonb;
begin
  if (public.admin_get_me('10000000-0000-0000-0000-000000000001')->>'role') <> 'super_admin' then raise exception 'super admin denied'; end if;
  if (public.admin_get_me('10000000-0000-0000-0000-000000000002')->>'role') <> 'support' then raise exception 'support denied'; end if;
  begin perform public.admin_authorize('10000000-0000-0000-0000-000000000002','users.pii_reveal'); raise exception 'support PII escalation'; exception when insufficient_privilege then null; end;
  begin perform public.admin_authorize('10000000-0000-0000-0000-000000000004','users.read'); raise exception 'analyst personal data access'; exception when insufficient_privilege then null; end;
  begin perform public.admin_authorize('10000000-0000-0000-0000-000000000005','notes.write'); raise exception 'security viewer mutation'; exception when insufficient_privilege then null; end;
  begin perform public.admin_manage_membership('10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000004','super_admin','active','Attempted self escalation prevention','31000000-0000-4000-8000-000000000001'); raise exception 'cross-role escalation'; exception when insufficient_privilege then null; end;
  begin perform public.admin_manage_membership('10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','admin','active','Self role changes are prohibited','31000000-0000-4000-8000-000000000002'); raise exception 'self change accepted'; exception when insufficient_privilege then null; end;

  r:=public.admin_list_users('10000000-0000-0000-0000-000000000006',25,0,'','created_at','desc','{}');
  if r::text like '%usera@example.test%' or r::text like '%+9647701234567%' then raise exception 'PII was not masked'; end if;
  begin perform public.admin_list_users('10000000-0000-0000-0000-000000000006',101,0,'','created_at','desc','{}'); raise exception 'page limit bypass'; exception when others then if sqlerrm not like '%invalid_pagination%' then raise; end if; end;
  begin perform public.admin_list_users('10000000-0000-0000-0000-000000000006',25,0,'','password','desc','{}'); raise exception 'sort allowlist bypass'; exception when others then if sqlerrm not like '%invalid_sort%' then raise; end if; end;

  r:=public.admin_reveal_user_pii('10000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','Investigating an authorized account request','32000000-0000-4000-8000-000000000001');
  if r->>'email' is null then raise exception 'authorized reveal failed'; end if;
  if not exists(select 1 from public.admin_audit_events e where e.correlation_id='32000000-0000-4000-8000-000000000001' and e.action_type='user.pii_revealed') then raise exception 'PII audit missing'; end if;
  begin perform public.admin_reveal_user_pii('10000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','short','32000000-0000-4000-8000-000000000002'); raise exception 'short reason accepted'; exception when others then if sqlerrm not like '%invalid_reason%' then raise; end if; end;

  note:=public.admin_add_internal_note('10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Customer requested an account review.',null,'33000000-0000-4000-8000-000000000001');
  if note->>'id' is null or not exists(select 1 from public.admin_audit_events e where e.correlation_id='33000000-0000-4000-8000-000000000001') then raise exception 'note/audit atomicity failed'; end if;

  update public.admin_memberships set status='suspended' where user_id='10000000-0000-0000-0000-000000000002';
  begin perform public.admin_get_me('10000000-0000-0000-0000-000000000002'); raise exception 'revoked membership remained active'; exception when insufficient_privilege then null; end;
end $$;
reset role;
