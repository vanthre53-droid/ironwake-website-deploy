# Claim Quarantine

## 2026-07-26 P1/P3/P10 source-snapshot extension

`reports/PORTFOLIO_SOURCE_SNAPSHOT_AUDIT.md` records the P1 RapidPulse, P3 DentaCare Pro, and P10 Atelier ZIP snapshots. Their embedded UI/data/provider states are unverified demonstration fixtures, not public proof. Quarantine every claim of provider availability, live/real-time workflow, booking/order/payment/delivery confirmation, verified review, price, result, client engagement, technical/security outcome, and named person or business status until the P1.5 proof gate records reproducible evidence and approved wording.

- Audited: 2026-07-26T15:28:59Z
- Source: verified Stitch archive `0b4b617524385637fca115965d596eac7dac56a29a578b155a3a09cea1dbd16d`
- Status: all items below are `DO NOT PUBLISH` until evidence and named approval are recorded in a claim ledger.

## Quarantined Claim Families

| ID | Claim family | Prototype examples | Required release condition |
|---|---|---|---|
| CQ-01 | Public prices and rates | INR/USD offer tiers, monthly fees, audit prices, per-minute/provider rates | Current research, approved offer/price ledger, market/currency/tax scope, named G1 approval. |
| CQ-02 | Results and benchmark figures | 98% booking-to-arrival, 74% reduced unrouted inquiries, 42% missed rate, 18% retention increase | Reproducible source, methodology, date, allowed wording, named approval. |
| CQ-03 | Accuracy, latency, and scale | sub-60 seconds, 99.2%/99.8% accuracy, 1,200 simulated nodes, 1,400+ variants | Test evidence and clear demonstration/test scope; never imply a client result. |
| CQ-04 | Provider and integration states | real-time provider polling, calendar sync, CRM routing, payment verification, clinic-management sync | Durable database evidence plus signed/authoritative provider callback where applicable. |
| CQ-05 | Proprietary/security language | proprietary engines/routing, zero third-party data leakage, uptime logic | Precise documented meaning, security review, and named approval. |
| CQ-06 | Case-study/project claims | client-like project pages, workflow outcomes, operating status | P1/P3/P10 and remaining portfolio proof gate; otherwise label `DEMONSTRATION` or hide. |
| CQ-07 | Research and audit assertions | audits of 42 platforms, 14 failure points, industry-standard benchmarks | Primary research/citations or removal. |
| CQ-08 | Founder, testimonial, and customer language | founder quotation, paid-testimonial references, high-intent lead/revenue statements | Verified author identity/permission and evidence; do not infer a founder profile or customer relationship. |
| CQ-09 | Retention and privacy terms | 90-day purge statement and privacy/terms content | Actual approved retention policy and adult/legal review. |

## Explicitly Quarantined Screens

- `ironwake_engagement_and_pricing_desktop`
- `ironwake_booking_certainty_desktop`
- `ironwake_ai_receptionist_desktop`
- `ironwake_business_leak_audit_desktop`
- `ironwake_business_leak_audit_intake_desktop`
- `ironwake_case_study_rapidpulse_desktop`
- `ironwake_case_study_dentacare_desktop`
- `ironwake_case_study_atelier_desktop`
- `ironwake_insight_article_template_desktop`
- `ironwake_home_desktop`
- `ironwake_systems_index_desktop`
- `ironwake_trust_lead_capture_desktop`
- `ironwake_missed_lead_recovery_desktop`
- `ironwake_emergency_home_services_desktop`
- `ironwake_premium_salons_and_spas_desktop`
- `ironwake_industries_index_desktop`

Other screens are also subject to the same rule. This list prioritizes the audit's direct matches and does not certify non-listed screens.

## Required Next Evidence

1. `reports/CLAIM_LEDGER.md` after portfolio proof and Phase 1 decisions.
2. P1.5 source/provider proof for RapidPulse, DentaCare, and Atelier.
3. G1 approval before any public price or offer is rendered.
4. G3 approval before public copy/assets are released.

## 2026-08-17 SEO worker JSON-LD invented sameAs claim — QUARANTINED

SEO worker t_ec097c7f added inline `ORG_JSONLD` blocks across **35 files** in `app/*/page.js`. The blocks hardcode:
- `sameAs: ["https://github.com/ironwake"]` — **DOES NOT MATCH** live production (`https://www.instagram.com/ironwake.dev/`)
- `alternateName: "IronWake Systems Practice"` — **DOES NOT EXIST** in live production, no evidence, invented
- `founder.name: "Revanth Nunna"` + `jobTitle: "Founder"` — published without owner verification step
- `contactPoint.email: "ironwake.dev@gmail.com"` — must verify against RESEND_DOMAIN verified sender + CLAIM_LEDGER

### Why quarantined
1. AGENTS.md §3 (No-invention law) — alternateName is fabricated; sameAs is wrong vs live.
2. Deploy task t_d6a07044 (blocked) would ship this to live ironwake.dev if it ran.
3. Hero claim — if "alternateName" lands on Google's structured data inspection, it becomes a public false statement.

### Required action before unblocking t_d6a07044
1. **Revert the working tree** to HEAD (38ee5ff) so SEO diff is rolled back.
2. Use the existing canonical `lib/seo.mjs -> organizationLd()` everywhere (already includes correct sameAs).
3. If a per-page canonical override is needed, export the constant once in lib/seo.mjs and import — do NOT duplicate JSON-LD objects in 35 files.
4. Remove `alternateName`, remove hardcoded founder object, remove gmail contactPoint unless CLAIM_LEDGER proves it.

### Verdict
- Status: `DO NOT DEPLOY`
- Working tree: 35 files modified, 1812 insertions, **uncommitted**
- Mitigation: deploy task `t_d6a07044` already blocked (needs owner "deploy it" override)
