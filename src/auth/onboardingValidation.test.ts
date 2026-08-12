import { describe, expect, it } from 'vitest';
import { initialRegistrationDraft, normalizeEmail, normalizePhone, normalizedOnboardingPayload, validatePersonal, validateSecurity, type RegistrationDraft } from './onboardingValidation';

const valid = (): RegistrationDraft => ({ ...initialRegistrationDraft, fullName: 'Esam Hassan', phoneNational: '7701234567', ownsBusiness: true, businessName: 'Ashur Store', businessType: 'retail', branchCount: '1', heardAboutAshur: true, awarenessSource: 'social', email: 'Owner@Example.com ', password: 'StrongPassword1!', confirmPassword: 'StrongPassword1!', acceptedTerms: true, acceptedPrivacy: true });

describe('onboarding validation and normalization', () => {
  it('starts with legal and marketing choices unselected, while marketing remains optional', () => {
    expect(initialRegistrationDraft).toMatchObject({ acceptedTerms: false, acceptedPrivacy: false, marketingConsent: false });
    const input = valid(); input.marketingConsent = false;
    expect(validateSecurity(input)).toEqual({});
  });
  it('requires personal and conditional business fields', () => { expect(validatePersonal(initialRegistrationDraft)).toMatchObject({ fullName: 'fullName', phone: 'phone', ownsBusiness: 'required', heardAboutAshur: 'required' }); const input = valid(); input.businessName = ''; input.businessType = ''; input.branchCount = '0'; expect(validatePersonal(input)).toMatchObject({ businessName: 'businessName', businessType: 'businessType', branchCount: 'branches' }); });
  it('requires an explanation for Other and accepts only realistic whole branch counts', () => { const input = valid(); input.businessType = 'other'; expect(validatePersonal(input).businessTypeOther).toBe('businessOther'); for (const branchCount of ['0', '-1', '1.5', '1001']) { input.branchCount = branchCount; expect(validatePersonal(input).branchCount).toBe('branches'); } });
  it('normalizes Iraqi phone numbers to E.164 and rejects invalid lengths', () => { expect(normalizePhone('IQ', '0770 123 4567')).toBe('+9647701234567'); expect(normalizePhone('IQ', '123')).toBeNull(); });
  it('normalizes email and enforces password, match, and separate legal consent', () => { expect(normalizeEmail(' Owner@Example.COM ')).toBe('owner@example.com'); const input = valid(); input.password = 'weak'; input.confirmPassword = 'different'; input.acceptedTerms = false; input.acceptedPrivacy = false; expect(validateSecurity(input)).toMatchObject({ password: 'passwordLength', confirmPassword: 'mismatch', acceptedTerms: 'terms', acceptedPrivacy: 'privacy' }); });
  it('nulls every conditional business value for non-business users', () => { const input = valid(); input.ownsBusiness = false; const payload = normalizedOnboardingPayload(input, 'ar'); expect(payload).toMatchObject({ businessName: null, businessType: null, businessTypeOther: null, branchCount: null, preferredLanguage: 'ar' }); });
});
