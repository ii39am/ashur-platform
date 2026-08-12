$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot
Set-Location $workspace

function Invoke-Db([string]$Sql, [bool]$ShouldSucceed = $true) {
  $container = docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | Select-Object -First 1
  if (-not $container) { throw 'Local Supabase database container was not found.' }
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $output = $Sql | docker exec -i $container psql -v ON_ERROR_STOP=1 -U postgres -d postgres 2>&1
  $exitCode = $LASTEXITCODE
  $ErrorActionPreference = $previousPreference
  $succeeded = $exitCode -eq 0
  if ($succeeded -ne $ShouldSucceed) { throw "Database expectation failed. Expected success=$ShouldSucceed.`n$output" }
}

function As-Role([string]$Role, [string]$UserId, [string]$Sql, [bool]$ShouldSucceed) {
  $claims = if ($UserId) { "set request.jwt.claim.sub='$UserId'; set request.jwt.claim.role='$Role';" } else { '' }
  Invoke-Db "set role $Role; $claims $Sql" $ShouldSucceed
}

function Invoke-Concurrent([string]$Sql) {
  $container = docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | Select-Object -First 1
  $jobs = 1..2 | ForEach-Object { Start-Job -ScriptBlock { param($Container,$Query) $result = $Query | docker exec -i $Container psql -At -v ON_ERROR_STOP=1 -U postgres -d postgres 2>&1; [pscustomobject]@{ ExitCode=$LASTEXITCODE; Output=($result -join "`n") } } -ArgumentList $container,$Sql }
  $results = $jobs | Wait-Job | Receive-Job
  $jobs | Remove-Job -Force
  if ($results.Where({ $_.ExitCode -ne 0 }).Count) { throw "Concurrent database operation failed: $($results.Output -join '; ')" }
  return $results
}

npx --yes supabase@2.113.0 start | Out-Null
npx --yes supabase@2.113.0 db reset --local | Out-Null
Invoke-Db (Get-Content -Raw 'supabase/tests/database/fixtures.sql') $true

$a = '10000000-0000-0000-0000-000000000001'
$b = '10000000-0000-0000-0000-000000000002'
$unverified = '10000000-0000-0000-0000-000000000003'

As-Role 'anon' '' 'select * from public.profiles;' $false
As-Role 'anon' '' "insert into public.profiles(id,full_name,phone_e164,owns_or_manages_business,heard_about_ashur,preferred_language,registration_payload_hash) values('$b','Bad','+9647701234567',false,false,'en',repeat('b',64));" $false
As-Role 'anon' '' "update public.profiles set full_name='Bad' where id='$a';" $false
As-Role 'anon' '' "delete from public.profiles where id='$a';" $false

As-Role 'authenticated' $a "select id from public.profiles where id='$a';" $true
As-Role 'authenticated' $b "do `$`$ begin if exists(select 1 from public.profiles where id='$a') then raise exception 'cross-user read'; end if; end `$`$;" $true
As-Role 'authenticated' $b "update public.profiles set full_name='Attack' where id='$a';" $true
Invoke-Db "do `$`$ begin if (select full_name from public.profiles where id='$a') <> 'User A' then raise exception 'cross-user update'; end if; end `$`$;" $true
As-Role 'authenticated' $b "do `$`$ begin if exists(select 1 from public.user_legal_acceptances where user_id='$a') then raise exception 'cross-user legal read'; end if; end `$`$;" $true
As-Role 'authenticated' $a "insert into public.profiles(id,full_name,phone_e164,owns_or_manages_business,heard_about_ashur,preferred_language,registration_payload_hash) values('$b','Bad','+9647701234567',false,false,'en',repeat('b',64));" $false
As-Role 'authenticated' $a "update public.profiles set created_at=now() where id='$a';" $false
As-Role 'authenticated' $a "update public.profiles set marketing_consent_updated_at=now() where id='$a';" $false
As-Role 'authenticated' $a "update public.profiles set registration_payload_hash=repeat('f',64) where id='$a';" $false
As-Role 'authenticated' $a "delete from public.profiles where id='$a';" $false
As-Role 'authenticated' $a "update public.user_legal_acceptances set accepted_at=now() where user_id='$a';" $false
As-Role 'authenticated' $a "delete from public.user_legal_acceptances where user_id='$a';" $false
As-Role 'authenticated' $a 'select * from public.transactional_email_outbox;' $false
As-Role 'authenticated' $a "select public.finalize_ashur_registration('$a','X','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'x','x',repeat('a',64));" $false
As-Role 'authenticated' $a "select * from public.claim_transactional_email('$a','account_created_welcome');" $false
As-Role 'authenticated' $a "select public.mark_transactional_email_unknown(gen_random_uuid(),gen_random_uuid(),'delivery_unknown',null);" $false
As-Role 'anon' '' "select * from public.claim_transactional_email('$a','account_created_welcome');" $false

