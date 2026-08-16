# Ashur Platform website

Vite, React, TypeScript, and Tailwind landing site with Supabase email authentication foundations.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set only the public Supabase values:

   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_PUBLISHABLE_KEY=
   ```

3. Run `npm install`, then `npm run dev`.

Never place a service-role key, payment secret, private storage credential, or signed installer URL in a `VITE_*` variable.

## Supabase Auth configuration

- Enable Email authentication.
- Require email confirmation.
- Set the Site URL to the production Netlify origin.
- Add these Redirect URLs for production and each approved preview/local origin:
  - `https://YOUR_DOMAIN/auth/callback`
  - `https://YOUR_DOMAIN/auth/reset-password`
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/auth/reset-password`
- Configure provider rate limits and enable Supabase CAPTCHA before production. CAPTCHA needs additional UI wiring and a public site key once the chosen provider is approved.
- Set the email OTP expiry and resend interval in **Authentication > Rate Limits**. Recommended starting points are a 10-minute OTP expiry and at least a 60-second resend interval; confirm these against current business and security requirements.
- Configure the production password policy to match or exceed the UI policy: 10 characters with uppercase, lowercase, and a number.
- Enable CAPTCHA/Cloudflare Turnstile for signup and resend before opening registration. Add its public site key only after the provider is approved; keep the secret server-side.
- Configure Resend as Custom SMTP with the verified `ashurplatform.com` sender.
- In **Authentication > Email Templates > Confirm signup**, use the reviewed `supabase/templates/confirm-signup.html` template. It renders the Supabase-hosted `{{ .Token }}` eight-digit signup OTP and is compatible with `verifyOtp({ email, token, type: 'signup' })`.

## Profile migration

Review `supabase/migrations/202608120001_create_profiles.sql`, test it in staging, then apply it with the Supabase CLI (`supabase db push`) or paste it into the Dashboard SQL editor. It has not been deployed by this repository.

The migration executes transactionally and deliberately uses ordinary `CREATE TABLE`; an unexpected existing table or a second direct application aborts before privileges can change. It creates:

- `public.profiles`, with own-row RLS and column-level self-update grants;
- immutable `public.user_legal_acceptances`, versioned by document type;
- private `public.transactional_email_outbox`, with one permanent welcome event per user;
- service-role-only finalization, claim, send-start, completion, and reconciliation functions.

The browser cannot insert profiles, alter legal history, access outbox state, or execute server functions. `marketing_consent_updated_at` and `updated_at` are trigger-maintained. Every `SECURITY DEFINER` function has `SET search_path = ''` and schema-qualified references.

The frontend does not send profile/legal data through Auth metadata. During the OTP flow, `sessionStorage` temporarily contains the normalized onboarding payload, email, and safe internal destination so a navigation can recover. It never contains passwords, OTPs, Supabase tokens, user IDs, document versions, timestamps, or secrets. This still places short-lived contact/business information in same-origin browser storage; clear site data removes it, and the app clears it after successful finalization.

After OTP verification, `complete-registration` validates the bearer token with `auth.getUser`, derives the user ID, rejects unknown fields, validates/normalizes the payload, chooses legal versions from server configuration, hashes the normalized payload, and invokes the transactional service-only RPC. Matching retries return the existing profile; a different payload never overwrites a completed registration.

If profile creation fails after OTP verification, the account remains verified and the UI offers an idempotent setup retry. It never reports account readiness until the profile exists.

Rollback is intentionally not automated. After backup and impact review, reverse dependencies in this order: Edge Functions, outbox functions, finalization function, trigger, policies, `transactional_email_outbox`, `user_legal_acceptances`, then `profiles`. Do not drop shared `pgcrypto` without confirming no other feature uses it.

## Welcome email Edge Function

`supabase/functions/send-welcome-email` authenticates the caller, requires authoritative email verification and a completed profile, and lets the database decide whether delivery is due. The outbox provides a permanent unique event, five-attempt ceiling, bounded exponential backoff, random claim tokens, claim expiry, stable provider idempotency key, provider message ID, and sanitized failure categories.

Only an expired claim that never reached `sending` can be reclaimed automatically. A network-ambiguous send or database completion failure enters `reconciliation_required` and is never automatically resent, preventing duplicates after Resend's 24-hour idempotency window. Such rows require an authorized operational reconciliation procedure. Welcome failure never removes the completed profile or legal records.

Deploy only after the migration:

```text
supabase functions deploy complete-registration
supabase functions deploy send-welcome-email
supabase secrets set RESEND_API_KEY=... WELCOME_FROM="Ashur Platform <no-reply@ashurplatform.com>" REGISTRATION_ENABLED=true LEGAL_TERMS_VERSION=... LEGAL_PRIVACY_VERSION=...
```

Never put `RESEND_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in Vite variables. Supabase supplies its function runtime service credentials server-side. `LEGAL_TERMS_VERSION` and `LEGAL_PRIVACY_VERSION` must identify the exact approved documents and are never accepted from the client. Do not paste secrets into issues, chat, source files, or frontend logs.

### Local-only registration flow testing

