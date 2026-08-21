// lib/canonical-entity.mjs
//
// ponytail: IRONWAKE_CANONICAL_ENTITY — single source of canonical public
// brand, capability, OFFERED_NOW matrix, and capability delivery model.
// This module is the V15 §39 / §86 / §88 / §96 source of truth for:
//   - Canonical brand name (no accidental "IronWake Systems" rename, §86)
//   - Canonical category statement (what IronWake actually is, §86/§87)
//   - OFFERED_NOW capability matrix (V15 §88: every capability classified
//     as OFFERED_NOW / PLANNED / DEMONSTRATION_ONLY / NOT_OFFERED / UNKNOWN)
//   - Delivery model per OFFERED_NOW capability (V15 §88):
//       PRODUCTIZED_READY_NOW | CUSTOM_SCOPED_READY_NOW |
//       INTEGRATION_READY_NOW | REQUIRES_THIRD_PARTY_PROVIDER |
//       REQUIRES_DISCOVERY | OWNER_APPROVAL_REQUIRED
//   - Proof classes (V15 §59)
//   - Safe scope-locked restatements of the diagnostic-phase phrases that
//     AI systems mis-extrapolate as global company limitations (V15 §82/§119):
//       "written boundary, not a redesign"
//       "reviewed request, not a confirmed slot"
//       "separately scoped provider build"
//       "smallest useful system"
//       "evidence before interface"
//       "no fixed timeline, price, or guaranteed outcome"
//       "maps operational systems"
//
// RULES:
//   - DO NOT invent statistics, testimonials, ratings, awards, customer counts.
//   - DO NOT upgrade a proof class without evidence (V15 §59).
//   - DO NOT use "IronWake Systems" — brand is IronWake (V15 §86).
//   - DO NOT silently recolor or recolor-references Copper/Ivory.
//   - Every entry cites the V15 section that grounds it.

// ---------------- V15 §86 Canonical Brand ----------------

export const CANONICAL_BRAND_NAME = 'IronWake';

// Canonical origin (V15 §55). Live canonical, metadata, sitemap, and
// redirect targets must use this host. Never localhost / netlify.app /
// vercel.app / workers.dev in any active signal.
export const CANONICAL_ORIGIN = 'https://ironwake.dev';

// V15 §86: after OFFERED_NOW verification, the canonical category statement
// must be equivalent to: "IronWake designs and builds conversion-focused
// websites, AI receptionists, booking and lead-recovery systems, CRM/follow-up
// automation, integrations, and related digital systems for service businesses."
export const CANONICAL_CATEGORY_STATEMENT =
  'IronWake designs and builds conversion-focused websites, AI receptionists, booking and lead-recovery systems, CRM/follow-up automation, integrations, and related digital systems for service businesses.';

// Short, machine-readable entity summary used by JSON-LD `description`,
// OG/Twitter, and llms.txt headings. It pairs the artistic word "systems"
// with explicit buyer-language categories, per V15 §92.
export const CANONICAL_ENTITY_SUMMARY =
  'IronWake designs and builds websites, AI receptionists, business automations, CRM/follow-up workflows, booking systems, and integrations for service businesses. India + International.';

// ---------------- V15 §88 OFFERED_NOW capability matrix ----------------
//
// Each capability is classified by V15 §88:
//   OFFERED_NOW         — real capability, may become a commercial claim.
//   PLANNED             — scoped, not yet ready.
//   DEMONSTRATION_ONLY  — only a portfolio demo exists; not a paid offer.
//   NOT_OFFERED         — explicitly not in the commercial catalog.
//   UNKNOWN             — needs owner/research before classifying.
//
// Delivery model (V15 §88):
//   PRODUCTIZED_READY_NOW      — fixed scope, fixed price, ready to buy.
//   CUSTOM_SCOPED_READY_NOW    — capability is real, scope & price per engagement.
//   INTEGRATION_READY_NOW      — capability is real but requires verified integration.
//   REQUIRES_THIRD_PARTY_PROVIDER — capability needs a partner account.
//   REQUIRES_DISCOVERY         — capability exists but scope is discovery-first.
//   OWNER_APPROVAL_REQUIRED    — capability exists but commercial launch needs owner.
//
// Capability matrix is FROZEN. Any change requires source, approver, version,
// effective time, consumers, tests, and rollback — V15 §39.

