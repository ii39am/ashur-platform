import { createAdminClient } from '../_shared/admin.ts';
import { authorizeOrigin, bearerToken, json, readLimitedText, responseHeaders } from '../_shared/http.ts';
import { providerErrorCategory, providerMessageId } from '../_shared/delivery.ts';

type Claim = { outbox_id: string; claim_token: string; preferred_language: 'en' | 'ar'; attempt_count: number; provider_idempotency_key: string };

async function markUnknown(admin: ReturnType<typeof createAdminClient>, claim: Claim, category: 'delivery_unknown' | 'database_completion_failed', providerId: string | null = null) {
  const { data, error } = await admin.rpc('mark_transactional_email_unknown', { p_outbox_id: claim.outbox_id, p_claim_token: claim.claim_token, p_error_category: category, p_provider_message_id: providerId });
  return !error && data === true;
}

async function completeAccepted(admin: ReturnType<typeof createAdminClient>, claim: Claim, providerId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await admin.rpc('complete_transactional_email', { p_outbox_id: claim.outbox_id, p_claim_token: claim.claim_token, p_accepted: true, p_provider_message_id: providerId, p_error_category: null });
    if (!error && data === true) return true;
  }
  await markUnknown(admin, claim, 'database_completion_failed', providerId);
  return false;
}

Deno.serve(async (request) => {
  const { origin, rejection } = authorizeOrigin(request);
  if (rejection) return rejection;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders(origin) });
  if (request.method !== 'POST') return json(origin, { error: 'method_not_allowed' }, 405);
  try { const body = (await readLimitedText(request, 1024)).trim(); if (body && body !== '{}') return json(origin, { error: 'invalid_payload' }, 400); }
  catch { return json(origin, { error: 'body_too_large' }, 413); }
  const token = bearerToken(request);
  if (!token) return json(origin, { error: 'authentication_required' }, 401);

  try {
    const admin = createAdminClient();
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) return json(origin, { error: 'service_not_configured' }, 503);
    const { data: { user }, error: userError } = await admin.auth.getUser(token);
    if (userError || !user?.email || !user.email_confirmed_at) return json(origin, { error: 'verified_account_required' }, 403);
    const { data: profile, error: profileError } = await admin.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (profileError) return json(origin, { error: 'delivery_state_unavailable' }, 503);
    if (!profile) return json(origin, { error: 'profile_required' }, 409);

    const { data: claims, error: claimError } = await admin.rpc('claim_transactional_email', { p_user_id: user.id, p_template_type: 'account_created_welcome' });
    if (claimError) return json(origin, { error: 'delivery_state_unavailable' }, 503);
    const claim = (Array.isArray(claims) ? claims[0] : claims) as Claim | undefined;
    if (!claim) return json(origin, { accepted: false, retryLater: true }, 202);
    const { data: started, error: startError } = await admin.rpc('mark_transactional_email_sending', { p_outbox_id: claim.outbox_id, p_claim_token: claim.claim_token });
    if (startError || started !== true) return json(origin, { error: 'delivery_state_unavailable' }, 503);

    const ar = claim.preferred_language === 'ar';
    const subject = ar ? 'حسابك في منصة آشور أصبح جاهزًا' : 'Your Ashur Platform account is ready';
    const heading = ar ? 'تم إنشاء حسابك بنجاح.' : 'Your account has been created successfully.';
    const body = ar ? 'مرحبًا بك في منصة آشور. تم تأكيد بريدك الإلكتروني وأصبح حسابك جاهزًا. يمكنك تسجيل الدخول لإدارة حسابك والوصول إلى صفحة تحميل النسخة التجريبية من آشور.' : 'Welcome to Ashur Platform. Your email has been verified and your account is ready. You can sign in to manage your account and access the Ashur trial-download page.';
    let response: Response;
    try {
      response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': claim.provider_idempotency_key }, body: JSON.stringify({ from: Deno.env.get('WELCOME_FROM') ?? 'Ashur Platform <no-reply@ashurplatform.com>', to: [user.email], subject, html: `<div dir="${ar ? 'rtl' : 'ltr'}" style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#101d22;color:#e2e8f0;padding:32px;border-radius:16px"><h1 style="color:#22d3d8">${heading}</h1><p style="line-height:1.8">${body}</p></div>` }) });
    } catch {
      await markUnknown(admin, claim, 'delivery_unknown');
      return json(origin, { error: 'delivery_requires_reconciliation' }, 503);
    }

    if (!response.ok) {
      const category = providerErrorCategory(response.status);
      const { data: completed, error: completionError } = await admin.rpc('complete_transactional_email', { p_outbox_id: claim.outbox_id, p_claim_token: claim.claim_token, p_accepted: false, p_provider_message_id: null, p_error_category: category });
      if (completionError || completed !== true) { await markUnknown(admin, claim, 'database_completion_failed'); return json(origin, { error: 'delivery_requires_reconciliation' }, 503); }
      return json(origin, { accepted: false, retryLater: true }, response.status === 429 ? 429 : 503);
    }

    let providerId = '';
    try { providerId = providerMessageId(await response.json()) ?? ''; } catch { /* handled as unknown below */ }
    if (!providerId) { await markUnknown(admin, claim, 'delivery_unknown'); return json(origin, { error: 'delivery_requires_reconciliation' }, 503); }
    if (!await completeAccepted(admin, claim, providerId)) return json(origin, { error: 'delivery_requires_reconciliation' }, 503);
    return json(origin, { accepted: true });
  } catch {
    return json(origin, { error: 'delivery_unavailable' }, 503);
  }
});