This mode does not approve or publish the draft legal documents. It is fail-closed in production builds, on non-local browser hosts, on all `*.netlify.app` hosts, and unless the configured Supabase hostname appears in an explicit local testing allowlist.

Add these values only to an uncommitted local environment file:

```text
VITE_ENABLE_LOCAL_REGISTRATION_TESTING=true
VITE_LOCAL_REGISTRATION_TEST_SUPABASE_HOSTS=127.0.0.1
```

For a local Supabase Edge runtime, configure server-side local secrets/environment values (never `VITE_*`):

```text
REGISTRATION_ENABLED=false
REGISTRATION_TEST_MODE=true
REGISTRATION_TEST_ALLOWED_ORIGIN=http://localhost:5173
LEGAL_TERMS_VERSION=draft-test-2026-08
LEGAL_PRIVACY_VERSION=draft-test-2026-08
```

The origin must match exactly. Use `http://127.0.0.1:5173` consistently instead if that is the browser origin; do not list both implicitly and never use `*`. Test versions must begin with `draft-test-`. The Edge Function refuses test mode when `REGISTRATION_ENABLED=true`, and production mode refuses `draft-test-` versions. Restart the local Vite and Edge runtimes after changing local environment values. Use disposable local accounts and Mailpit/local SMTP only—never production user data.

Both user-invoked functions explicitly keep gateway JWT verification enabled in `supabase/config.toml`, then independently call `auth.getUser`. CORS permits only `https://ashurplatform.com` and `https://www.ashurplatform.com`. Localhost is allowed only when the non-production function environment sets `ALLOW_LOCALHOST_ORIGINS=true`; wildcard origins are never accepted.

Registration remains disabled in `src/config/legal.ts` until approved Terms of Service and Privacy Policy content is supplied. This prevents users from consenting to placeholder legal text.

The configurable branch maximum, OTP UI cooldown, attempt ceiling, country list, and support placeholder live in `src/config/onboarding.ts`. Replace `SUPPORT_EMAIL_TO_CONFIRM` in configuration and the hosted template before production.

## Netlify

`public/_redirects` contains `/* /index.html 200`, so direct navigation and refresh work for React Router routes. Configure the two public environment variables in Netlify, use `npm run build`, and publish `dist`.

## Downloads and pricing

- Configure verified installer metadata in `src/config/downloads.ts`. No build is displayed unless it is marked available and has a real URL.
- Public installers may use GitHub Releases or a CDN.
- Private installers require a serverless/backend endpoint that verifies the Supabase bearer token and verified email, records the event server-side, and returns a short-lived signed URL. No such endpoint is included yet.
- Configure approved commercial terms in `src/config/pricing.ts`. Unconfirmed plans remain hidden.
- Checkout and card collection are intentionally not implemented.

## Licensing

`src/licensing/licensingService.ts` is an explicit unavailable adapter. Real trial activation, expiration, device limits, plan entitlement, revocation, and subscription status require an approved server-side licensing API. Website gating alone does not enforce a software trial.

## Commands

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npx deno check --config supabase/functions/deno.json --lock supabase/functions/deno.lock supabase/functions/complete-registration/index.ts supabase/functions/send-welcome-email/index.ts`
- `npx deno test --config supabase/functions/deno.json --lock supabase/functions/deno.lock --allow-env supabase/functions/_shared/security_test.ts`
- `powershell -ExecutionPolicy Bypass -File scripts/test-database-security.ps1` (pins Supabase CLI 2.113.0)

The database script starts only the disposable local Supabase stack, resets its local database, applies the migration, and verifies grants, RLS, constraints, concurrency, claims, backoff, maximum attempts, and rerun failure. It never contacts a production project. Frontend tests mock provider behavior and never contact Supabase or Resend.

## Manual production order (not automated)

Terms of Service and Privacy Policy are locally configured as owner-approved publication candidates at version `1.0.0`, effective and last updated `2026-08-16`. They are not represented as lawyer reviewed. Trial and Refund policies remain inactive drafts.

1. Verify that the deployed `/terms` and `/privacy` output exactly matches version `1.0.0` in both languages.
2. Review the migration and rerun the disposable database suite.
3. Apply the migration to a staging project with `supabase db push` and repeat role tests there.
4. Configure Auth OTP, password, CAPTCHA, SMTP, Site URL, and redirect settings.
5. Configure function secrets/settings without placing them in Vite or Git.
6. Set production registration values only after the preceding checks pass: `REGISTRATION_ENABLED=true`, `REGISTRATION_TEST_MODE=false`, `LEGAL_TERMS_VERSION=1.0.0`, `LEGAL_PRIVACY_VERSION=1.0.0`, and `APP_ORIGIN=https://ashurplatform.com`.
7. Verify a real production signup OTP and transactional welcome message using a dedicated non-production test identity before opening registration traffic.
6. Deploy `complete-registration`, then `send-welcome-email` with JWT verification enabled.
7. Exercise registration, retry, reconciliation, and email delivery in staging.
8. Enable both the frontend legal readiness flags and server `REGISTRATION_ENABLED` only after legal approval and staging sign-off.
9. Apply the reviewed migration/functions to production in the same order.
