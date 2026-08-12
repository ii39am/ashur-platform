import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function validateBuildEnvironment(mode: string, root: string) {
  const env = loadEnv(mode, root, 'VITE_');
  const required = ['VITE_ADMIN_ENVIRONMENT', 'VITE_ADMIN_ORIGIN', 'VITE_SUPABASE_URL', 'VITE_EXPECTED_SUPABASE_HOST', 'VITE_SUPABASE_PUBLISHABLE_KEY'];
  const missing = required.filter((key) => !env[key]?.trim());
  if (missing.length) throw new Error(`Missing required Admin environment variables: ${missing.join(', ')}`);
  if (!['local', 'staging', 'production'].includes(env.VITE_ADMIN_ENVIRONMENT)) throw new Error('Invalid VITE_ADMIN_ENVIRONMENT');
  const origin = new URL(env.VITE_ADMIN_ORIGIN);
  const supabase = new URL(env.VITE_SUPABASE_URL);
  if (supabase.hostname.toLowerCase() !== env.VITE_EXPECTED_SUPABASE_HOST.toLowerCase()) throw new Error('Supabase host does not match VITE_EXPECTED_SUPABASE_HOST');
  if (env.VITE_ADMIN_ENVIRONMENT === 'production' && origin.origin !== 'https://admin.ashurplatform.com') throw new Error('Production Admin origin mismatch');
  if (env.VITE_ADMIN_ENVIRONMENT === 'staging' && (origin.hostname === 'admin.ashurplatform.com' || /prod(uction)?/i.test(supabase.hostname))) throw new Error('Staging configuration appears to target production');
  if (env.VITE_ADMIN_ENVIRONMENT !== 'local' && origin.protocol !== 'https:') throw new Error('Non-local Admin origin must use HTTPS');
}

export default defineConfig(({ mode }) => {
  if (mode !== 'test') validateBuildEnvironment(mode, process.cwd());
  return { plugins: [react()], define: mode === 'test' ? {
    'import.meta.env.VITE_ADMIN_ENVIRONMENT': JSON.stringify('local'),
    'import.meta.env.VITE_ADMIN_ORIGIN': JSON.stringify('http://localhost:5174'),
    'import.meta.env.VITE_ADMIN_REPORTING_TIMEZONE': JSON.stringify('Asia/Baghdad'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('http://127.0.0.1:54321'),
    'import.meta.env.VITE_EXPECTED_SUPABASE_HOST': JSON.stringify('127.0.0.1'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('test-publishable-key'),
  } : undefined, test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true } };
});
