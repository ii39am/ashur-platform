-- Disposable administration fixtures only. No production identities or data.
insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','authenticated','authenticated','analyst@example.test','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','authenticated','authenticated','security@example.test','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','authenticated','authenticated','admin@example.test','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000007','authenticated','authenticated','super2@example.test','',now(),'{}','{}',now(),now());
insert into auth.mfa_factors(id,user_id,friendly_name,factor_type,status,created_at,updated_at,secret)
values('20000000-0000-4000-8000-000000000001','10000000-0000-0000-0000-000000000001','Admin test TOTP','totp','verified',now(),now(),'test-only-secret');
set role service_role;
select public.admin_bootstrap_first_super_admin('10000000-0000-0000-0000-000000000001','30000000-0000-4000-8000-000000000001');
reset role;
insert into public.admin_memberships(user_id,role,status,granted_by) values
('10000000-0000-0000-0000-000000000002','support','active','10000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000004','analyst','active','10000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000005','security_viewer','active','10000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000006','admin','active','10000000-0000-0000-0000-000000000001');
