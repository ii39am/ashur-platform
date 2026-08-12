-- LOCAL/TRUSTED USE ONLY. Never put credentials or a fixed user ID in this file.
-- Run with psql variable user_id after the user has verified email and enrolled MFA:
-- psql ... -v user_id='00000000-0000-0000-0000-000000000000' -f supabase/scripts/bootstrap_first_admin.sql
begin;
set local role service_role;
select public.admin_bootstrap_first_super_admin(:'user_id'::uuid, extensions.gen_random_uuid());
commit;
