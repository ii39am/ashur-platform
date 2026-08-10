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
- Customize verification and recovery email templates with the Ashur brand and keep links pointed at the configured redirect routes.

No database table or schema migration is required. The registration flow stores only `full_name` in Supabase Auth user metadata.

Registration remains disabled in `src/config/legal.ts` until approved Terms of Service and Privacy Policy content is supplied. This prevents users from consenting to placeholder legal text.

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

Automated tests mock provider behavior and never contact Supabase.
