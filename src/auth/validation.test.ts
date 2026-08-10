import { describe, expect, it } from 'vitest';
import { validateEmail, validatePassword, validateRegistration } from './validation';

describe('authentication validation', () => {
  it('validates login email input', () => {
    expect(validateEmail(' USER@Example.com ')).toBe('');
    expect(validateEmail('not-an-email')).toMatch(/valid email/i);
  });

  it('enforces the password policy', () => {
    expect(validatePassword('short')).toMatch(/at least/i);
    expect(validatePassword('longpassword1')).toMatch(/uppercase/i);
    expect(validatePassword('StrongPass1')).toBe('');
  });

  it('validates registration confirmation and legal consent', () => {
    const errors = validateRegistration({ fullName: 'A', email: 'bad', password: 'weak', confirmPassword: 'different', acceptedLegal: false });
    expect(errors).toMatchObject({ fullName: expect.any(String), email: expect.any(String), password: expect.any(String), confirmPassword: expect.any(String), acceptedLegal: expect.any(String) });
  });
});