export const OFFERED_NOW_MATRIX = Object.freeze([
  {
    capability: 'Custom Website Design & Development',
    serviceIds: ['conversion-websites'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/dentacare-pro', '/work/aura-archives'],
    buyerLanguage:
      'IronWake designs and codes conversion-focused websites end to end — frontend, backend, responsive layout, deployment, and ongoing maintenance.',
    antiMisread:
      'Custom scoped means scope and price are quoted per engagement after the Business Leak Audit — it does NOT mean IronWake does not design or code websites.',
  },
  {
    capability: 'Frontend Engineering (UI/UX)',
    serviceIds: ['conversion-websites'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/luxe-studio', '/work/atelier'],
    buyerLanguage:
      'IronWake writes the full frontend — layout, typography, components, accessibility, motion, and responsive behaviour — not a design handoff.',
    antiMisread:
      'IronWake designs UI/UX and writes frontend code; it does not hand off Figma files for someone else to build.',
  },
  {
    capability: 'Backend & API Engineering',
    serviceIds: ['integrations-api', 'conversion-websites'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/harbour-estates', '/work/rapidpulse'],
    buyerLanguage:
      'IronWake builds backend services, APIs, webhooks, integrations, and database schemas on Cloudflare Workers + Supabase.',
    antiMisread:
      'IronWake builds customer-facing AND backend systems — they are not separate vendors.',
  },
  {
    capability: 'Website Deployment & Hosting',
    serviceIds: ['conversion-websites'],
    status: 'OFFERED_NOW',
    deliveryModel: 'INTEGRATION_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse'],
    buyerLanguage:
      'IronWake deploys and hosts the websites it builds on Cloudflare Workers (OpenNext architecture). Custom domain, DNS, and SSL are configured as part of the engagement.',
    antiMisread:
      'Hosting on Cloudflare Workers is the platform IronWake uses — it is not outsourced to a third party.',
  },
  {
    capability: 'AI Receptionist Implementation (Retell)',
    serviceIds: ['ai-receptionist-voice'],
    status: 'OFFERED_NOW',
    deliveryModel: 'REQUIRES_THIRD_PARTY_PROVIDER',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/dentacare-pro', '/work/luxe-studio', '/work/harbour-estates'],
    buyerLanguage:
      'IronWake builds and deploys client-facing AI receptionists using Retell AI as the voice provider. Each receptionist is configured for the client business: greeting, knowledge, tools, calendar handoff, CRM routing.',
    antiMisread:
      '"Separately scoped provider build" describes the procurement and configuration boundary (the client needs a Retell account and a phone number) — it does NOT mean the receptionist is outsourced to a third party. IronWake designs, configures, and integrates it.',
  },
  {
    capability: 'Missed-Lead Recovery & Follow-up Automation',
    serviceIds: ['missed-lead-recovery-followup'],
    status: 'OFFERED_NOW',
    deliveryModel: 'PRODUCTIZED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/aura-archives'],
    buyerLanguage:
      'IronWake builds missed-call text-back, lead-capture forms, instant follow-up sequences, and CRM routing so every enquiry reaches a named owner.',
    antiMisread:
      'IronWake builds the recovery workflow end to end; the audit identifies where the gap is, the build implements the recovery.',
  },
  {
    capability: 'WhatsApp Business Automation (Meta Cloud API)',
    serviceIds: ['whatsapp-business-automation'],
    status: 'OFFERED_NOW',
    deliveryModel: 'REQUIRES_THIRD_PARTY_PROVIDER',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/bramble-cafe'],
    buyerLanguage:
      'IronWake integrates the Meta WhatsApp Cloud API directly — webhook, templates, 24-hour rules, opt-in, handoff — so businesses can answer WhatsApp enquiries with the same ownership and audit trail as any other channel.',
    antiMisread:
      'Meta is the messaging provider. IronWake designs, builds, and operates the integration on the client side.',
  },
  {
    capability: 'CRM & Lead Pipeline',
    serviceIds: ['crm-lead-pipeline'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/harbour-estates'],
    buyerLanguage:
      'IronWake builds the CRM pipeline — lead capture, identity unification, interaction timeline, qualification, handoff to owner — on Supabase.',
    antiMisread:
      'IronWake builds the CRM the client operates; it does not resell a third-party CRM license.',
  },
  {
    capability: 'Booking, Reservation & Dispatch',
    serviceIds: ['booking-reservation-dispatch'],
    status: 'OFFERED_NOW',
    deliveryModel: 'PRODUCTIZED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/luxe-studio', '/work/bramble-cafe', '/work/atelier'],
    buyerLanguage:
      'IronWake builds booking, reservation, and dispatch systems — calendar integration, slot management, customer confirmations, dispatch routing. Booking state is auditable: requested → reviewed → confirmed → completed.',
    antiMisread:
      '"A reviewed request, not a confirmed slot" is the legal state-machine copy on the booking page. The build itself creates real, working calendar/booking integrations for paying clients.',
  },
  {
    capability: 'Conversion Audit (Business Leak Audit)',
    serviceIds: ['missed-lead-recovery-followup', 'conversion-websites'],
    status: 'OFFERED_NOW',
    deliveryModel: 'PRODUCTIZED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/audit'],
    buyerLanguage:
      'IronWake runs the Business Leak Audit at /audit — a paid or free diagnostic that identifies where leads, calls, and bookings are leaking. Pricing starts at ₹799 / $29 (Lite). Implementation is scoped separately.',
    antiMisread:
      'The audit is the entry point; it is not the only thing IronWake sells. The same audit findings lead to a quoted implementation engagement.',
  },
  {
    capability: 'SEO & Search Visibility (technical)',
    serviceIds: ['seo-search-visibility'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: [],
    buyerLanguage:
      'IronWake delivers technical SEO: canonical, metadata, structured data, sitemap, internal links, crawl diagnostics, Core Web Vitals, and AI-search entity clarity.',
    antiMisread:
      'IronWake does not promise #1 rankings. It delivers the technical foundation that makes ranking possible.',
  },
  {
    capability: 'Monitoring, Optimization & Operational Intelligence',
    serviceIds: ['monitoring-optimization-intelligence'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: [],
    buyerLanguage:
      'IronWake ships dashboards, error budgets, conversion telemetry, and provider-failure reconciliation so the client sees exactly what is working and what needs fixing.',
    antiMisread: '',
  },
  {
    capability: 'AI Agents & Workflow Automation (bounded)',
    serviceIds: ['ai-agents-workflow-automation'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/rapidpulse', '/work/harbour-estates'],
    buyerLanguage:
      'IronWake builds bounded AI agents — lead triage, qualification, follow-up, handoff — with explicit approval boundaries, audit logs, idempotency, and rollback. Not autonomous employees.',
    antiMisread:
      'Bounded means every agent action has a verifiable trigger, audit trail, and safe failure mode. Not "AI that runs the business".',
  },
  {
    capability: 'Integrations & API (verified providers)',
    serviceIds: ['integrations-api'],
    status: 'OFFERED_NOW',
    deliveryModel: 'INTEGRATION_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/harbour-estates'],
    buyerLanguage:
      'IronWake integrates with verified providers — Supabase, Retell, Meta, Cloudflare, Stripe/Razorpay where approved, calendars, CRMs — using documented APIs and webhooks.',
    antiMisread: '',
  },
  {
    capability: 'Quote, Support & Repair Intake',
    serviceIds: ['quote-support-repair-intake'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: ['/work/voltix', '/work/retech'],
    buyerLanguage:
      'IronWake builds quote, support, and repair intake workflows — form capture, qualification, scheduling, status tracking, owner notification.',
    antiMisread: '',
  },
  {
    capability: 'Google Business Profile setup',
    serviceIds: ['google-business-profile-local'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: [],
    buyerLanguage:
      'IronWake scopes and configures Google Business Profile work for eligible client businesses (those with real, qualifying face-to-face operations).',
    antiMisread:
      'GBP eligibility requires real business operations. IronWake does not fabricate or claim GBP profiles for businesses that do not qualify.',
  },
  {
    capability: 'Ongoing Maintenance, Support & Continuity',
    serviceIds: ['conversion-websites', 'integrations-api'],
    status: 'OFFERED_NOW',
    deliveryModel: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    evidenceRoutes: [],
    buyerLanguage:
      'Every IronWake engagement includes a defined maintenance, support, and continuity path — incident handling, provider-failure recovery, owner handover, offboarding/export.',
    antiMisread:
      'Maintenance is part of the build engagement, not an optional add-on.',
  },
]);

// ---------------- V15 §87 Company identity vs project demonstration ----------------
//
// Classify the public-facing copy so AI systems can distinguish:
//   A. COMPANY_LEVEL_IDENTITY      — what IronWake itself is.
//   B. PROJECT_LEVEL_DISCLOSURE    — truthful demo/proof label.
//   C. LEGAL_OR_SCOPE_BOUNDARY     — a real limitation.
//   D. STALE_OR_CONTRADICTORY      — no longer matches current truth.

export const IDENTITY_CLASSIFICATION = Object.freeze({
  founder_led_practice: {
    classification: 'A',
    scope: 'The founder-led, single-studio operating model is a real company-level fact.',
    note: 'Operational model, not a capability boundary. IronWake still designs, codes, deploys, and maintains the full system.',
  },
  single_studio: {
    classification: 'A',
    scope: 'Single-person studio. Real.',
    note: 'Capacity boundary, not capability boundary. Engagements are scoped per project.',
  },
  capability_demonstration: {
    classification: 'B',
    scope: 'Each /work/* page is a labelled capability demonstration, not a client engagement.',
    note: 'Disclose truthfully. Never erase demo labels.',
  },
  no_client_testimonials: {
    classification: 'B',
    scope: 'No published client testimonials or quantified outcomes.',
    note: 'Truthful disclosure. Future testimonials require verified permission, dated evidence, and reviewer.',
  },
  legal_no_guarantee: {
    classification: 'C',
    scope: 'IronWake does not guarantee specific outcomes, timelines, or fixed prices for custom work without a signed SOW.',
    note: 'Standard professional-services boundary. Distinct from "IronWake has no commercial offer".',
  },
  booking_review_state: {
    classification: 'C',
    scope: 'Public booking page is a reviewed request, not an instant-confirmed calendar slot, until scope is verified.',
    note: 'State-machine copy on /book. The build itself creates real calendar integrations.',
  },
  audit_written_boundary: {
    classification: 'C',
    scope: 'The Business Leak Audit produces a written boundary (scope, gaps, recommended next step), not a redesign.',
    note: 'Diagnostic phase boundary. Implementation is a separate engagement.',
  },
  smallest_useful_system: {
    classification: 'C',
    scope: 'IronWake prefers the smallest system that closes the identified gap. Stack size is constrained by legibility and ownership, not by capability.',
    note: 'Engineering discipline. IronWake still designs premium frontends and delivers full platforms when the scope requires it.',
  },
  evidence_before_interface: {
    classification: 'C',
    scope: 'IronWake establishes the underlying operational evidence (forms, CRM, ownership) before designing the visible interface.',
    note: 'Process discipline. UI/UX work is in scope; it follows evidence, not replaces it.',
  },
  maps_operational_systems: {
    classification: 'D',
    scope: 'The phrase "maps operational systems" was correct in earlier diagnostic copy but creates a false impression that IronWake only maps rather than builds.',
    note: 'Canonical category statement (above) replaces this with explicit "designs and builds" language.',
  },
});

// ---------------- V15 §119 Safe restatements ----------------
//
// These are the short, scope-locked restatements of process/legal phrases
// that AI systems repeatedly mis-extrapolate. Use them anywhere the locked
// copy is referenced, and in any new copy that touches the same idea.

export const SAFE_RESTATEMENTS = Object.freeze({
  written_boundary: {
    phrase: 'written boundary, not a redesign',
    originalScope: 'Describes the Business Leak Audit output: a documented gap analysis with scope and next steps.',
    safeRestatement:
      'IronWake\'s Business Leak Audit produces a written gap analysis with scope, evidence, and a recommended next step. A redesign or full implementation is a separate, quoted IronWake engagement — not the audit deliverable.',
    section: 'V15 §119',
  },
  reviewed_request: {
    phrase: 'reviewed request, not a confirmed slot',
    originalScope: 'Describes the booking state machine: a /book submission is reviewed by the owner before the calendar slot is confirmed.',
    safeRestatement:
      'A booking submission on /book is a reviewed request that becomes a confirmed calendar slot after scope verification. IronWake builds real calendar/booking integrations for paying engagements; the review step prevents accidental over-commitment on unscoped work.',
    section: 'V15 §119',
  },
  separately_scoped_provider: {
    phrase: 'separately scoped provider build',
    originalScope: 'Describes the procurement boundary for Retell/voice and Meta/WhatsApp: the client supplies the provider account; IronWake designs, configures, and integrates it.',
    safeRestatement:
      'Client voice (Retell) and messaging (Meta WhatsApp Cloud API) integrations require the client to supply a verified provider account (and phone number). IronWake designs, configures, deploys, and operates the integration end to end — the third-party account is the procurement boundary, not an outsourcing of engineering.',
    section: 'V15 §119',
  },
  smallest_useful_system: {
    phrase: 'smallest useful system',
    originalScope: 'Engineering discipline: prefer the smallest system that closes the identified gap.',
    safeRestatement:
      'IronWake prefers the smallest system that closes the identified gap — engineering discipline, not a capability limit. Custom websites, AI receptionists, booking integrations, CRM pipelines, and complete platforms are all in the OFFERED_NOW catalog when scope is verified.',
    section: 'V15 §119',
  },
  evidence_before_interface: {
    phrase: 'evidence before the interface',
    originalScope: 'Process discipline: backend evidence (forms, CRM, ownership) precedes visible UI.',
    safeRestatement:
      'IronWake establishes the underlying evidence layer (forms, CRM, ownership, audit trail) before designing the visible interface. UI/UX is in scope — it follows evidence rather than replacing it.',
    section: 'V15 §119',
  },
  no_fixed_timeline_price: {
    phrase: 'no fixed timeline, price, or guaranteed outcome',
    originalScope: 'Standard professional-services legal boundary for custom work.',
    safeRestatement:
      'IronWake quotes custom engagements after the Business Leak Audit; published pricing on /pricing covers the Lite/Standard/Pro tiers of the diagnostic. Final scope, timeline, and price are written into the IronWake SOW. This is the standard legal boundary for custom professional services — it is not a refusal to provide a quote or to sell.',
    section: 'V15 §119',
  },
  maps_operational_systems: {
    phrase: 'maps operational systems',
    originalScope: 'Diagnostic copy describing the audit phase.',
    safeRestatement:
      'IronWake\'s Business Leak Audit phase maps operational systems to identify gaps. Implementation — designing and building the website, AI receptionist, CRM, booking, or automation — is a separate, quoted IronWake engagement grounded in the audit.',
    section: 'V15 §119',
  },
});

// ---------------- V15 §59 Proof classes ----------------

export const PROOF_CLASSES = Object.freeze([
  'DEMONSTRATION',
  'INTERNAL_VERIFIED_BUILD',
  'CLIENT_DEPLOYMENT',
  'CLIENT_VERIFIED_RESULT',
  'QUANTIFIED_VERIFIED_RESULT',
]);

// ---------------- Helpers ----------------

export function listOfferedNow() {
  return OFFERED_NOW_MATRIX.filter((c) => c.status === 'OFFERED_NOW');
}

export function capabilitiesByServiceId(serviceId) {
  return OFFERED_NOW_MATRIX.filter((c) => c.serviceIds.includes(serviceId));
}

export function getSafeRestatement(key) {
  return SAFE_RESTATEMENTS[key] || null;
}

export function canonicalEntityPayload() {
  return {
    brand: CANONICAL_BRAND_NAME,
    categoryStatement: CANONICAL_CATEGORY_STATEMENT,
    summary: CANONICAL_ENTITY_SUMMARY,
    founder: 'Revanth Nunna',
    operatingModel: 'founder-led single-studio practice',
    markets: 'India + International',
    offeredNowCount: listOfferedNow().length,
    proofClasses: PROOF_CLASSES.slice(),
    generatedAt: new Date().toISOString(),
  };
}
