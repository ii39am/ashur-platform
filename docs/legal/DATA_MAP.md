# Internal data map and retention decision matrix

Status: draft inventory. Retention periods and legal bases require confirmation.

| Data category | Current purpose | System/recipient | Current control | Retention decision |
| --- | --- | --- | --- | --- |
| Email, auth user ID, verification status | Account creation, authentication, security | Supabase Auth | Provider-managed session; no manual token storage | Confirm account/deletion and security-log periods |
| Password and OTP | Authentication and verification | Supabase Auth | Not stored in `public.profiles`; never logged by app | Provider configuration and logs require review |
| Name and E.164 phone | Account profile and support | Supabase database | Owner-only RLS; phone is not claimed as verified | Confirm active-account and deletion periods |
| Business details, branch count, awareness source | Onboarding and service context | Supabase database | Validated server-side; owner-only RLS | Confirm necessity and deletion period |
| Preferred language | Localized UI and messages | Browser preference; Supabase profile | Language preference is separate from auth | Retain with account; confirm post-deletion rule |
| Terms and Privacy acceptance event | Evidence of submitted acceptance | Immutable Supabase table | Server time/version; user read-only | Counsel to set legal-record period |
| Marketing choice | Optional communications preference | Supabase profile | Separate choice; database timestamp trigger | Retain current state plus approved audit needs |
| Welcome-email delivery state | Transactional delivery and retry | Supabase outbox; Resend | Minimal status/provider ID; no email body | Confirm operational/reconciliation period |
| Support communications | Responding to requests | Not yet inventoried | Dedicated system/contact not confirmed | Select system and retention before publication |
| Website logs and telemetry | Reliability/security | Hosting not confirmed | No complete production inventory | Inventory fields, locations, access, and periods |
| Payment data | Not active | No provider configured | Website does not collect card data | Define only when hosted payment is approved |
| Installer/download events | Not active | No build/storage configured | No fake counters or signed URLs | Define only with real delivery architecture |

For each production processor, record contract, processing purpose, fields, region, subprocessors, transfer mechanism, security controls, deletion behavior, and incident contact before approving the Privacy Policy.
