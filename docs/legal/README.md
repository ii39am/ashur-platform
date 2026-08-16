# Ashur legal package — internal publication record

Status: **TERMS AND PRIVACY INTERNALLY APPROVED FOR INITIAL PUBLICATION; NOT LAWYER REVIEWED**

The Ashur Platform owner internally approved Terms of Service 1.0.0 and Privacy Policy 1.0.0 for initial publication, effective and last updated 2026-08-16. This is business-owner approval, not evidence of review or approval by qualified Iraqi legal counsel. Trial and Download Policy and Refund Policy remain draft, unpublished, inactive, and are not registration requirements. Payment and download builds remain unavailable.

## Missing decisions and facts

| Item | Current state | Blocks |
| --- | --- | --- |
| Legal entity name and entity type | Not confirmed; public pages use “Ashur Platform” only as the trading name | Counsel/legal checklist; does not invent an entity |
| Commercial registration number | Not confirmed | Publication |
| Registered and operating addresses | Not confirmed | Publication |
| Dedicated support, legal, and privacy email addresses | Not verified; therefore not displayed in the published Terms or Privacy pages | Contact publication |
| Public phone number | Not confirmed | Contact disclosures |
| Governing law and dispute forum | Requires Iraqi counsel | Terms/publication |
| Minimum account age | Requires Iraqi counsel; no unconfirmed numeric threshold is published | Counsel review |
| Terms and Privacy versions and dates | Owner-approved 1.0.0; effective/updated 2026-08-16 | Production deployment parity |
| Trial/Refund versions and dates | Draft and inactive | Trial/payment launch |
| Trial duration, limits, licensing, builds, and support | Not configured | Trial launch/downloads |
| Prices, currency, taxes, payment methods, renewals, cancellation, refunds | Not configured | Payment/checkout |
| Hosting/processors/locations/transfer safeguards | Needs deployment inventory | Privacy publication |
| Retention periods and request workflow | Not approved | Privacy publication |

Use internal configuration fields in `src/config/legal.ts`; do not put placeholder tokens or guessed facts into user-facing pages.

## Iraqi legal research inputs

These sources are recorded for counsel review and do not establish a legal conclusion by themselves:

- Iraqi Ministry of Justice / Official Gazette translation, Electronic Signatures and Transactions Law No. 78 of 2012: https://moj.gov.iq/upload/pdf/%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D8%AA%D9%88%D9%82%D9%8A%D8%B9%20%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%A7%D9%85%D9%84%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A7%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9.pdf
- Iraqi Ministry of Justice / Official Gazette, Regulation of Electronic Commerce No. 4 of 2025: https://moj.gov.iq/upload/pdf/4818_compressed_323.pdf
- Iraqi Ministry of Justice / Official Gazette, 2025 implementation instructions concerning Electronic Signatures and Transactions Law No. 78 of 2012: https://moj.gov.iq/upload/pdf/4826_compressed_659.pdf
- Iraqi Council of Representatives law-search portal, for checking current enacted and proposed legislation: https://iq.parliament.iq/law/%D8%A7%D9%84%D8%A8%D8%AD%D8%AB-%D8%B9%D9%86-%D9%82%D8%A7%D9%86%D9%88%D9%86/

Counsel must verify the original Arabic gazette texts, amendments, territorial scope (including Kurdistan Region implications where relevant), consumer rules, privacy/data rules, tax rules, and enforceability before approval.

## Publication workflow

1. Confirm every missing fact and product behavior.
2. Complete Iraqi legal and Arabic-language review.
3. Assign immutable versions and ISO dates to all approved documents.
4. Ensure the exact rendered documents match the versions configured in the finalization Edge Function.
5. Record owner approval separately from lawyer review. Never mark the lawyer-review item complete without evidence.
6. Test version parity, consent text, routes, printing, and RTL/LTR.
7. Deploy the versioned documents before enabling registration, downloads, or payment acceptance.

Trial-policy acceptance requires a separate server-controlled acceptance event at the download stage if counsel decides it is mandatory. Refund-policy acknowledgement belongs at checkout if payment is introduced. Neither should be added to registration by default.
