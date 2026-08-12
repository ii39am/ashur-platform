import { describe, expect, it } from 'vitest';
import { payloadHash, validateRegistrationPayload } from './registration.ts';

const valid = () => ({ fullName: ' User Name ', phoneE164: '+964 770 123 4567', ownsOrManagesBusiness: false, businessName: null, businessType: null, businessTypeOther: null, branchCount: null, heardAboutAshur: false, awarenessSource: null, preferredLanguage: 'en', termsSelected: true, privacySelected: true, marketingConsent: false });

describe('server registration payload validation', () => {
  it('normalizes a complete payload', () => { expect(validateRegistrationPayload(valid())).toMatchObject({ fullName: 'User Name', phoneE164: '+9647701234567', businessName: null }); });
  it('rejects unknown security-sensitive fields', () => { expect(() => validateRegistrationPayload({ ...valid(), userId: 'attacker', termsVersion: 'fake' })).toThrow('invalid_payload'); });
  it('requires both legal selections', () => { expect(() => validateRegistrationPayload({ ...valid(), termsSelected: false })).toThrow('legal_acceptance_required'); });
  it('rejects invalid conditional data, phone, branch, and language', () => {
    expect(() => validateRegistrationPayload({ ...valid(), phoneE164: '0770123' })).toThrow('invalid_payload');
    expect(() => validateRegistrationPayload({ ...valid(), preferredLanguage: 'xx' })).toThrow('invalid_payload');
    expect(() => validateRegistrationPayload({ ...valid(), ownsOrManagesBusiness: true, businessName: 'Store', businessType: 'retail', branchCount: 0 })).toThrow('invalid_payload');
  });
  it('produces stable hashes for legitimate retries', async () => { const first = validateRegistrationPayload(valid()); const second = validateRegistrationPayload(valid()); expect(await payloadHash(first)).toBe(await payloadHash(second)); });
});
