import { createAdminClient } from '../_shared/admin.ts';
import { bearerToken, json, readLimitedJson, responseHeaders } from '../_shared/http.ts';
import { legalVersions, payloadHash, registrationOrigin, validateRegistrationPayload } from '../_shared/registration.ts';

Deno.serve(async (request) => {
  const approvedOrigin = registrationOrigin(request);
  if (approvedOrigin === false) return json(null, { error: 'origin_not_allowed' }, 403);
  const origin = approvedOrigin;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders(origin) });
  if (request.method !== 'POST') return json(origin, { error: 'method_not_allowed' }, 405);
  const token = bearerToken(request);
  if (!token) return json(origin, { error: 'authentication_required' }, 401);

  try {
    const admin = createAdminClient();
    const { data: { user }, error: userError } = await admin.auth.getUser(token);
    if (userError || !user?.email_confirmed_at) return json(origin, { error: 'verified_account_required' }, 403);
    const payload = validateRegistrationPayload(await readLimitedJson(request, 16_384));
    const versions = legalVersions(origin);
    const hash = await payloadHash(payload, versions);
    const { data, error } = await admin.rpc('finalize_ashur_registration', {
      p_user_id: user.id, p_full_name: payload.fullName, p_phone_e164: payload.phoneE164,
      p_owns_business: payload.ownsOrManagesBusiness, p_business_name: payload.businessName,
      p_business_type: payload.businessType, p_business_type_other: payload.businessTypeOther,
      p_branch_count: payload.branchCount, p_heard_about_ashur: payload.heardAboutAshur,
      p_awareness_source: payload.awarenessSource, p_preferred_language: payload.preferredLanguage,
      p_marketing_consent: payload.marketingConsent, p_terms_selected: payload.termsSelected,
      p_privacy_selected: payload.privacySelected, p_terms_version: versions.terms,
      p_privacy_version: versions.privacy, p_payload_hash: hash,
    });
    if (error) {
      if (error.message?.includes('registration_already_completed')) return json(origin, { error: 'registration_already_completed' }, 409);
      return json(origin, { error: 'profile_setup_failed' }, 503);
    }
    if (!data?.id) return json(origin, { error: 'profile_setup_failed' }, 503);
    return json(origin, { profile: { id: data.id, full_name: data.full_name, preferred_language: data.preferred_language } });
  } catch (error) {
    const category = error instanceof Error ? error.message : '';
    if (category === 'body_too_large') return json(origin, { error: category }, 413);
    if (category === 'invalid_json' || category === 'invalid_payload' || category === 'legal_acceptance_required') return json(origin, { error: category }, 400);
    if (category === 'registration_unavailable') return json(origin, { error: category }, 503);
    return json(origin, { error: 'profile_setup_failed' }, 503);
  }
});
