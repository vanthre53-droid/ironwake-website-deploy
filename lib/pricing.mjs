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
    recommended: 'Pro'
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
