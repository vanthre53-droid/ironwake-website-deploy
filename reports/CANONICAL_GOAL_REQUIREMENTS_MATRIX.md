# Canonical Goal Requirements Matrix — 2026-08-08

Each row: ID, requirement, route/component, files, status.

| ID | Requirement | Route/Component | Files | Status |
|---|---|---|---|---|
| R01 | Premium light design | all pages | app/globals.css, app/components/*Header.js, *Footer.js | VERIFIED_DEPLOYED |
| R02 | Top nav with Pricing + Book Diagnostic visible | all pages | app/components/SiteHeader.js | VERIFIED_DEPLOYED |
| R03 | Mobile menu opens cleanly | all pages | app/components/SiteHeader.js | NEEDS_VERIFIED (360/390px visual) |
| R04 | Hero with 5-second clarity | / | app/page.js | VERIFIED_DEPLOYED |
| R05 | Substantial motion: hero Wake system | / | app/page.js, app/components/WorkflowDemo.js | PARTIAL (basic flow exists; needs 2.5D upgrade per goal §18) |
| R06 | Substantial motion: interactive lead journey | / | (to add) | MISSING |
| R07 | Substantial motion: owner ops demo | / | app/components/DashboardDemo.js | VERIFIED_DEPLOYED (4 records, interactive) |
| R08 | All 4 system pages reachable from home | / | app/page.js | VERIFIED_DEPLOYED (commit c8eb933) |
| R09 | PricingReference on each system page | /systems/* | app/components/PricingReference.js | VERIFIED_DEPLOYED |
| R10 | 5 canonical offers on /pricing with Lite/Std/Pro India + Intl | /pricing | app/pricing/PricingPage.js | VERIFIED_DEPLOYED (default = India; toggle to Intl works) |
| R11 | No fabricated metrics or stats | all | app/page.js, app/insights/page.js, app/audit/* | VERIFIED (committed c600bc8 + 3958aa4 + b068ec7 + 7367178) |
| R12 | Supabase POST /api/audit works on deployed site | /api/audit | supabase/migrations/*, app/api/audit/route.js | FAILED_DEPLOYED (502 — RPC error; env vars confirmed set in Netlify production context; deployed Supabase project's `submit_audit_inquiry` RPC may be missing or migrations not applied; diagnostic logging added but Netlify free plan does not expose console.error — owner must verify via Supabase SQL Editor that all 5 migrations are applied to the project URL `ipcpthmmcdtshbbsirwj.supabase.co`) |
| R13 | Anonymous /owner shows login, not data | /owner | app/owner/page.js | VERIFIED_DEPLOYED (login UI rendered) |
| R14 | AI Receptionist reframed from "concept" to real offer with capability/demo/provider/client status | /systems/ai-receptionist | app/systems/ai-receptionist/AiReceptionistSystem.js | VERIFIED_DEPLOYED |
| R15 | All 4 systems show their matching canonical offer | /systems/* | app/components/PricingReference.js | VERIFIED_DEPLOYED |
| R16 | FAQ mentions all 5 offers | /pricing (schema) | app/pricing/page.js | VERIFIED |
| R17 | Mobile body ≥16px | all pages | app/globals.css | VERIFIED_DEPLOYED (body = 17px; primary text 15-17px; helper .micro text 9-11px is intentional eyebrow style) |
| R18 | Performance ≥85 mobile / ≥90 desktop | all | (need Lighthouse) | NOT_RUN |
| R19 | Accessibility ≥95 | all | (need audit) | NOT_RUN |
| R20 | SEO score ≥95 | all | (need Lighthouse) | NOT_RUN |
| R21 | Substantial 2.5D motion per goal §18 (3 systems on home) | / | (workflow + dashboard + interactive-lead-journey + signal-rail) | VERIFIED_DEPLOYED (commit 4b394c2) |
| R22 | Chatbot answers exact pricing across 5 offers | chatbot | app/components/SiteAssistant.js | VERIFIED_DEPLOYED (all 5 Lite prices returned correctly) |
| R23 | Booking request persists with REQUEST_RECEIVED state, not CONFIRMED | /book | app/book/page.js, app/book/BookingPreview.js | VERIFIED_DEPLOYED (text: "Nothing is booked when you press send" + "No appointment is confirmed unless IronWake follows up with an explicit confirmation") |
| R24 | Owner dashboard with search/sort/export works | /owner | app/owner/OwnerDashboard.js | NEEDS_VERIFIED (requires owner login) |
| R25 | Sitemap includes all routes | /sitemap.xml | app/sitemap.js | VERIFIED_DEPLOYED |
| R26 | robots.txt allows crawling with sitemap | /robots.txt | app/robots.js | VERIFIED_DEPLOYED |
| R27 | All 9 portfolio case studies link to live Vercel demos | /work | app/work/page.js | VERIFIED_DEPLOYED |
| R28 | All 9 portfolio case studies have detailed walkthroughs | /work/* | app/work/*/CaseStudy.js | VERIFIED_DEPLOYED |
| R29 | Substantial motion: case study walkthroughs | /work/* | app/components/StepPipeline.js | VERIFIED_DEPLOYED (P1/P3/P10 use StepPipeline; sequential reveal with copper connector activation; reduced-motion safe) |
| R30 | Real Atelier comparison | reports/ATELIER_VS_IRONWAKE_MOTION_COMPARISON.md | VERIFIED_DEPLOYED (commit 9ee50bb — IronWake meets/exceeds floor on 9 of 9 axes) |
| R31 | All 4 systems linked from homepage with canonical offer | /, /systems/* | app/page.js, app/components/PricingReference.js | VERIFIED_DEPLOYED (commit c8eb933) |
| R32 | InteractiveLeadJourney: 3 channels, animated route | / | app/components/InteractiveLeadJourney.js | VERIFIED_DEPLOYED (commit 4b394c2) |

## Status counts
- VERIFIED_DEPLOYED: 18
- PARTIAL: 2
- NEEDS_VERIFIED: 3
- MISSING: 1
- FAILED_DEPLOYED: 1 (R12 Supabase RPC)
- NOT_RUN: 3 (R18-20 Lighthouse)
