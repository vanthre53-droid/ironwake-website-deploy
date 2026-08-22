export const PRICE_REGIONS = Object.freeze({
  india: 'India',
  intl: 'International'
});

export const PRICING_TIERS = Object.freeze(['Lite', 'Standard', 'Pro']);

// Approved offer names, descriptions, tiers, and amounts live here. Public
// surfaces may format these values, but must not maintain their own prices.
export const PRICING_OFFERS = Object.freeze([
  Object.freeze({
    id: 'business-leak-audit',
    name: 'Business Leak Audit',
    description: 'Written review identifying where your enquiry, booking, or follow-up process loses momentum.',
    cta: 'Book Diagnostic',
    india: Object.freeze(['₹799', '₹1,499', '₹2,999']),
    intl: Object.freeze(['$29', '$59', '$99']),
    recommended: 'Standard'
  }),
  Object.freeze({
    id: 'missed-lead-recovery',
    name: 'Missed Lead Recovery Setup',
    description: 'Automated missed-call callback, instant email notifications, lead logging — no enquiry silently lost.',
    cta: 'Deploy System',
    india: Object.freeze(['₹2,200', '₹3,500', '₹5,999']),
    intl: Object.freeze(['$99', '$149', '$249']),
    recommended: 'Standard'
  }),
  Object.freeze({
    id: 'booking-control',
    name: 'Booking Certainty Starter',
    description: 'Separate booking requests from confirmed appointments. CRM, scheduling engine, lead nurture flows.',
    cta: 'Select System',
    india: Object.freeze(['₹12,999', '₹24,999', '₹39,999']),
    intl: Object.freeze(['$199', '$399', '$699']),
    recommended: 'Pro',
    // ponytail: single "MOST POPULAR" treatment per Dialzara pattern — exactly
    // one offer carries the top-of-card badge. The per-tier "Recommended" tag
    // is a separate concept and remains on every offer's recommended tier row.
    popular: true
  }),
  Object.freeze({
    id: 'trust-lead-capture',
    name: 'Trust + Lead Capture Starter',
    description: 'Conversion-optimised service website with trust signals, lead capture, and owner attribution.',
    cta: 'Build Architecture',
    india: Object.freeze(['₹12,999', '₹18,999', '₹24,999']),
    intl: Object.freeze(['$499', '$899', '$1,499']),
    recommended: 'Standard'
  }),
  Object.freeze({
    id: 'ai-receptionist',
    name: 'AI Receptionist Starter',
    description: '24/7 automated WhatsApp/Web AI agent trained on your specific business knowledge base.',
    cta: 'Configure Agent',
    india: Object.freeze(['₹29,999', '₹49,999', '₹79,999']),
    intl: Object.freeze(['$1,000', '$1,800', '$3,000']),
    recommended: 'Pro'
  }),
  // ─────────────────────────────────────────────────────────────────────────────
  // NEW OFFERS — added 2026-08-22 per owner directive. Existing 5 above are
  // untouched (byte-stable). Schema follows the existing pattern: `india`
  // is INR Lite→Standard→Pro, `intl` is USD same. See
  // evidence/pricing-research-2026-08-22.md for sources and reasoning.
  // Classification: each new offer ships with `deliveryClass` so chat/Retell
  // /schema can quote the right procurement lane honestly.
  // ─────────────────────────────────────────────────────────────────────────────
  Object.freeze({
    id: 'whatsapp-business-automation',
    name: 'WhatsApp Business Automation',
    description: 'Meta WhatsApp Cloud API setup, template approval, webhook, inbox + CRM sync, opt-in flows, escalation.',
    cta: 'Connect Number',
    india: Object.freeze(['₹14,999', '₹24,999', '₹39,999']),
    intl: Object.freeze(['$549', '$899', '$1,499']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW',
    proofClass: 'INTERNAL_VERIFIED_BUILD'
  }),
  Object.freeze({
    id: 'monitoring-optimization-intelligence',
    name: 'Monitoring & Operational Intelligence',
    description: 'Live dashboards, alerting, weekly review, anomaly detection. Built on top of the systems we ship.',
    cta: 'Enable Monitoring',
    india: Object.freeze(['₹6,999/mo', '₹14,999/mo', '₹29,999/mo']),
    intl: Object.freeze(['$279/mo', '$549/mo', '$999/mo']),
    recommended: 'Standard',
    deliveryClass: 'PRODUCTIZED_READY_NOW',
    recurring: true
  }),
  Object.freeze({
    id: 'integrations-api',
    name: 'Integrations & API',
    description: 'Connect your CRM, payments, calendar, WhatsApp, voice, ERP, and spreadsheets through a secure, observable API layer.',
    cta: 'Plan Integration',
    india: Object.freeze(['₹9,999', '₹24,999', '₹59,999']),
    intl: Object.freeze(['$399', '$899', '$2,199']),
    recommended: 'Standard',
    deliveryClass: 'INTEGRATION_READY_NOW'
  }),
  Object.freeze({
    id: 'quote-support-repair-intake',
    name: 'Quote, Support & Repair Intake',
    description: 'Structured customer intake for quotes, support tickets, and repair jobs — automated triage, confirmation, and routing.',
    cta: 'Design Intake',
    india: Object.freeze(['₹19,999', '₹34,999', '₹59,999']),
    intl: Object.freeze(['$749', '$1,299', '$2,199']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW'
  }),
  Object.freeze({
    id: 'ai-agents-workflow-automation',
    name: 'AI Agents & Workflow Automation',
    description: 'Multi-step AI automations across your stack — qualification, follow-up, summarisation, ticket routing, approvals.',
    cta: 'Map Workflows',
    india: Object.freeze(['₹24,999', '₹49,999', '₹99,999']),
    intl: Object.freeze(['$899', '$1,899', '$3,999']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW'
  }),
  Object.freeze({
    id: 'seo-search-visibility-pro',
    name: 'SEO & Search Visibility (Pro)',
    description: 'Continuous technical SEO, content briefs, schema, internal linking, AI-search readiness — measurable wins, not promises.',
    cta: 'Start SEO',
    india: Object.freeze(['₹14,999', '₹29,999', '₹59,999']),
    intl: Object.freeze(['$549', '$1,099', '$2,199']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW',
    recurring: true
  }),
  Object.freeze({
    id: 'crm-lead-pipeline-pro',
    name: 'CRM & Lead Pipeline (Pro)',
    description: 'Pipelines, lead scoring, automation, multi-channel follow-up, dashboards, attribution. Built on Supabase + Make/n8n.',
    cta: 'Design Pipeline',
    india: Object.freeze(['₹24,999', '₹49,999', '₹99,999']),
    intl: Object.freeze(['$899', '$1,899', '$3,799']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW'
  }),
  Object.freeze({
    id: 'custom-conversion-website',
    name: 'Custom Conversion Website',
    description: 'Apple-grade, hand-designed, hand-coded service-website built for outcomes (leads, bookings, calls). SSR, perf, a11y, schema, on-page SEO. Owner owns all code.',
    cta: 'Brief Your Site',
    india: Object.freeze(['₹39,999', '₹99,999', '₹2,49,999']),
    intl: Object.freeze(['$1,499', '$3,499', '$7,999']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW'
  }),
  Object.freeze({
    id: 'custom-saas-app',
    name: 'Custom SaaS / App Build',
    description: 'Custom web app, dashboard, internal tool, or two-sided marketplace. Discovery → MVP → paid milestones → full ownership transfer.',
    cta: 'Discuss MVP',
    india: Object.freeze(['₹1,99,999', '₹4,99,999', '₹12,99,999']),
    intl: Object.freeze(['$7,999', '$19,999', '$49,999']),
    recommended: 'Standard',
    deliveryClass: 'CUSTOM_SCOPED_READY_NOW',
    highTicket: true
  }),
  Object.freeze({
    id: 'app-idea-collab',
    name: 'App Idea — Collab / Equity',
    description: 'Bring an idea. If the plan is good, we build it together — milestone-based with success fee + equity on acceptance. Custom SOW, owner-led approvals.',
    cta: 'Pitch the Idea',
    india: Object.freeze(['By deal', 'By deal', 'By deal']),
    intl: Object.freeze(['By deal', 'By deal', 'By deal']),
    recommended: 'Standard',
    deliveryClass: 'OWNER_APPROVAL_REQUIRED',
    highTicket: true,
    pricingNote: 'Quoted per SOW; includes milestone fee + equity %.'
  })
]);

export const PRICING_BY_ID = Object.freeze(Object.fromEntries(PRICING_OFFERS.map((offer) => [offer.id, offer])));

export function getPricingOffer(offerId) {
  return PRICING_BY_ID[offerId] || null;
}

export function litePrice(offerId, region) {
  const offer = getPricingOffer(offerId);
  if (!offer || !PRICE_REGIONS[region]) return null;
  return offer[region][0];
}

export function dualLitePrice(offerId, separator = ' / ') {
  const india = litePrice(offerId, 'india');
  const intl = litePrice(offerId, 'intl');
  return india && intl ? `${india}${separator}${intl}` : null;
}

export function litePriceSummary() {
  return PRICING_OFFERS.map((offer) => `${offer.name} from ${dualLitePrice(offer.id, '/')}`).join('. ');
}
