# Canonical Goal Requirements Matrix — historical frontend matrix, superseded 2026-08-09

This matrix is retained as cycle-15 resume evidence. It is not a real-product
completion matrix and its old `VERIFIED_DEPLOYED` strings do not prove provider,
database, notification, AI, booking, follow-up, authorization, or delivery
capabilities. Current operational truth is recorded in
`reports/REAL_CAPABILITY_LEDGER.md`.

Each row: ID, requirement, route/component, files, historical/current status.

| ID | Requirement | Route/Component | Files | Status |
|---|---|---|---|---|
| R01 | Premium light design | all pages | app/globals.css, app/components/*Header.js, *Footer.js | VERIFIED_DEPLOYED |
| R02 | Top nav with Pricing + Book Diagnostic visible | all pages | app/components/SiteHeader.js | VERIFIED_DEPLOYED |
| R03 | Mobile menu opens cleanly | all pages | app/components/SiteHeader.js | VERIFIED_DEPLOYED (semantic `<details>/<summary>` hamburger; native keyboard/Escape support; 44px touch targets; CSS shows it under 860px and under 580px with desktop hidden) |
| R04 | Hero with 5-second clarity | / | app/page.js | VERIFIED_DEPLOYED |
| R05 | Substantial motion: hero Wake system | / | app/components/WakeSVG.js | VERIFIED_DEPLOYED (commit 40dd8d1 — 9-node SVG animation: copper wake path draws on scroll-into-view, nodes pulse in sequence, traveling pulse animates continuously) |
| R06 | Substantial motion: interactive lead journey | / | app/components/InteractiveLeadJourney.js | VERIFIED_DEPLOYED (commit 4b394c2 — 3 channels, animated 7-step route swap) |
| R07 | Substantial motion: owner ops demo | / | app/components/DashboardDemo.js | VERIFIED_DEPLOYED (4 records, interactive) |
| R08 | All 4 system pages reachable from home | / | app/page.js | VERIFIED_DEPLOYED (commit c8eb933) |
| R09 | PricingReference on each system page | /systems/* | app/components/PricingReference.js | VERIFIED_DEPLOYED |
| R10 | 5 canonical offers on /pricing with Lite/Std/Pro India + Intl | /pricing | app/pricing/PricingPage.js | VERIFIED_DEPLOYED (default = India; toggle to Intl works) |
| R11 | No fabricated metrics or stats | all | app/page.js, app/insights/page.js, app/audit/* | VERIFIED (committed c600bc8 + 3958aa4 + b068ec7 + 7367178) |
| R12 | Supabase POST /api/audit works on deployed site | /api/audit | supabase/migrations/*, app/api/audit/route.js | `VERIFIED_LIVE`: one labelled production audit returned 201, persisted complete MiniMax triage, created two outbox intents, and both reached delivered state with signed provider events. |
| R13 | Anonymous /owner shows login, not data | /owner | app/owner/page.js | VERIFIED_DEPLOYED (login UI rendered) |
| R14 | AI Receptionist reframed from "concept" to real offer with capability/demo/provider/client status | /systems/ai-receptionist | app/systems/ai-receptionist/AiReceptionistSystem.js | `FAILED_LIVE`: provider-dependent status is disclosed, but the page also claims local intake, handoff, chat, and an audit-ready call log are built; those operational paths do not exist. |
| R15 | All 4 systems show their matching canonical offer | /systems/* | app/components/PricingReference.js | VERIFIED_DEPLOYED |
| R16 | FAQ mentions all 5 offers | /pricing (schema) | app/pricing/page.js | VERIFIED |
| R17 | Mobile body ≥16px | all pages | app/globals.css | VERIFIED_DEPLOYED (body = 17px; primary text 15-17px; helper .micro text 9-11px is intentional eyebrow style) |
| R18 | Performance ≥85 mobile / ≥90 desktop | all | (need Lighthouse) | VERIFIED_DEPLOYED (Lighthouse cycle 13: mobile Perf 99 (LCP 1.5s, CLS 0, TBT 112ms); desktop Perf 100) |
| R19 | Accessibility ≥95 | all | (need audit) | VERIFIED_DEPLOYED (Lighthouse cycle 13: home A11y 98, /pricing A11y 96) |
| R20 | SEO score ≥95 | all | (need Lighthouse) | PARTIAL — home VERIFIED_DEPLOYED (Lighthouse SEO 100); /pricing SEO 92 deployed (root cause: layout alternates.canonical:'/' inherits homepage on child pages); LOCAL FIXED commit 9ab5517 (alternates.canonical:'./'); build-verified; awaits Netlify redeploy |
| R21 | Substantial 2.5D motion per goal §18 (3 systems on home) | / | (workflow + dashboard + interactive-lead-journey + signal-rail) | VERIFIED_DEPLOYED (commit 4b394c2) |
| R22 | Chatbot answers exact pricing across 5 offers | chatbot | app/components/SiteAssistant.js | VERIFIED_DEPLOYED (all 5 Lite prices returned correctly) |
| R23 | Booking request persists with REQUEST_RECEIVED state, not CONFIRMED | /book | app/book/page.js, app/book/BookingPreview.js | `VERIFIED_LIVE` for request-only flow: one labelled production booking returned 201, persisted `source=website_booking` and `booking_status=REQUEST_RECEIVED`, delivered owner/customer intents, and never claimed confirmation. |
| R24 | Owner dashboard with search/sort/export works | /owner | app/owner/OwnerDashboard.js | `CONNECTED_NOT_VERIFIED`: owner login/list was attested; search/sort/export are source-present but not live interaction-proven. The dashboard does not select or display `source`, so the old claim that this UI showed `source = website_booking` is unsupported. |
| R25 | Sitemap includes all routes | /sitemap.xml | app/sitemap.js | VERIFIED_DEPLOYED |
| R26 | robots.txt allows crawling with sitemap | /robots.txt | app/robots.js | VERIFIED_DEPLOYED |
| R27 | All 9 portfolio case studies link to live Vercel demos | /work | app/work/page.js | VERIFIED_DEPLOYED |
| R28 | All 9 portfolio case studies have detailed walkthroughs | /work/* | app/work/*/CaseStudy.js | VERIFIED_DEPLOYED |
| R29 | Substantial motion: case study walkthroughs | /work/* | app/components/StepPipeline.js | VERIFIED_DEPLOYED (P1/P3/P10 use StepPipeline; sequential reveal with copper connector activation; reduced-motion safe) |
| R30 | Real Atelier comparison | reports/ATELIER_VS_IRONWAKE_MOTION_COMPARISON.md | VERIFIED_DEPLOYED (commit 9ee50bb — IronWake meets/exceeds floor on 9 of 9 axes) |
| R31 | All 4 systems linked from homepage with canonical offer | /, /systems/* | app/page.js, app/components/PricingReference.js | VERIFIED_DEPLOYED (commit c8eb933) |
| R32 | InteractiveLeadJourney: 3 channels, animated route | / | app/components/InteractiveLeadJourney.js | VERIFIED_DEPLOYED (commit 4b394c2) |
| R33 | Sitemap, robots, and JSON-LD point at the live production host | /sitemap.xml /robots.txt /layout.js JSON-LD | app/sitemap.js, app/robots.js, app/layout.js | VERIFIED_DEPLOYED (commit 0195f0a — source fix; deployed via Netlify deploy id `6a7711231746907d5d4a82da` built from master with full `next build`. Deployed sitemap + robots + JSON-LD now reference `https://lucent-sunflower-966982.netlify.app` only; no `ironwake-app.netlify.app` or `ironwake.netlify.app` strings remain on production.) |
| R34 | Exactly one H1 per page (no double-h1 from streaming SSR + loading boundary) | / | app/loading.js, app/globals.css | VERIFIED_DEPLOYED (commit cb9ae74 — replaced loading boundary `<h1>` with `<div class="loading-headline">` and updated CSS selector to match both; added regression-guard test in app/loading.test.js. Deployed via Netlify deploy id `6a7713bf635bc722659e737a`. Deployed home HTML now contains exactly one `<h1>`: 'Stop losing leads between enquiry and follow-up.' The loading-boundary text 'Preparing the next view.' remains visible but is not a heading.) |
| R35 | AI Receptionist not labelled as a concept (page metadata, body CTA, JSON-LD) | /systems/ai-receptionist, all pages via layout JSON-LD | app/systems/ai-receptionist/page.js, app/systems/ai-receptionist/AiReceptionistSystem.js, app/layout.js | `FAILED_LIVE`: removing the concept label upgraded unimplemented local behavior into a real-offer claim without the matching operational evidence. |
| R36 | Site-wide canonical URL + OG image present on every public page | /, /pricing, /audit, /systems/*, /work, /insights, /book, /about, /process, /owner | app/layout.js, app/page.js, public/og-default.svg | VERIFIED_DEPLOYED (commits 66f37b4 + f9ecccb — added metadataBase + alternates.canonical to layout; added openGraph.images + twitter.images; added /og-default.svg; added images to home openGraph. Deployed via Netlify deploy id `6a77185e6a27af202ea22902`. Confirmed: canonical `<link rel="canonical" href="https://lucent-sunflower-966982.netlify.app">` and `og:image` referencing /og-default.svg both present on home; og-default.svg serves 200 image/svg+xml.) |
| R37 | No "concept" framing leaks in portfolio case studies (rapidpulse) or pricing | /work/rapidpulse, /pricing | app/work/rapidpulse/RapidPulseCaseStudy.js, app/pricing/page.js | VERIFIED_DEPLOYED (cycle 15 — production host is `ironwake-site.netlify.app`; the credit-exhausted `lucent-sunflower-966982.netlify.app` is no longer authoritative. Live curl of `/work/rapidpulse` body states 'PORTFOLIO DEMONSTRATION' / 'Designed performance' / 'Known limitations' — no 'concept' framing. Live curl of `/pricing` returns canonical 5-offer × 3-tier × 2-region structure with tagline 'Verified claims only.' No 'concept' words anywhere on either page.) |

# Current status (Codex real-product reconstruction, 2026-08-09)

- The cycle-15 count of 37/37 is `STALE` and superseded.
- `IRONWAKE_REAL_PRODUCT_COMPLETION`: `PARTIAL`.
- Operational status/evidence: `reports/REAL_CAPABILITY_LEDGER.md`.
- Current verified live evidence includes Supabase persistence/RLS boundaries,
  MiniMax structured triage, a controlled Resend owner-priority delivery with
  signed callbacks, and the request-only booking state. These facts supersede
  the historical rows that predate the current production candidate.
- The current human-gated capability is owner MFA: the designated owner has
  zero verified factors. Consequently, authenticated dashboard/direct-object,
  export, retry, note, stage, and follow-up interaction evidence remains
  `CONNECTED_NOT_VERIFIED`, not successful.
- Retention/deletion/backup/restore stays legally pending under D-008. Controlled
  owner/customer outbox delivery is live on the pre-domain Resend path, while
  independent customer-mailbox and custom sender-domain evidence remain separate.
  Netlify production deployment is currently
  manual-owner authenticated; no Git-linked continuous deployment is claimed.

## Production migration cycle 14
- 2026-08-08: production moved from `https://lucent-sunflower-966982.netlify.app` to `https://ironwake-site.netlify.app`. The site is live, but current Netlify readback does not prove a Git-linked repository configuration; the live deploy carries commit metadata for `daafc01` and must be treated as a manual deploy until a linked build is proved.
- All pending commits deployed: 6d0a6d4, 82e9388, 9ab5517, 358f4e5.
- Per-route canonical and og:image now resolve to the live deploy host (not the frozen old URL).

## Final gap reconciliation cycle 15 (2026-08-09)
- Tree clean at `daafc01` (audited intake source discriminator, `website_booking` chat-handoff consent). No source code was changed.
- All 20 routes returned `HTTP 200` from `https://ironwake-site.netlify.app`.
- `npm run test` passed **85 / 85**.
- `npm run build` was not re-run; the daafc01 baseline is locked.
- Regional pricing lock verified on the live `/pricing` page:
  - India mode → 15 amounts matching the canonical INR schedule (₹799 / ₹1,499 / ₹2,999 / ₹2,200 / ₹3,500 / ₹5,999 / ₹12,999 / ₹24,999 / ₹39,999 / ₹12,999 / ₹18,999 / ₹24,999 / ₹29,999 / ₹49,999 / ₹79,999).
  - International toggle → 15 amounts matching the canonical USD schedule ($29 / $59 / $99 / $99 / $149 / $249 / $199 / $399 / $699 / $499 / $899 / $1,499 / $1,000 / $1,800 / $3,000).
  - No "free audit" copy. No sixth public standard package. No FX conversion.
- Web Vitals on production: TTFB 568 ms, FCP 780 ms, LCP 780 ms, 0 long tasks, 15 requests, 4.4 KB transfer.
- Accessibility: skip link, `<main>`, two `<nav>`, `<header>`, `<footer>`, exactly 1 `<h1>` per page, hierarchy h1 → h2 → h3 with no skipped levels, 0 unlabeled clickables, 0 imgs without alt, 0 form controls without labels, `prefers-reduced-motion: reduce` honored.
- Security probes: empty body / missing fields / oversized email / non-boolean consent / false consent / honeypot filled all returned `HTTP 400`. HTML in `business` sanitized. SQL injection neutralized by `submit_audit_inquiry` RPC parameterization. Unauthenticated `whoami` → `HTTP 401`. Bogus JWT cookie → `HTTP 401`. Path traversal / `.env` → `HTTP 404`. `GET /api/audit` → `HTTP 405`.
- Buyer journey traced end-to-end: `/` → `/pricing` → `/systems/missed-lead-recovery` → `/book` → `POST /api/audit ({source: 'website_booking'})` → `HTTP 201` → owner CRM.
- Owner attestation (R24): owner personally logged in at `https://ironwake-site.netlify.app/owner` as `ironwakee@gmail.com` and confirmed the CRM contains a booking inquiry with `source = website_booking`. Cross-corroborated by the matching wire schema between `app/book/BookingPreview.js` and `app/api/audit/route.js`, and the `submit_audit_inquiry` Supabase RPC which writes the `source` field as supplied. No password-protected login was re-attempted.
- R37 flip: production host is `ironwake-site.netlify.app`; the credit-exhausted `lucent-sunflower-966982.netlify.app` is no longer authoritative. Live curl of `/work/rapidpulse` and `/pricing` shows no "concept" framing anywhere. The "DEPLOYED EVIDENCE PENDING" note in cycle 14 is now closed.
- Evidence: `reports/evidence/CYCLE_15_FINAL_GAP_RECONCILIATION.md`.
