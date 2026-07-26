# Stitch Screen Route Matrix

- Audited: 2026-07-26T15:32:35Z
- Source: verified Stitch archive `0b4b617524385637fca115965d596eac7dac56a29a578b155a3a09cea1dbd16d`
- Method: reconciled actual `code.html` titles, CTA text, controls, and links against `docs/02_STITCH_ROUTE_COMPONENT_MAP.md`.
- Scope: all 30 desktop prototype screens. This is a production disposition plan, not route approval.

| Screen | HTML title | Proposed route | Actual primary CTA(s) | Data/form/provider dependency | Truthful production disposition |
|---|---|---|---|---|---|
| `ironwake_404_desktop` | `IronWake / 404 - Path Unowned` | Framework not-found route | `Return Home`; `Explore Work`; `View Systems`; `Start an Audit` | Static recovery links; prototype WebGL shader | Keep recovery intent; replace shader with progressive/static fallback and link only to active routes. |
| `ironwake_about_truth_standard_desktop` | `IronWake / About & Truth Standards` | `/about` | No dedicated primary CTA | No form/provider; unverified founder identity and accuracy metric | Keep only after removing unverified identity, metric, and operational claims. |
| `ironwake_ai_receptionist_desktop` | `IronWake / AI Receptionist Service` | `/systems/ai-receptionist` | `Select Tier`; `Inquire` | Static price toggle; claimed AI/voice, booking, and logging states | Defer pending provider, pricing, disclosure, and proof approval; later use only clearly labelled demonstration/pilot information. |
| `ironwake_booking_certainty_desktop` | `IronWake / Booking Certainty` | `/systems/booking-control` | `Review my booking flow`; `Business Leak Audit` | Four checkboxes; claimed booking/attribution state; unapproved prices/outcomes | Rebuild with validated fit selection and truthful requested/confirmed booking states. |
| `ironwake_business_leak_audit_desktop` | `IronWake / Business Leak Audit` | `/audit` | `Start an Audit`; `REQUEST AUDIT`; `PURCHASE SNAPSHOT` | Static market toggle; implied purchase path; benchmarks/pricing | Rebuild diagnostic route with approved conversion flow; remove inert CTAs, prices, benchmarks, and purchase implication. |
| `ironwake_business_leak_audit_intake_desktop` | `IronWake / Business Leak Audit Intake` | `/audit/request` | Prototype form submission control; `Start an Audit` nav CTA | One form, 14 controls; inquiry/contact/consent data; no API/provider proof | Rebuild server-first with validation, durable inquiry, consent snapshot, rate limits, acknowledgement, and failure/retry states. |
| `ironwake_case_study_atelier_desktop` | `IronWake - Atelier Case Study` | `/work/atelier` | `PUBLIC DEMO: ATELIER-LUXURY-SALON.VERCEL.APP` | External demo; claimed Google/Fresha polling and booking state | Defer pending P10 proof gate; later retain only approved `DEMONSTRATION` wording. |
| `ironwake_case_study_aura_archives_desktop` | `Aura Archives / IronWake Case Study` | `/work/aura-archives` | `VIEW LIVE PROTOTYPE` | External prototype; unverified transaction, accuracy, and infrastructure claims | Defer pending portfolio evidence and approved asset/claim ledger. |
| `ironwake_case_study_bramble_cafe_desktop` | `IronWake - Bramble Cafe Case Study` | `/work/bramble-cafe` | `bramble-cafe.vercel.app` | External demo; reservation, slot, payment, and provider claims | Defer pending verification; payment is explicitly not operational. |
| `ironwake_case_study_dentacare_desktop` | `DentaCare - Dental Receptionist Demonstration / IronWake` | `/work/dentacare-pro` | `Review my clinic intake` | Claimed clinic-management availability integration and reception workflow | Defer pending P3 portfolio truth/proof gate; do not represent clinic/provider state as live. |
| `ironwake_case_study_harbour_estates_desktop` | `IronWake / Harbour Estates Lead Command Case Study` | `/work/harbour-estates` | `Review my property lead flow`; `Explore systems` | Claimed capture-to-CRM timing/monitoring | Defer pending portfolio, CRM, and provider evidence. |
| `ironwake_case_study_luxe_studio_desktop` | `IronWake - Luxe Studio Case Study` | `/work/luxe-studio` | `VISIT PUBLIC DEMO` | External demo; claimed availability/provider state | Defer pending portfolio evidence; later use only approved demonstration labels. |
| `ironwake_case_study_rapidpulse_desktop` | `IronWake / RapidPulse Case Study` | `/work/rapidpulse` | No dedicated hero CTA | Claimed dispatch, qualification, latency, and provider state | Defer pending P1 portfolio/provider proof; latency and performance claims are quarantined. |
| `ironwake_case_study_re_tech_desktop` | `IronWake - RE-TECH Case Study` | `/work/re-tech` | `VIEW PUBLIC DEMO LOGS` | External logs; email field; claimed ERP/status integration | Defer pending external-demo and ERP/provider evidence. |
| `ironwake_case_study_voltix_desktop` | `IronWake - Voltix Case Study` | `/work/voltix` | `voltix-fawn.vercel.app` | External demo; quote/inventory claims; market toggle | Defer pending portfolio proof; quote, inventory, latency, and metric claims remain quarantined. |
| `ironwake_dental_and_private_clinics_desktop` | `IronWake / Dental & Private Clinics Intake Systems` | `/industries/dental-clinics` | `Start an Audit`; `Enter Simulator` | Simulator implication; clinic intake/booking claims; price | Defer pending compliance-safe original content and approved proof. |
| `ironwake_emergency_home_services_desktop` | `IronWake / Emergency Home Services Audit` | `/industries/home-services` | `Audit My Flow`; `View Documentation` | One form with business/phone fields; dispatch/telephony/routing/provider costs | Defer pending original useful content and compliant lead flow; metrics, pricing, imagery, and provider claims are unverified. |
| `ironwake_engagement_and_pricing_desktop` | `Engagement & Pricing / IronWake` | `/pricing` or approved localized routes | `Request Audit`; `Deploy System`; `Build Architecture`; `Select System`; `Configure Agent`; `Join Care Plan` | Static India/international price tables; payment/service implications | Defer pending G1 pricing, offer, tax, provider-cost, and payment decisions. |
| `ironwake_form_state_sheet_desktop` | `IronWake / Operational State Sheet` | Private Storybook/test route | `RETRY NOW`; `DOWNLOAD RECEIPT`; `VIEW STATUS` | Six sample controls; mock retry/receipt/status content | Private-only; preserve as redacted QA specification, never public navigation or implied provider completion. |
| `ironwake_home_desktop` | `IronWake / Engineering Lead Integrity` | `/` | `Request a Business Leak Audit`; `Explore demonstration systems` | Audit conversion; dashboard-style status values; SMS/email/booking/AI/provider claims | Keep positioning and CTA hierarchy, but rebuild responsively with approved truth labels only. |
| `ironwake_industries_index_desktop` | `Industries / IronWake` | `/industries` | `Start an Audit`; `View Booking Workflow`; `Business Leak Audit`; `Download Infrastructure Report` | Pending-email field; filters/download implication; unverified claims | Defer or merge until approved industries have original useful content and a monitored CTA. |
| `ironwake_insight_article_template_desktop` | `IronWake / A booking is not complete at form submit` | `/insights/[slug]` | No dedicated primary CTA | Static author/date/research, benchmark, and A/B-test claims | Private-only template until a real author, citations, review date, and approved claims exist. |
| `ironwake_insights_index_desktop` | `Insights / IronWake - Engineering-Editorial Publication` | `/insights` | `Start an Audit`; `Start with the leak audit` | Disabled email field; filters; unverified article/proof claims | Defer until approved original articles exist. |
| `ironwake_missed_lead_recovery_desktop` | `IronWake / Missed Lead Recovery` | `/systems/missed-lead-recovery` | `Start with a Business Leak Audit`; `Select Recovery`; `Select Control`; `Select Velocity` | Static prices; claimed SMS/email/CRM attribution | Rebuild with approved offers/prices and verified CRM/provider state. |
| `ironwake_premium_salons_and_spas_desktop` | `IronWake / Premium Salons & Spas` | `/industries/salons-spas` | `Map my booking experience`; `VIEW LIVE FLOW` | Claimed booking continuity, inventory/lab sync, and live flow | Defer pending original industry content and verified demonstration/provider labels. |
| `ironwake_privacy_and_terms_desktop` | `Privacy & Terms / IronWake` | `/privacy` and `/terms` | `Start an Audit` | Policy, retention, security, processor, and scope assertions | Defer; split into legal drafts pending real-entity, market, contact, and provider review. |
| `ironwake_process_desktop` | `IronWake / Process Architecture` | `/process` | No dedicated primary CTA | Founder, release, payment, and uptime assertions | Keep process structure after removing unapproved founder, contract, payment, and reliability claims. |
| `ironwake_systems_index_desktop` | `IronWake / Systems Index` | `/systems` | `ACCESS TOOL`; `View Architecture` | Implied selector, calendar sync, price, and provider-cost controls | Rebuild as approved guided choice architecture. |
| `ironwake_trust_lead_capture_desktop` | `IronWake / Trust + Lead Capture Systems` | `/systems/trust-lead-capture` | `Fix my lead path`; `Explore work`; `Deploy Recovery`; `Select Control`; `Achieve Velocity` | Email input; market toggle; implied CRM routing/attribution | Rebuild after approved form, CRM, consent, price, and security design. |
| `ironwake_work_index_desktop` | `Work / IronWake Precision Engineering` | `/work` | `Start an Audit`; `PUBLIC DEMO`; `VIEW STACK`; `EXPLORE ARCHITECTURE` | Static filters; pending-email field; public-demo/stack links and claims | Defer all project exposure until W01 proof gate passes. |

