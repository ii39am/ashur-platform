\set ON_ERROR_STOP on
insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','authenticated','authenticated','a@example.test','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','authenticated','authenticated','b@example.test','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','authenticated','authenticated','unverified@example.test','',null,'{}','{}',now(),now());

set role service_role;
select (public.finalize_ashur_registration('10000000-0000-0000-0000-000000000001','User A','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'1.0.0','1.0.0',repeat('a',64))).id;
reset role;

do $$
begin
  if (select count(*) from public.profiles where id='10000000-0000-0000-0000-000000000001') <> 1 then raise exception 'fixture profile missing'; end if;
  if (select count(*) from public.user_legal_acceptances where user_id='10000000-0000-0000-0000-000000000001') <> 2 then raise exception 'legal records missing'; end if;
  if (select count(*) from public.transactional_email_outbox where user_id='10000000-0000-0000-0000-000000000001') <> 1 then raise exception 'outbox event missing'; end if;
end $$;
