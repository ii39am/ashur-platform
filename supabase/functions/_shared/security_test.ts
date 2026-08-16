import { approvedOrigin, bearerToken } from './http.ts';
import { providerErrorCategory, providerMessageId } from './delivery.ts';
import { legalVersions, payloadHash, registrationOrigin, validateRegistrationPayload } from './registration.ts';

function assert(condition: unknown, message: string) { if (!condition) throw new Error(message); }
function throws(action: () => unknown, expected: string) { try { action(); } catch (error) { assert(error instanceof Error && error.message === expected, `expected ${expected}`); return; } throw new Error(`expected ${expected}`); }
const valid = () => ({ fullName: 'User Name', phoneE164: '+9647701234567', ownsOrManagesBusiness: false, businessName: null, businessType: null, businessTypeOther: null, branchCount: null, heardAboutAshur: false, awarenessSource: null, preferredLanguage: 'en', termsSelected: true, privacySelected: true, marketingConsent: false });

Deno.test('registration rejects extra identity and legal-version fields', () => { throws(() => validateRegistrationPayload({ ...valid(), userId: 'other-user' }), 'invalid_payload'); throws(() => validateRegistrationPayload({ ...valid(), termsVersion: 'attacker-v1' }), 'invalid_payload'); });
Deno.test('registration validation is deterministic and legal versions are hash-bound', async () => { const first = validateRegistrationPayload({ ...valid(), fullName: ' User Name ', phoneE164: '+964 770 123 4567' }); const second = validateRegistrationPayload(valid()); assert(first.phoneE164 === '+9647701234567', 'phone not normalized'); assert(await payloadHash(first, { terms: 't1', privacy: 'p1' }) === await payloadHash(second, { terms: 't1', privacy: 'p1' }), 'retry hash changed'); assert(await payloadHash(first, { terms: 't1', privacy: 'p1' }) !== await payloadHash(second, { terms: 't2', privacy: 'p1' }), 'legal version was not hash-bound'); });
Deno.test('production CORS is an exact allowlist', () => {
  assert(approvedOrigin(new Request('https://local.test', { headers: { Origin: 'https://ashurplatform.com' } })) === 'https://ashurplatform.com', 'apex rejected');
  assert(approvedOrigin(new Request('https://local.test', { headers: { Origin: 'https://www.ashurplatform.com' } })) === 'https://www.ashurplatform.com', 'www rejected');
  assert(approvedOrigin(new Request('https://local.test', { headers: { Origin: 'https://evil.example' } })) === false, 'evil origin accepted');
  assert(approvedOrigin(new Request('https://local.test', { headers: { Origin: '*' } })) === false, 'wildcard accepted');
});
Deno.test('registration test mode requires exclusive localhost origin and draft-test versions', () => {
  const keys = ['REGISTRATION_ENABLED','REGISTRATION_TEST_MODE','REGISTRATION_TEST_ALLOWED_ORIGIN','LEGAL_TERMS_VERSION','LEGAL_PRIVACY_VERSION'];
  const previous = Object.fromEntries(keys.map((key) => [key, Deno.env.get(key)]));
  try {
    Deno.env.set('REGISTRATION_ENABLED','false'); Deno.env.set('REGISTRATION_TEST_MODE','true'); Deno.env.set('REGISTRATION_TEST_ALLOWED_ORIGIN','http://localhost:5173');
    Deno.env.set('LEGAL_TERMS_VERSION','draft-test-2026-08'); Deno.env.set('LEGAL_PRIVACY_VERSION','draft-test-2026-08');
    const request = new Request('http://local.test',{headers:{Origin:'http://localhost:5173'}});
    assert(registrationOrigin(request)==='http://localhost:5173','test origin rejected');
    assert(legalVersions('http://localhost:5173').mode==='test','test mode not identified');
    throws(()=>legalVersions('http://127.0.0.1:5173'),'registration_unavailable');
    Deno.env.set('REGISTRATION_ENABLED','true'); throws(()=>legalVersions('http://localhost:5173'),'registration_unavailable');
    Deno.env.set('REGISTRATION_ENABLED','false'); Deno.env.set('LEGAL_TERMS_VERSION','1.0.0'); throws(()=>legalVersions('http://localhost:5173'),'registration_unavailable');
  } finally { for (const key of keys) previous[key]===undefined?Deno.env.delete(key):Deno.env.set(key,previous[key]!); }
});
Deno.test('production mode rejects test document versions', () => {
  const keys = ['REGISTRATION_ENABLED','REGISTRATION_TEST_MODE','LEGAL_TERMS_VERSION','LEGAL_PRIVACY_VERSION']; const previous=Object.fromEntries(keys.map(k=>[k,Deno.env.get(k)]));
  try { Deno.env.set('REGISTRATION_ENABLED','true');Deno.env.set('REGISTRATION_TEST_MODE','false');Deno.env.set('LEGAL_TERMS_VERSION','draft-test-2026-08');Deno.env.set('LEGAL_PRIVACY_VERSION','draft-test-2026-08');throws(()=>legalVersions('https://ashurplatform.com'),'registration_unavailable');Deno.env.set('LEGAL_TERMS_VERSION','1.0.0');Deno.env.set('LEGAL_PRIVACY_VERSION','1.0.0');const production=legalVersions('https://ashurplatform.com');assert(production.mode==='production','production mode unavailable');assert(production.terms==='1.0.0'&&production.privacy==='1.0.0','published versions not selected server-side'); }
  finally { for(const key of keys)previous[key]===undefined?Deno.env.delete(key):Deno.env.set(key,previous[key]!); }
});
Deno.test('bearer parsing rejects missing and empty values', () => { assert(bearerToken(new Request('https://local.test')) === null, 'missing bearer accepted'); assert(bearerToken(new Request('https://local.test', { headers: { Authorization: 'Bearer ' } })) === null, 'empty bearer accepted'); assert(bearerToken(new Request('https://local.test', { headers: { Authorization: 'Bearer token' } })) === 'token', 'valid bearer rejected'); });
Deno.test('provider response classification is bounded and requires an id', () => { assert(providerErrorCategory(429) === 'provider_rate_limited', 'rate classification'); assert(providerErrorCategory(503) === 'provider_unavailable', 'availability classification'); assert(providerErrorCategory(400) === 'provider_rejected', 'rejection classification'); assert(providerMessageId({ id: 'email-id' }) === 'email-id', 'id rejected'); assert(providerMessageId({}) === null, 'missing id accepted'); });
