\set ON_ERROR_STOP on
-- Run after fixtures and command-level role tests in scripts/test-database-security.ps1.
set role service_role;

-- Legitimate retry is idempotent.
select (public.finalize_ashur_registration('10000000-0000-0000-0000-000000000001','User A','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('a',64))).id;

do $$
begin
  if (select count(*) from public.profiles where id='10000000-0000-0000-0000-000000000001') <> 1 then raise exception 'duplicate profile'; end if;
  if (select count(*) from public.user_legal_acceptances where user_id='10000000-0000-0000-0000-000000000001') <> 2 then raise exception 'duplicate legal acceptance'; end if;
  if (select count(*) from public.transactional_email_outbox where user_id='10000000-0000-0000-0000-000000000001') <> 1 then raise exception 'duplicate welcome event'; end if;
end $$;

-- One active claim and matching-token completion.
create temporary table first_claim as select * from public.claim_transactional_email('10000000-0000-0000-0000-000000000001','account_created_welcome');
reset role;
update public.transactional_email_outbox set claim_expires_at = now() - interval '1 minute' where id = (select outbox_id from first_claim);
set role service_role;
create temporary table newer_claim as select * from public.claim_transactional_email('10000000-0000-0000-0000-000000000001','account_created_welcome');
do $$
declare old_claim record; current_claim record;
begin
  if (select count(*) from first_claim) <> 1 then raise exception 'first claim missing'; end if;
  if (select count(*) from newer_claim) <> 1 then raise exception 'expired pre-send claim was not reclaimed'; end if;
  if (select count(*) from public.claim_transactional_email('10000000-0000-0000-0000-000000000001','account_created_welcome')) <> 0 then raise exception 'concurrent duplicate claim'; end if;
  select * into old_claim from first_claim; select * into current_claim from newer_claim;
  if public.mark_transactional_email_sending(old_claim.outbox_id, old_claim.claim_token) then raise exception 'stale claim token accepted'; end if;
  if not public.mark_transactional_email_sending(current_claim.outbox_id, current_claim.claim_token) then raise exception 'valid claim token rejected'; end if;
  if public.complete_transactional_email(current_claim.outbox_id, old_claim.claim_token, true, 'provider-wrong', null) then raise exception 'stale completion token accepted'; end if;
  if not public.complete_transactional_email(current_claim.outbox_id, current_claim.claim_token, false, null, 'provider_rate_limited') then raise exception 'retryable completion rejected'; end if;
end $$;

-- Backoff prevents immediate retry.
do $$ begin
  if (select count(*) from public.claim_transactional_email('10000000-0000-0000-0000-000000000001','account_created_welcome')) <> 0 then raise exception 'backoff not enforced'; end if;
end $$;
reset role;
do $$
declare delay_seconds double precision;
begin
  select extract(epoch from (next_attempt_at - last_attempt_at)) into delay_seconds from public.transactional_email_outbox where user_id='10000000-0000-0000-0000-000000000001';
  if delay_seconds < 59 or delay_seconds > 61 then raise exception 'bounded exponential backoff incorrect: %', delay_seconds; end if;
end $$;
update public.transactional_email_outbox set delivery_status='failed', attempt_count=5, next_attempt_at=now(), claim_token=null, claim_expires_at=null where user_id='10000000-0000-0000-0000-000000000001';
set role service_role;
do $$ begin
  if (select count(*) from public.claim_transactional_email('10000000-0000-0000-0000-000000000001','account_created_welcome')) <> 0 then raise exception 'maximum attempts not enforced'; end if;
end $$;
reset role;

-- Verify immutable server state created by the transaction.
do $$
begin
  if exists (select 1 from public.user_legal_acceptances where document_version not in ('terms-v1','privacy-v1')) then raise exception 'unexpected legal version'; end if;
  if (select count(*) from public.transactional_email_outbox where template_type='account_created_welcome' and user_id='10000000-0000-0000-0000-000000000001') <> 1 then raise exception 'welcome uniqueness broken'; end if;
end $$;
