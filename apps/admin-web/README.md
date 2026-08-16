# Ashur Platform Admin

Independent administration application for `https://admin.ashurplatform.com`. It does not import public-site pages, authentication UI, or application code.

## Safety status

Local/staging foundation only. Do not connect staging to production, deploy migrations, provision remote administrators, or enable unavailable product modules without separate approval.

## Local setup

1. Copy `.env.example` to `.env.local` and supply only the Admin environment/origin, reporting timezone, Supabase URL, its exact expected hostname, and publishable key.
2. Use a separate local/staging Supabase project. Never put a service-role/secret key in a `VITE_*` variable.
3. From this directory run `npm ci`, then `npm run dev`.
4. Run the pinned CLI with `npm run supabase -- --version`. Root Supabase commands can be invoked from the repository root using `apps/admin-web/node_modules/.bin/supabase`.

Expected local values include `VITE_ADMIN_ENVIRONMENT=local`, a localhost origin, and the local Supabase URL. Staging builds reject the production Admin origin and obviously production-named Supabase hosts. Production builds require exactly `https://admin.ashurplatform.com`.

## Authentication and provisioning

There is no Admin registration route. Admin access requires a verified Supabase email, a verified TOTP factor, an AAL2 session, and an active server-controlled membership. Every API operation revalidates the token and membership.

The first administrator may be created only from a trusted local/server context after the Auth user verifies email and enrolls MFA:

```powershell
$env:PGPASSWORD = '<local database password>'
psql -v user_id='<verified-auth-user-uuid>' -f ../../supabase/scripts/bootstrap_first_admin.sql
```

The function fails if any membership already exists, requires a verified MFA factor, and writes a bootstrap audit event. Do not commit IDs, passwords, access tokens, or server keys.

## Hosting preparation

`netlify.toml` supplies the SPA build and security headers; `public/_redirects` supplies route fallback. Its CSP permits only the reviewed Ashur Supabase HTTPS and WSS endpoints; never replace them with wildcard origins.

Future DNS, not configured here:

```text
CNAME admin -> ADMIN_SITE_NAME.netlify.app
```

## Disabled modules

Trials, downloads, licensing, support tickets, suspension/reactivation, payment, revenue, subscriptions, exports, and settings mutations remain “Not configured.”
