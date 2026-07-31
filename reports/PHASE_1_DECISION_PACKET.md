# G1 Decision Packet — C1 Draft v0.3

- Prepared: 2026-07-28
- Gate: `G1_USER_APPROVAL`
- Effect of approval: authorizes the sealed M1 implementation specification only within the approved scope. It does **not** authorize account creation, publishing, external messages, KYC, spending, payments, provider connection, or production deployment.
- Current C1 status: `PRE_G1_DRAFT`. The required current-source refresh completed on 2026-07-28. This packet still requires named human G1 approval; no implementation or external mutation is authorized by this refresh.

## Decisions for the human owner

| ID | Decision needed | Recommended choice | Why it matters | Alternatives/trade-off |
|---|---|---|---|---|
| G1-01 | Architecture | Approve Next.js App Router + TypeScript strict + Supabase Postgres/Auth/RLS + Vercel previews, with provider-neutral outbox adapters | Supports public/private boundary, RLS, owner CRM, previews, and tested side effects | Choose another supported stack; this needs a revised C1 queue |
| G1-02 | Launch conversion | Approve `Business Leak Audit` as the sole initial primary CTA, with request state `received; awaiting confirmation` | Avoids fake booking and supports a small, truthful conversion flow | Consultation/demo/scope request; changes form/content/spec |
| G1-03 | Offers/prices | Approve a five-offer internal ladder but publish `Request scope` only until price ledger/legal review is complete | Current prices/capacity/tax/refund terms are unknown | Approve a complete, dated public price ledger now |
| G1-04 | Portfolio | Approve P1/P3/P10 as `DEMONSTRATION — provider proof pending`; defer all other portfolio cards until P1.5 | Source snapshots exist but no live/provider/client/result proof exists | Supply evidence/approved wording for a narrower or broader proof set |
| G1-05 | Social launch | Approve Instagram-first preparation, with founder LinkedIn and IronWake LinkedIn planned only after owner/URL/contact evidence; defer all other platforms | Aligns with known-but-unverified Instagram starting point and avoids fabricated links | Approve another explicit active set; human actions remain required |
| G1-06 | Contact/identity | Supply/approve display name, public domain, monitored mailbox, primary CTA destination, privacy contact, owner/recovery/admin matrix | Website and social CTAs cannot be truthful or functional without these | Defer public contact routes and keep implementation private until supplied |
| G1-07 | Budget/providers | Set monthly budget ceiling and approve/defer database, hosting, email, analytics, monitoring, calendar, WhatsApp, voice, and payment research recommendations | Prevents unowned/provider cost commitments | Keep all external adapters as test doubles/deferred |
| G1-08 | Legal/payment | Name adult/legal owner for contracts, privacy/terms review, taxes, invoices, refunds, KYC and payment ownership; keep payments excluded until review | Required for A4 decisions | Explicitly defer payment functionality |
| G1-09 | Data governance | Approve owner roles, MFA requirement, lead retention/deletion policy, consent wording owner, and message/DM minimisation rule | Required before schema and auth implementation | Keep P2 blocked |

## Facts to supply without secrets

Use `inputs/REAL_DATA_INTAKE.md` and `inputs/SOCIAL_SETUP_REAL_DATA.md`: public mailbox/contact destination, domain owner, operating/support hours, approved logo path, optional founder identity/portrait status, legal owner, owner users, approved languages, social owner/recovery/admins, verified existing URLs, booking rule, provider account owner, budget, and consent/retention requirements. Do not put passwords, tokens, MFA/recovery codes, cards, or identity documents in the repository.

## Evidence reviewed

- P0 source/truth: `reports/P0_GATE_A_READBACK.md`
- Portfolio snapshots: `reports/PORTFOLIO_SOURCE_SNAPSHOT_AUDIT.md`
- Stitch/route/claim/asset audits: `reports/STITCH_AUDIT.md`, `reports/SCREEN_ROUTE_MATRIX.md`, `reports/CLAIM_QUARANTINE.md`, `reports/ASSET_LEDGER.md`
- P1 research: `reports/COMPETITOR_RESEARCH.md`, `reports/UX_CONVERSION_RESEARCH.md`, `reports/PRICING_LOCALIZATION_RESEARCH.md`, `reports/TECHNICAL_DECISION_RECORD.md`
- C1 controls: `reports/PROVIDER_MATRIX.md`, `reports/SECURITY_PRIVACY_MODEL.md`, `reports/SEO_ACCESSIBILITY_PLAN.md`, `reports/W00_W22_C1_DECOMPOSITION.md`, `reports/COMPOSIO_RESEARCH_BLOCK.md`

## Current-source refresh evidence

- Composio Search session: `word`.
- Successful search logs: `log_aejYhHXVlnBa`, `log_zz0DI9lGYAC_`, `log__1RitJa2Dw1Z`.
- Successful public-page fetch log: `log_QQ3la3KcYsIw`; 16 requested URLs returned successful statuses, with one known Next.js index URL returning a page-not-found response and excluded from evidence.
- Refreshed reports: `reports/COMPETITOR_RESEARCH.md`, `reports/UX_CONVERSION_RESEARCH.md`, `reports/PRICING_LOCALIZATION_RESEARCH.md`, and `reports/TECHNICAL_DECISION_RECORD.md`.
- No provider connection, account mutation, publication, message, spend, deployment, KYC, or model identity claim occurred.

## Approval record

Record the selected choices, exclusions, approver, and date in `inputs/APPROVALS.md` Gate G1. After approval, C1 will freeze `state/SEALED_TASK_QUEUE.yaml` and transfer control to M1 without starting implementation in the same action.
