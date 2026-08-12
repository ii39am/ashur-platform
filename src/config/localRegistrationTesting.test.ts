import { describe, expect, it } from 'vitest';
import { isLocalRegistrationTestingEnabled } from './localRegistrationTesting';

const valid = { dev: true, enabled: 'true', browserHostname: 'localhost', supabaseUrl: 'http://127.0.0.1:54321', allowedSupabaseHosts: '127.0.0.1' };

describe('local registration testing gate', () => {
  it('is disabled by default', () => expect(isLocalRegistrationTestingEnabled({ ...valid, enabled: undefined })).toBe(false));
  it('cannot be enabled outside a development build', () => expect(isLocalRegistrationTestingEnabled({ ...valid, dev: false })).toBe(false));
  it.each(['example.com','ashurplatform.com','www.ashurplatform.com','admin.ashurplatform.com','deploy-preview-12--ashur.netlify.app'])('rejects non-local and hosted origin %s', (browserHostname) => expect(isLocalRegistrationTestingEnabled({ ...valid, browserHostname })).toBe(false));
  it('requires an explicit matching testing Supabase hostname', () => {
    expect(isLocalRegistrationTestingEnabled({ ...valid, allowedSupabaseHosts: '' })).toBe(false);
    expect(isLocalRegistrationTestingEnabled({ ...valid, allowedSupabaseHosts: 'other.test' })).toBe(false);
    expect(isLocalRegistrationTestingEnabled(valid)).toBe(true);
  });
});
