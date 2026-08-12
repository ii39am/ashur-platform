export const onboardingConfiguration = {
  maxBranches: 1000,
  otpLength: 6,
  otpResendCooldownSeconds: 60,
  maxOtpAttemptsPerPageSession: 6,
  defaultPhoneCountry: 'IQ',
  supportEmail: 'SUPPORT_EMAIL_TO_CONFIRM',
} as const;

export const businessTypes = [
  'retail', 'restaurant', 'grocery', 'pharmacy', 'fashion',
  'electronics', 'beauty', 'services', 'wholesale', 'other',
] as const;

export const awarenessSources = [
  'social', 'referral', 'representative', 'event', 'search', 'other',
] as const;

export type BusinessType = typeof businessTypes[number];
export type AwarenessSource = typeof awarenessSources[number];

export const phoneCountries = [
  { code: 'IQ', dial: '+964', en: 'Iraq', ar: 'العراق', min: 10, max: 10 },
  { code: 'SA', dial: '+966', en: 'Saudi Arabia', ar: 'السعودية', min: 9, max: 9 },
  { code: 'AE', dial: '+971', en: 'United Arab Emirates', ar: 'الإمارات', min: 9, max: 9 },
  { code: 'JO', dial: '+962', en: 'Jordan', ar: 'الأردن', min: 9, max: 9 },
  { code: 'KW', dial: '+965', en: 'Kuwait', ar: 'الكويت', min: 8, max: 8 },
  { code: 'QA', dial: '+974', en: 'Qatar', ar: 'قطر', min: 8, max: 8 },
  { code: 'BH', dial: '+973', en: 'Bahrain', ar: 'البحرين', min: 8, max: 8 },
  { code: 'OM', dial: '+968', en: 'Oman', ar: 'عُمان', min: 8, max: 8 },
  { code: 'EG', dial: '+20', en: 'Egypt', ar: 'مصر', min: 10, max: 10 },
  { code: 'US', dial: '+1', en: 'United States / Canada', ar: 'أمريكا / كندا', min: 10, max: 10 },
] as const;

export type PhoneCountryCode = typeof phoneCountries[number]['code'];

export function detectPhoneCountry(language = typeof navigator === 'undefined' ? '' : navigator.language, timezone = typeof Intl === 'undefined' ? '' : Intl.DateTimeFormat().resolvedOptions().timeZone): PhoneCountryCode {
  const region = language.split('-')[1]?.toUpperCase();
  if (region && phoneCountries.some((item) => item.code === region)) return region as PhoneCountryCode;
  if (timezone === 'Asia/Baghdad') return 'IQ';
  return onboardingConfiguration.defaultPhoneCountry;
}
