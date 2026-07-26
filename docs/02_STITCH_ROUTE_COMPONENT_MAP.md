# Stitch Route and Component Map

This is the initial migration map. P0 must confirm exact titles/CTAs/data dependencies from the actual export. G1 approves merges or deferrals.

| Stitch screen | Proposed route | Role | Shared production modules | Initial action |
|---|---|---|---|---|
| `ironwake_home_desktop` | `/` | Main positioning/conversion | Header, outcome hero, proof strip, system map, selected work, CTA | Keep/rewrite claims |
| `ironwake_about_truth_standard_desktop` | `/about` | Trust, operating standard | Truth labels, principles, ownership/contact | Keep; replace placeholders |
| `ironwake_systems_index_desktop` | `/systems` | Outcome/service index | System cards, fit selector, CTA | Keep; simplify choices |
| `ironwake_missed_lead_recovery_desktop` | `/systems/missed-lead-recovery` | Entry outcome | Workflow map, service fit, scope, CTA | Keep |
| `ironwake_booking_certainty_desktop` | `/systems/booking-control` | Booking outcome | State timeline, fit selector, scope | Keep; remove fake prices/results |
| `ironwake_trust_lead_capture_desktop` | `/systems/trust-lead-capture` | Website/lead outcome | Trust checklist, capture flow, CTA | Keep |
| `ironwake_ai_receptionist_desktop` | `/systems/ai-receptionist` | AI reception outcome | Disclosure, call flow, provider status, pilot CTA | Keep only truthful state |
| `ironwake_business_leak_audit_desktop` | `/audit` | Diagnostic offer | Audit explanation, qualification, CTA | Keep |
| `ironwake_business_leak_audit_intake_desktop` | `/audit/request` | Real intake | Multi-step form, consent, errors, success | Rebuild end-to-end |
| `ironwake_engagement_and_pricing_desktop` | `/pricing` or localized routes | Guided buying | Market selector, service recommender, scope cards, costs note | Rebuild after pricing approval |
| `ironwake_process_desktop` | `/process` | Delivery confidence | Phase timeline, gates, handover | Keep; remove internal annotations |
| `ironwake_work_index_desktop` | `/work` | Portfolio index | Filters, proof status, case-study cards | Keep |
| `ironwake_case_study_rapidpulse_desktop` | `/work/rapidpulse` | Plumbing demonstration | Case-study shell, proof ledger, live demo link | Keep if verified |
| `ironwake_case_study_harbour_estates_desktop` | `/work/harbour-estates` | Property demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_dentacare_desktop` | `/work/dentacare-pro` | Dental demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_aura_archives_desktop` | `/work/aura-archives` | Luxury inquiry demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_luxe_studio_desktop` | `/work/luxe-studio` | Studio booking demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_bramble_cafe_desktop` | `/work/bramble-cafe` | Reservation/catering demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_voltix_desktop` | `/work/voltix` | Quote/support demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_re_tech_desktop` | `/work/re-tech` | Repair intake demonstration | Case-study shell | Keep if verified |
| `ironwake_case_study_atelier_desktop` | `/work/atelier` | Salon reception demonstration | Case-study shell | Keep if verified |
| `ironwake_industries_index_desktop` | `/industries` | Niche index | Industry cards, outcome mapping | Consider merge until content depth exists |
| `ironwake_emergency_home_services_desktop` | `/industries/home-services` | Niche page | Niche pain map, relevant work, CTA | Keep only with original useful content |
| `ironwake_dental_and_private_clinics_desktop` | `/industries/dental-clinics` | Niche page | Compliance-safe copy, reception flow | Keep only with reviewed claims |
| `ironwake_premium_salons_and_spas_desktop` | `/industries/salons-spas` | Niche page | Booking/reception flow | Keep |
| `ironwake_insights_index_desktop` | `/insights` | Search/authority index | Article filters, cards | Launch only with real articles |
| `ironwake_insight_article_template_desktop` | `/insights/[slug]` | Article template | TOC, article body, citations, CTA | Keep template; quarantine fake article data |
| `ironwake_form_state_sheet_desktop` | private Storybook/test route | Design QA states | Inputs, validation, loading, success, failure | Do not index/public-nav by default |
| `ironwake_privacy_and_terms_desktop` | `/privacy` and `/terms` | Legal information | Separate documents, version/date/contact | Split; professional review |
| `ironwake_404_desktop` | framework not-found route | Recovery | Search/nav/CTA | Keep |

## Shared component families

1. Global shell: skip link, header, mobile navigation, footer, consent/notice surfaces.
2. Editorial primitives: section header, eyebrow/status, lead text, pull quote, divider, grid.
3. Outcome system: problem signal, workflow path, state node, before/after structure without fake metrics.
4. Proof system: proof badge, evidence list, limitations, demo/live link, provider status.
5. Case study: context, problem, system, walkthrough, state coverage, security/limits, next outcome.
6. Conversion: service fit selector, audit form, slot request, contact consent, confirmation/recovery.
7. Pricing: market/scope selector, recommendation, inclusions/exclusions, provider-cost disclosure.
8. Content: insight card, category filter, article body, citation, related content.
9. Private CRM: authenticated shell, pipeline, lead detail, timeline, tasks, bookings, notifications, settings, audit log.
10. State system: skeleton, empty, validation error, authorization denial, provider failure, retry, success, offline, reduced motion.

## Visual fidelity rule

Measure layout, spacing, typography, hierarchy, colors, and major composition against approved PNGs. Do not copy raster screenshots into the website as a substitute for components. Differences are acceptable only when documented as responsive, accessible, truthful, functional, or performance corrections—or explicitly approved design improvements.

