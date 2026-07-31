# P1 Technical Decision Record

- Retrieval date: 2026-07-28
- Decision status: **recommendations pending G1 approval; no dependency, schema, provider, account, or deployment has changed.**
- Current-source status: official documentation readback completed through Composio Search session `word` on 2026-07-28.

## Recommended baseline

| Concern | Recommendation | Reason and current source | Decision/gate |
|---|---|---|---|
| Web framework | Next.js App Router + TypeScript strict | Current Next.js production guidance covers performance, security, and release checks; the fetched page reported documentation version 16.2.12, but the implementation must use the supported version approved at build time ([production checklist](https://nextjs.org/docs/app/guides/production-checklist)). | G1: approve major dependency/architecture |
| Data/auth | Supabase Postgres/Auth with RLS, plus server-side authorization | Official production guidance says to enable RLS on all exposed tables; the RLS guide warns that browser access is only safe when policies and grants are deliberate ([production checklist](https://supabase.com/docs/guides/deployment/going-into-prod), [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)). | G1 architecture; G2 migration/auth/retention |
| Hosting | Vercel preview/production workflow, contingent on owner account/budget | Vercel documents separate Local, Preview, and Production environments with environment-specific variables; selection and owner/billing are material external decisions ([Vercel environments](https://vercel.com/docs/deployments/preview-deployments)). | G1 recommendation; G5 deployment |
| Notifications | Provider-neutral outbox adapters and test doubles; email first only after G4 | No provider success is represented before durable event commit and signed callback. WhatsApp/voice/calendar/payment remain deferred. | G4 per provider |
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
