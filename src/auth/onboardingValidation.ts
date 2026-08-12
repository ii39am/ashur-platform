import { onboardingConfiguration, phoneCountries, type AwarenessSource, type BusinessType, type PhoneCountryCode } from '../config/onboarding';

export interface RegistrationDraft {
  fullName: string; phoneCountry: PhoneCountryCode; phoneNational: string;
  ownsBusiness: boolean | null; businessName: string; businessType: BusinessType | ''; businessTypeOther: string; branchCount: string;
  heardAboutAshur: boolean | null; awarenessSource: AwarenessSource | '';
  email: string; password: string; confirmPassword: string;
  acceptedTerms: boolean; acceptedPrivacy: boolean; marketingConsent: boolean;
}

export const initialRegistrationDraft: RegistrationDraft = { fullName: '', phoneCountry: 'IQ', phoneNational: '', ownsBusiness: null, businessName: '', businessType: '', businessTypeOther: '', branchCount: '', heardAboutAshur: null, awarenessSource: '', email: '', password: '', confirmPassword: '', acceptedTerms: false, acceptedPrivacy: false, marketingConsent: false };
export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export function normalizePhone(countryCode: PhoneCountryCode, national: string) {
  const country = phoneCountries.find((item) => item.code === countryCode);
  if (!country) return null;
  let digits = national.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length < country.min || digits.length > country.max) return null;
  return `${country.dial}${digits}`;
}

export function validatePersonal(draft: RegistrationDraft) {
  const errors: Record<string, string> = {};
  if (draft.fullName.trim().length < 2) errors.fullName = 'fullName';
  if (!normalizePhone(draft.phoneCountry, draft.phoneNational)) errors.phone = 'phone';
  if (draft.ownsBusiness === null) errors.ownsBusiness = 'required';
  if (draft.ownsBusiness) {
    if (draft.businessName.trim().length < 2) errors.businessName = 'businessName';
    if (!draft.businessType) errors.businessType = 'businessType';
    if (draft.businessType === 'other' && draft.businessTypeOther.trim().length < 2) errors.businessTypeOther = 'businessOther';
    const branches = Number(draft.branchCount);
    if (!/^\d+$/.test(draft.branchCount) || !Number.isInteger(branches) || branches < 1 || branches > onboardingConfiguration.maxBranches) errors.branchCount = 'branches';
  }
  if (draft.heardAboutAshur === null) errors.heardAboutAshur = 'required';
  return errors;
}

export function passwordScore(password: string) {
  return [password.length >= 10, password.length >= 14, /[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
}

export function validateSecurity(draft: RegistrationDraft) {
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(draft.email))) errors.email = 'email';
  if (draft.password.length < 10) errors.password = 'passwordLength';
  else if (!/[a-z]/.test(draft.password) || !/[A-Z]/.test(draft.password) || !/\d/.test(draft.password)) errors.password = 'passwordComplexity';
  if (draft.password !== draft.confirmPassword) errors.confirmPassword = 'mismatch';
  if (!draft.acceptedTerms) errors.acceptedTerms = 'terms';
  if (!draft.acceptedPrivacy) errors.acceptedPrivacy = 'privacy';
  return errors;
}

export interface OnboardingPayload {
  fullName: string; phoneE164: string; ownsOrManagesBusiness: boolean;
  businessName: string | null; businessType: BusinessType | null; businessTypeOther: string | null; branchCount: number | null;
  heardAboutAshur: boolean; awarenessSource: AwarenessSource | null; preferredLanguage: 'en' | 'ar';
  termsSelected: boolean; privacySelected: boolean; marketingConsent: boolean;
}

export function normalizedOnboardingPayload(draft: RegistrationDraft, language: 'en' | 'ar'): OnboardingPayload {
  const owns = draft.ownsBusiness === true;
  return {
    fullName: draft.fullName.trim(), phoneE164: normalizePhone(draft.phoneCountry, draft.phoneNational) ?? '',
    ownsOrManagesBusiness: owns,
    businessName: owns ? draft.businessName.trim() : null,
    businessType: owns ? draft.businessType || null : null,
    businessTypeOther: owns && draft.businessType === 'other' ? draft.businessTypeOther.trim() : null,
    branchCount: owns ? Number(draft.branchCount) : null,
    heardAboutAshur: draft.heardAboutAshur === true,
    awarenessSource: draft.heardAboutAshur ? draft.awarenessSource || null : null,
    preferredLanguage: language, termsSelected: draft.acceptedTerms, privacySelected: draft.acceptedPrivacy,
    marketingConsent: draft.marketingConsent,
  };
}
