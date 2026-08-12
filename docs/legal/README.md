# Ashur legal package — internal draft record

Status: **DRAFT / UNPUBLISHED / NOT EFFECTIVE / REQUIRES QUALIFIED IRAQI COUNSEL REVIEW**

The website documents are product-integrated drafting material, not legal advice and not approved contractual text. Registration remains fail-closed until the Terms and Privacy documents have approved versions and dates and the minimum required business identity/contact facts are configured. Payment remains disabled; download builds remain unavailable.

## Missing decisions and facts

| Item | Current state | Blocks |
| --- | --- | --- |
| Legal entity name and entity type | Not confirmed | Publication and registration |
| Commercial registration number | Not confirmed | Publication |
| Registered and operating addresses | Not confirmed | Publication |
| Dedicated support, legal, and privacy email addresses | Not confirmed | Publication and registration |
| Public phone number | Not confirmed | Contact disclosures |
| Governing law and dispute forum | Requires Iraqi counsel | Terms/publication |
| Minimum account age | Requires Iraqi counsel | Registration |
| Terms/Privacy/Trial/Refund versions and dates | Not approved | Respective publication/acceptance |
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
5. Record approvals in the review checklist and change application configuration from `draft` to `approved` in a reviewed change.
6. Test version parity, consent text, routes, printing, and RTL/LTR.
7. Deploy the versioned documents before enabling registration, downloads, or payment acceptance.

Trial-policy acceptance requires a separate server-controlled acceptance event at the download stage if counsel decides it is mandatory. Refund-policy acknowledgement belongs at checkout if payment is introduced. Neither should be added to registration by default.
