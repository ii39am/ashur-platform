const businessTypes = new Set(['retail','restaurant','grocery','pharmacy','fashion','electronics','beauty','services','wholesale','other']);
const awarenessSources = new Set(['social','referral','representative','event','search','other']);
const expectedKeys = new Set(['fullName','phoneE164','ownsOrManagesBusiness','businessName','businessType','businessTypeOther','branchCount','heardAboutAshur','awarenessSource','preferredLanguage','termsSelected','privacySelected','marketingConsent']);

export interface RegistrationPayload {
  fullName: string; phoneE164: string; ownsOrManagesBusiness: boolean;
  businessName: string | null; businessType: string | null; businessTypeOther: string | null; branchCount: number | null;
  heardAboutAshur: boolean; awarenessSource: string | null; preferredLanguage: 'en' | 'ar';
  termsSelected: true; privacySelected: true; marketingConsent: boolean;
}

const text = (value: unknown, min: number, max: number) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max ? value.trim() : null;

export function validateRegistrationPayload(input: unknown): RegistrationPayload {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid_payload');
  const raw = input as Record<string, unknown>;
  if (Object.keys(raw).some((key) => !expectedKeys.has(key)) || Object.keys(raw).length !== expectedKeys.size) throw new Error('invalid_payload');
  const fullName = text(raw.fullName, 2, 160);
  const phoneE164 = typeof raw.phoneE164 === 'string' ? raw.phoneE164.replace(/[\s()-]/g, '') : '';
  if (!fullName || !/^\+[1-9][0-9]{7,14}$/.test(phoneE164)) throw new Error('invalid_payload');
  if (typeof raw.ownsOrManagesBusiness !== 'boolean' || typeof raw.heardAboutAshur !== 'boolean' || typeof raw.marketingConsent !== 'boolean') throw new Error('invalid_payload');
  if (raw.termsSelected !== true || raw.privacySelected !== true) throw new Error('legal_acceptance_required');
  if (raw.preferredLanguage !== 'en' && raw.preferredLanguage !== 'ar') throw new Error('invalid_payload');

  let businessName: string | null = null, businessType: string | null = null, businessTypeOther: string | null = null, branchCount: number | null = null;
  if (raw.ownsOrManagesBusiness) {
    businessName = text(raw.businessName, 2, 200);
    businessType = typeof raw.businessType === 'string' && businessTypes.has(raw.businessType) ? raw.businessType : null;
    branchCount = typeof raw.branchCount === 'number' && Number.isInteger(raw.branchCount) && raw.branchCount >= 1 && raw.branchCount <= 1000 ? raw.branchCount : null;
    if (!businessName || !businessType || !branchCount) throw new Error('invalid_payload');
    if (businessType === 'other') { businessTypeOther = text(raw.businessTypeOther, 2, 120); if (!businessTypeOther) throw new Error('invalid_payload'); }
    else if (raw.businessTypeOther !== null) throw new Error('invalid_payload');
  } else if (raw.businessName !== null || raw.businessType !== null || raw.businessTypeOther !== null || raw.branchCount !== null) throw new Error('invalid_payload');

  let awarenessSource: string | null = null;
  if (raw.heardAboutAshur) {
    if (raw.awarenessSource !== null) {
      if (typeof raw.awarenessSource !== 'string' || !awarenessSources.has(raw.awarenessSource)) throw new Error('invalid_payload');
      awarenessSource = raw.awarenessSource;
    }
  } else if (raw.awarenessSource !== null) throw new Error('invalid_payload');

  return { fullName, phoneE164, ownsOrManagesBusiness: raw.ownsOrManagesBusiness, businessName, businessType, businessTypeOther, branchCount, heardAboutAshur: raw.heardAboutAshur, awarenessSource, preferredLanguage: raw.preferredLanguage, termsSelected: true, privacySelected: true, marketingConsent: raw.marketingConsent };
}

export async function payloadHash(payload: RegistrationPayload, versions?: { terms: string; privacy: string }) {
  const hashInput = { ...payload, legalTermsVersion: versions?.terms ?? null, legalPrivacyVersion: versions?.privacy ?? null };
  const canonical = JSON.stringify(Object.keys(hashInput).sort().reduce<Record<string, unknown>>((result, key) => { result[key] = hashInput[key as keyof typeof hashInput]; return result; }, {}));
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const documentVersion = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const testDocumentVersion = /^draft-test-[A-Za-z0-9][A-Za-z0-9._-]{0,52}$/;
const localTestOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

export function registrationOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  const testMode = Deno.env.get('REGISTRATION_TEST_MODE') === 'true';
  const allowedTestOrigin = Deno.env.get('REGISTRATION_TEST_ALLOWED_ORIGIN') ?? '';
  if (testMode && origin && origin === allowedTestOrigin && localTestOrigin.test(origin)) return origin;
  if (origin === 'https://ashurplatform.com' || origin === 'https://www.ashurplatform.com') return origin;
  return false;
}

export function legalVersions(origin: string | null) {
  const enabled = Deno.env.get('REGISTRATION_ENABLED') === 'true';
  const testMode = Deno.env.get('REGISTRATION_TEST_MODE') === 'true';
  const allowedTestOrigin = Deno.env.get('REGISTRATION_TEST_ALLOWED_ORIGIN') ?? '';
  const terms = Deno.env.get('LEGAL_TERMS_VERSION') ?? '';
  const privacy = Deno.env.get('LEGAL_PRIVACY_VERSION') ?? '';
  if (testMode) {
    if (enabled || !origin || origin !== allowedTestOrigin || !localTestOrigin.test(origin) || !testDocumentVersion.test(terms) || !testDocumentVersion.test(privacy)) throw new Error('registration_unavailable');
    return { terms, privacy, mode: 'test' as const };
  }
  if (!enabled || !documentVersion.test(terms) || !documentVersion.test(privacy) || testDocumentVersion.test(terms) || testDocumentVersion.test(privacy)) throw new Error('registration_unavailable');
  return { terms, privacy, mode: 'production' as const };
}
