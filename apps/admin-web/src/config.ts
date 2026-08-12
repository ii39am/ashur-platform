export type AdminEnvironment = 'local' | 'staging' | 'production';
export interface AdminConfig { environment: AdminEnvironment; origin: string; reportingTimezone: string; supabaseUrl: string; publishableKey: string }

export function readConfig(env: Record<string,string|undefined>=import.meta.env): AdminConfig {
  const value=(key:string)=>{const found=env[key]?.trim();if(!found)throw new Error(`Missing ${key}`);return found;};
  const environment=value('VITE_ADMIN_ENVIRONMENT') as AdminEnvironment;
  if(!['local','staging','production'].includes(environment))throw new Error('Invalid Admin environment');
  const origin=new URL(value('VITE_ADMIN_ORIGIN')).origin;
  const supabaseUrl=new URL(value('VITE_SUPABASE_URL')).origin;
  const expectedSupabaseHost=value('VITE_EXPECTED_SUPABASE_HOST').toLowerCase();
  if(new URL(supabaseUrl).hostname.toLowerCase()!==expectedSupabaseHost)throw new Error('Supabase project host does not match the environment allowlist');
  if(environment==='production'&&origin!=='https://admin.ashurplatform.com')throw new Error('Production Admin origin mismatch');
  if(environment==='staging'&&(origin==='https://admin.ashurplatform.com'||/prod(uction)?/i.test(supabaseUrl)))throw new Error('Unsafe staging configuration');
  return {environment,origin,reportingTimezone:env.VITE_ADMIN_REPORTING_TIMEZONE?.trim()||'Asia/Baghdad',supabaseUrl,publishableKey:value('VITE_SUPABASE_PUBLISHABLE_KEY')};
}
