# P1 Technical Decision Record

- Retrieval date: 2026-07-28; notification architecture refreshed 2026-08-09
- Decision status: **G1 architecture is approved; Resend Free is selected for code implementation only. Provider account/terms/domain/secret/webhook/send and deployment remain gated.**
- Current-source status: official documentation readback completed through Composio Search session `word` on 2026-07-28.

## Recommended baseline

| Concern | Recommendation | Reason and current source | Decision/gate |
|---|---|---|---|
| Web framework | Next.js App Router + TypeScript strict | Current Next.js production guidance covers performance, security, and release checks; the fetched page reported documentation version 16.2.12, but the implementation must use the supported version approved at build time ([production checklist](https://nextjs.org/docs/app/guides/production-checklist)). | G1: approve major dependency/architecture |
| Data/auth | Supabase Postgres/Auth with RLS, plus server-side authorization | Official production guidance says to enable RLS on all exposed tables; the RLS guide warns that browser access is only safe when policies and grants are deliberate ([production checklist](https://supabase.com/docs/guides/deployment/going-into-prod), [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)). | G1 architecture; G2 migration/auth/retention |
| Hosting | Preserve the current Netlify runtime and add a scheduled-function retry entrypoint behind the same provider-neutral worker | Netlify supports scheduled functions on all plans; Free is hard-capped, but the live account plan/usage and Git linkage need readback before enablement ([scheduled functions](https://docs.netlify.com/build/functions/scheduled-functions/), [credit plan](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)). | Local code under current programme; G5 enable/deploy |
| Notifications | Resend Free adapter with database-first owner/customer outbox events, durable attempts, 3-attempt retry/dead letter, signed delivery webhook, and owner replay | Free provides 3,000/month, 100/day, one domain and one webhook. Provider idempotency lasts 24 hours, so database uniqueness remains authoritative ([pricing](https://resend.com/pricing), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)). | Code selection approved; G2 additive migration; G4 connection/send |
| Analytics/monitoring | Privacy-minimised, consent-aware choice deferred | Domain/consent regions/data owner are unknown. | G1/G4 |
| Payments | Excluded from first implementation queue unless explicitly approved | Legal owner, KYC, tax, refund and price information are missing. | G1/G4/A4 |

## Architecture invariants

- Public pages never bundle admin data, unpublished content, provider payloads, secrets, service-role credentials, or lead records.
- Every public mutation is server-validated, rate-limited, idempotent, and persists its record before any side effect.
- Owner confirmation is required for appointment `confirmed`; a form submission can only be `received` or `requested`.
- Provider webhooks validate raw-body signature, reject replay, deduplicate event IDs, redact logs, and use bounded retry/dead-letter handling.
- Auth/RLS and application authorization are both tested for unauthenticated, expired-session, and wrong-role access.
- CSP, cookie/CSRF strategy, schema validation, output encoding, secret scanning, backup/restore, deletion/export, and security evidence are mandatory release work.

## Rejected/deferred alternatives

- Do not migrate from the unverified Firebase snapshot sources or combine Firebase and Supabase. They are portfolio demonstrations, not the IronWake baseline.
- Do not use the Tailwind CDN/inline-script Stitch architecture.
- Do not add voice, WhatsApp, calendar, payment, AI knowledge retrieval, or WebGL until the respective scope/provider/consent/operational evidence is approved.
- Do not use the Resend test domain for customer acknowledgements. It can send only to the account email; an owned verified domain is a hard production prerequisite.

## Security source baseline

Use OWASP ASVS Level 2-aligned controls and the OWASP API Security Top 10 as verification input; do not market a certification. The Next.js CSP guidance confirms CSP's role against XSS, clickjacking, and injection ([official guide](https://nextjs.org/docs/app/guides/content-security-policy)).

## Current-source evidence

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist) — fetched 2026-07-28; page metadata reports version 16.2.12 and a 2026-03-10 update date.
- [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) — fetched 2026-07-28; CSP is documented as a control against XSS, clickjacking, and code injection.
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod) — fetched 2026-07-28; RLS, security review, performance, and availability checks are required before public launch.
- [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) — fetched 2026-07-28; exposed-schema tables require enabled RLS and deliberate grants/policies.
- [Google Search Central](https://developers.google.com/search/docs/fundamentals/get-on-google) and [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) — fetched 2026-07-28; crawlability is not indexing or ranking proof, and the release budgets remain LCP 2.5 seconds, INP 200 milliseconds, and CLS 0.1.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — fetched 2026-07-28; W3C Recommendation dated 2024-12-12.
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) — fetched 2026-07-28; the project provides a basis for testing application security controls, not a certification for IronWake.
- [Resend pricing](https://resend.com/pricing), [idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [webhook events](https://resend.com/docs/webhooks/event-types), [signature verification](https://resend.com/docs/webhooks/verify-webhooks-requests), and [testing-domain restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) — fetched 2026-08-09.
- [Netlify Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/) and [Free-plan hard-cap controls](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) — fetched 2026-08-09.