# Approved self-service fields work, while trigger-maintained timestamps remain authoritative.
Invoke-Db "update public.profiles set updated_at='2000-01-01', marketing_consent_updated_at='2000-01-01' where id='$a';" $true
As-Role 'authenticated' $a "update public.profiles set full_name='User A Updated', marketing_consent=true where id='$a';" $true
Invoke-Db "do `$`$ begin if (select updated_at <= '2000-01-01' or marketing_consent_updated_at <= '2000-01-01' from public.profiles where id='$a') then raise exception 'server timestamps not maintained'; end if; end `$`$;" $true

As-Role 'service_role' '' "select public.finalize_ashur_registration('$unverified','No Verify','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('c',64));" $false
As-Role 'service_role' '' "select public.finalize_ashur_registration('$b','Invalid','bad-phone',false,null,null,null,null,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('d',64));" $false
As-Role 'service_role' '' "select public.finalize_ashur_registration('$b','Invalid','+9647701234567',true,'Store','retail',null,0,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('d',64));" $false
As-Role 'service_role' '' "select public.finalize_ashur_registration('$b','Invalid','+9647701234567',false,null,null,null,null,false,null,'xx',false,true,true,'terms-v1','privacy-v1',repeat('d',64));" $false
As-Role 'service_role' '' "select public.finalize_ashur_registration('$b','Invalid','+9647701234567',false,null,null,null,null,false,null,'en',false,false,true,'terms-v1','privacy-v1',repeat('d',64));" $false

# Two independent database sessions finalize the same user concurrently.
$finalizeB = "set role service_role; select (public.finalize_ashur_registration('$b','User B','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('b',64))).id;"
$finalizeResults = Invoke-Concurrent $finalizeB
Invoke-Db "do `$`$ begin if (select count(*) from public.profiles where id='$b') <> 1 or (select count(*) from public.user_legal_acceptances where user_id='$b') <> 2 or (select count(*) from public.transactional_email_outbox where user_id='$b') <> 1 then raise exception 'concurrent finalization duplicated state'; end if; end `$`$;" $true
As-Role 'service_role' '' "select public.finalize_ashur_registration('$b','Different Payload','+9647701234567',false,null,null,null,null,false,null,'en',false,true,true,'terms-v1','privacy-v1',repeat('e',64));" $false

# Two independent workers compete for one outbox event; exactly one may claim it.
$claimResults = Invoke-Concurrent "set role service_role; select count(*) from public.claim_transactional_email('$b','account_created_welcome');"
$claimCounts = $claimResults | ForEach-Object { [int](($_.Output -split "`n" | Where-Object { $_ -match '^\d+$' } | Select-Object -Last 1)) }
if (($claimCounts | Measure-Object -Sum).Sum -ne 1) { throw "Concurrent claim invariant failed: $($claimCounts -join ',')" }

Invoke-Db (Get-Content -Raw 'supabase/tests/database/assertions.sql') $true

# A second direct application must fail on CREATE TABLE, inside its transaction.
$migration = Get-Content -Raw 'supabase/migrations/202608120001_create_profiles.sql'
Invoke-Db $migration $false
As-Role 'anon' '' 'select * from public.profiles;' $false

Write-Output 'Database security integration checks passed.'
