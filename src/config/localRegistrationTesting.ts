export interface LocalRegistrationTestingInput {
  dev: boolean;
  enabled: string | undefined;
  browserHostname: string;
  supabaseUrl: string | undefined;
  allowedSupabaseHosts: string | undefined;
}

const forbiddenHosts = new Set(['ashurplatform.com', 'www.ashurplatform.com', 'admin.ashurplatform.com']);
const localHosts = new Set(['localhost', '127.0.0.1']);

export function isLocalRegistrationTestingEnabled(input: LocalRegistrationTestingInput) {
  const browserHost = input.browserHostname.trim().toLowerCase();
  if (!input.dev || input.enabled !== 'true') return false;
  if (!localHosts.has(browserHost) || forbiddenHosts.has(browserHost) || browserHost.endsWith('.netlify.app')) return false;
  if (!input.supabaseUrl || !input.allowedSupabaseHosts) return false;
  let projectHost = '';
  try { projectHost = new URL(input.supabaseUrl).hostname.toLowerCase(); } catch { return false; }
  const allowlist = input.allowedSupabaseHosts.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean);
  return allowlist.length > 0 && allowlist.includes(projectHost);
}

export function localRegistrationTestingEnabled() {
  return isLocalRegistrationTestingEnabled({
    dev: import.meta.env.DEV,
    enabled: import.meta.env.VITE_ENABLE_LOCAL_REGISTRATION_TESTING,
    browserHostname: window.location.hostname,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    allowedSupabaseHosts: import.meta.env.VITE_LOCAL_REGISTRATION_TEST_SUPABASE_HOSTS,
  });
}