## Reconciliation Findings

1. The 404 screen is the only prototype surface with direct `/`, `/work`, `/systems`, and `/audit` links. Most prototype navigation and CTAs are `href="#"` or unobserved button actions.
2. Active navigation is inconsistent: the audit screen marks About active; three systems pages mark Work active; the insight article marks Work active; and the private form-state sheet appears in public prototype navigation.
3. The pricing prototype is a static India/international toggle, not the approved localized-route decision. All values remain quarantined.
4. The privacy/terms prototype combines two documents, while production requires separate reviewed `/privacy` and `/terms` routes.
5. Case-study screens present external Vercel demos and live/provider wording without P1/P3/P10 or remaining portfolio proof.
6. The audit-intake form has no evidenced action, persistence, validation contract, consent record, rate limit, or truthful acknowledgement state.

## Cross-Cutting Production Requirements

- Only two actual `<form>` elements exist: audit request and home-services. Ten screens contain controls. Rebuild conversion paths server-first with validation, consent, abuse controls, durable records, recovery, and safe errors.
- Do not ship live, real-time, confirmed, payment, delivery, or provider-backed states without authoritative provider evidence and durable commit. Use approved `DEMONSTRATION`, `PROVIDER PROOF PENDING`, or `AWAITING VERIFICATION` labels instead.
- Metrics, prices, legal terms, founder identity, provider costs, and operational claims remain quarantined pending the appropriate ledger and approval.
- The audit found 169 external URL occurrences and 38 Google Aida image references. Replace hotlinked assets and verify every external demo, social, and contact URL before public use.
- All screens use Tailwind CDN and inline scripts and are desktop-only. Rebuild as one responsive, accessible routed application with shared components and no prototype CDN dependency.
- Public website implementation remains gated on P1.5 portfolio proof and GS1 social foundation approval.

## Count Confirmation

`30/30` audited `*_desktop` screens are reconciled.
