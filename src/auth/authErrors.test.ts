import { describe, expect, it } from 'vitest';
import { getSafeAuthError } from './authErrors';

describe('provider-safe errors', () => {
  it('maps provider and expired-link errors to safe messages', () => {
    expect(getSafeAuthError(new Error('Invalid login credentials'))).not.toContain('credentials supplied for user');
    expect(getSafeAuthError(new Error('OTP expired'))).toMatch(/invalid or has expired/i);
    expect(getSafeAuthError(new Error('private provider detail'))).toMatch(/could not complete/i);
  });
});
