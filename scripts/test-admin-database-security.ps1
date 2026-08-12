$ErrorActionPreference='Stop'
$workspace=Split-Path -Parent $PSScriptRoot
Set-Location $workspace
$cli=Join-Path $workspace 'apps/admin-web/node_modules/.bin/supabase.cmd'
if(-not(Test-Path -LiteralPath $cli)){throw 'Run npm ci in apps/admin-web first.'}
function Db([string]$Sql,[bool]$Ok=$true){$c=docker ps --filter 'name=supabase_db_' --format '{{.Names}}'|Select-Object -First 1;if(-not$c){throw 'Local Supabase database not found'};$old=$ErrorActionPreference;$ErrorActionPreference='Continue';$out=$Sql|docker exec -i $c psql -v ON_ERROR_STOP=1 -U postgres -d postgres 2>&1;$code=$LASTEXITCODE;$ErrorActionPreference=$old;if(($code-eq 0)-ne$Ok){throw "Expected success=$Ok`n$out"}}
function Role([string]$Role,[string]$Sql,[bool]$Ok){Db "set role $Role; $Sql" $Ok}
& $cli start|Out-Null
& $cli db reset --local|Out-Null
Db (Get-Content -Raw 'supabase/tests/database/fixtures.sql')
Db (Get-Content -Raw 'supabase/tests/database/admin_fixtures.sql')
$a='10000000-0000-0000-0000-000000000001'
$b='10000000-0000-0000-0000-000000000002'
foreach($table in 'admin_memberships','admin_role_permissions','admin_audit_events','admin_notes'){Role anon "select * from public.$table;" $false;Role authenticated "select * from public.$table;" $false;Role authenticated "insert into public.$table default values;" $false}
Role authenticated "select public.admin_get_me('$a');" $false
Role anon "select public.admin_dashboard_summary('$a');" $false
Role authenticated "select public.admin_reveal_user_pii('$a','$b','Unauthorized direct RPC access','40000000-0000-4000-8000-000000000001');" $false
Role authenticated "update public.admin_audit_events set result='success';" $false
Role authenticated "delete from public.admin_audit_events;" $false
Db (Get-Content -Raw 'supabase/tests/database/admin_assertions.sql')

# Provider IDs are visible only to operational roles, and no retry mutation exists in the Admin API.
Db "update public.admin_memberships set status='active' where user_id='$b';"
Db "update public.transactional_email_outbox set delivery_status='sent',sent_at=now(),provider_message_id='provider-test',claim_token=null,claim_expires_at=null where user_id='$a';"
Db "do `$`$ declare s jsonb; a jsonb; begin s:=public.admin_list_outbox('$b',25,0,null); a:=public.admin_list_outbox('10000000-0000-0000-0000-000000000006',25,0,null); if s::text like '%provider-test%' then raise exception 'support saw provider ID'; end if; if a::text not like '%provider-test%' then raise exception 'admin operational provider ID missing'; end if; end `$`$;"

# Add a second super administrator, then concurrently attempt to demote each other.
Db "insert into public.admin_memberships(user_id,role,status,granted_by) values('10000000-0000-0000-0000-000000000007','super_admin','active','$a');"
$c=docker ps --filter 'name=supabase_db_' --format '{{.Names}}'|Select-Object -First 1
$queries=@(
"set role service_role; select public.admin_manage_membership('$a','10000000-0000-0000-0000-000000000007','admin','active','Concurrent last super administrator test','41000000-0000-4000-8000-000000000001');",
"set role service_role; select public.admin_manage_membership('10000000-0000-0000-0000-000000000007','$a','admin','active','Concurrent last super administrator test','41000000-0000-4000-8000-000000000002');"
)
$jobs=$queries|ForEach-Object{Start-Job -ScriptBlock{param($Container,$Query)$o=$Query|docker exec -i $Container psql -v ON_ERROR_STOP=1 -U postgres -d postgres 2>&1;[pscustomobject]@{Code=$LASTEXITCODE;Output=$o}} -ArgumentList $c,$_}
$results=$jobs|Wait-Job|Receive-Job;$jobs|Remove-Job -Force
$successCount=@($results|Where-Object{$_.Code -eq 0}).Count
$failureCount=@($results|Where-Object{$_.Code -ne 0}).Count
if($successCount -ne 1 -or $failureCount -ne 1){throw "Concurrent last-super-admin protection failed: success=$successCount failure=$failureCount"}
Db "do `$`$ begin if (select count(*) from public.admin_memberships where role='super_admin' and status='active')<>1 then raise exception 'last super invariant broken'; end if; end `$`$;"

# Migration rerun fails at the first object and cannot widen privileges.
Db (Get-Content -Raw 'supabase/migrations/202608120002_create_admin_foundation.sql') $false
Role authenticated "select * from public.admin_audit_events;" $false
Write-Output 'Admin database security integration checks passed.'
