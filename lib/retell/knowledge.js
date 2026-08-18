// ponytail: canonical knowledge block for the Retell AI receptionist.
//
// This file does NOT duplicate pricing, portfolio, or industry data. It
// composes a voice-channel-friendly knowledge string from the canonical
// IronWake data layer:
//
//   - PRICING_OFFERS, PRICING_TIERS, PRICE_REGIONS  ← lib/pricing.mjs
//   - Portfolio demonstrations (names, industries, tags, URLs) ← app/work/page.js
//   - Industries we publish guides for                   ← app/industries/page.js
//   - The same truth rules the chat assistant operates under ← lib/ai-chat.mjs
//
// Single source of truth: any change to PRICING_OFFERS, /work, or
// /industries flows through automatically on next buildKnowledgeBlock().

import { createHash } from 'node:crypto';

import { PRICING_OFFERS, PRICE_REGIONS, PRICING_TIERS } from '../pricing.mjs';

// ponytail: portfolio list — mirror of app/work/page.js. Kept here as a
// frozen constant rather than imported from a JSX module so the serverless
// knowledge builder stays JS-only and dependency-light. Any drift between
// this list and /work should be treated as a regression in this file.
export const PORTFOLIO = Object.freeze([
  Object.freeze({ id: 'rapidpulse', name: 'RapidPulse Response', industry: 'Emergency Services', tag: 'Inquiry-to-response ownership', url: 'https://rapidpulse-plumbing.vercel.app', caseHref: '/work/rapidpulse' }),
  Object.freeze({ id: 'harbour', name: 'Harbour Estates', industry: 'Real Estate', tag: 'Property inquiry routing', url: 'https://bristol-architectural.vercel.app', caseHref: '/work/harbour-estates' }),
  Object.freeze({ id: 'dentacare', name: 'DentaCare Pro', industry: 'Dental Clinics', tag: 'Front-desk intake flow', url: 'https://manchester-gentle-dental.vercel.app', caseHref: '/work/dentacare-pro' }),
  Object.freeze({ id: 'aura', name: 'Aura Archives', industry: 'Luxury Retail', tag: 'Bespoke inquiry capture', url: 'https://bluestone-jewellery-prototype.vercel.app', caseHref: '/work/aura-archives' }),
  Object.freeze({ id: 'luxe', name: 'Luxe Studio', industry: 'Wine and Spirits', tag: 'Booking and studio system', url: 'https://luxe-studio-wine.vercel.app', caseHref: '/work/luxe-studio' }),
  Object.freeze({ id: 'bramble', name: 'Bramble Cafe', industry: 'Hospitality', tag: 'Reservation and catering', url: 'https://bramble-cafe.vercel.app', caseHref: '/work/bramble-cafe' }),
  Object.freeze({ id: 'voltix', name: 'Voltix', industry: 'Electronics', tag: 'Quote and support capture', url: 'https://voltix-fawn.vercel.app', caseHref: '/work/voltix' }),
  Object.freeze({ id: 'retech', name: 'RE-TECH', industry: 'Technology', tag: 'Service request capture', url: 'https://re-tech-umber.vercel.app', caseHref: '/work/retech' }),
  Object.freeze({ id: 'atelier', name: 'Atelier Safe', industry: 'Salons and Spas', tag: 'Consultation follow-up ownership', url: 'https://atelier-luxury-salon.vercel.app', caseHref: '/work/atelier' })
]);

// ponytail: industries — mirror of app/industries/page.js.
export const INDUSTRIES = Object.freeze([
  Object.freeze({ slug: 'home-services', label: 'Home Services', tag: 'dispatch-adjacent', summary: 'For teams where a missed call during an active job can lose the next job.' }),
  Object.freeze({ slug: 'dental-clinics', label: 'Dental and Private Clinics', tag: 'front desk', summary: 'For clinics balancing phone, walk-in, and online requests without dropping any of them.' }),
  Object.freeze({ slug: 'salons-spas', label: 'Salons and Spas', tag: 'consultation-led', summary: 'For consultation-led businesses where follow-up after the first enquiry decides the booking.' })
]);

function priceSpeak(rupeesString) {
  // ₹2,200 → "two thousand two hundred rupees"
  const digits = rupeesString.replace(/[^0-9]/g, '');
  if (!digits) return rupeesString;
  const n = Number(digits);
  return `${numberToWords(n)} rupees`;
}

function dollarsSpeak(dollarsString) {
  const digits = dollarsString.replace(/[^0-9]/g, '');
  if (!digits) return dollarsString;
  const n = Number(digits);
  return `${numberToWords(n)} US dollars`;
}

function numberToWords(n) {
  if (!Number.isFinite(n) || n < 0) return String(n);
  if (n === 0) return 'zero';
  if (n < 100) {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if (n < 20) return units[n];
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u ? `${tens[t]} ${units[u]}` : tens[t];
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return r ? `${unitsSmall(h)} hundred ${numberToWords(r)}` : `${unitsSmall(h)} hundred`;
  }
  if (n < 100000) {
    const k = Math.floor(n / 1000);
    const r = n % 1000;
    return r ? `${numberToWords(k)} thousand ${numberToWords(r)}` : `${numberToWords(k)} thousand`;
  }
  if (n < 10000000) {
    const lakh = Math.floor(n / 100000);
    const r = n % 100000;
    return r ? `${numberToWords(lakh)} lakh ${numberToWords(r)}` : `${numberToWords(lakh)} lakh`;
  }
  return String(n);
}

function unitsSmall(n) {
  return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n] || String(n);
}

// ponytail: voice-friendly tier summary. Voice channel cannot read tables —
// emit "from rupees X" and "from X US dollars" per offer, plus the canonical
// three-tier ladder for orientation.
export function buildVoicePricingBlock() {
  const lines = [];
  lines.push(`IronWake has five published offers. Each has three tiers — ${PRICING_TIERS.join(', ')}.`);
  lines.push('Pricing is separate for India and International clients. Provider, domain and usage charges are billed separately from the setup prices.');
  lines.push('');
  for (const offer of PRICING_OFFERS) {
    const indiaLite = offer.india[0];
    const intlLite = offer.intl[0];
    lines.push(`${offer.name} — India from ${priceSpeak(indiaLite)}, International from ${dollarsSpeak(intlLite)}. ${offer.description} Recommended tier: ${offer.recommended}.`);
  }
  lines.push('');
  lines.push(`Every engagement starts with a Business Leak Audit. Audit pricing: India from ${priceSpeak(PRICING_OFFERS[0].india[0])}, International from ${dollarsSpeak(PRICING_OFFERS[0].intl[0])}.`);
  lines.push(`Active pricing regions: ${Object.values(PRICE_REGIONS).join(', ')}.`);
  return lines.join('\n');
}

export function buildVoicePortfolioBlock() {
  const lines = [];
  lines.push('Portfolio demonstrations on the /work page — capability proofs, not client engagements or measured outcomes.');
  for (const p of PORTFOLIO) {
    lines.push(`${p.name} — ${p.industry}, ${p.tag}.`);
  }
  lines.push('Names such as Harbour Estates, Aura Archives and BlueStone are fictional themes mapped to prototype URLs. The underlying build is the demonstration.');
  return lines.join('\n');
}

export function buildVoiceIndustriesBlock() {
  const lines = [];
  lines.push('Industries IronWake publishes guides for:');
  for (const ind of INDUSTRIES) {
    lines.push(`${ind.label} — ${ind.summary}`);
  }
  lines.push('An industry page describes how existing systems apply to that industry. It does not claim a client roster, service area, certification, or result specific to that industry.');
  return lines.join('\n');
}

export function buildKnowledgeBlock() {
  return [
    'IRONWAKE (canonical voice-channel summary)',
    'IronWake is a founder-led agency that builds operational systems — enquiry, booking, follow-up, ownership — for service businesses.',
    '',
    'PRICING (India + International, three tiers each)',
    buildVoicePricingBlock(),
    '',
    'PORTFOLIO',
    buildVoicePortfolioBlock(),
    '',
    'INDUSTRIES',
    buildVoiceIndustriesBlock(),
    '',
    'TRUTH RULES',
    '- Never invent numbers, outcomes, testimonials, years in business, client rosters, certifications, or guaranteed improvements.',
    '- /work items are capability proofs — not client engagements or measured outcomes.',
    '- No automated payment is taken on the website. Proposals and contracts are accepted separately.',
    '- If asked something the published knowledge does not cover (legal, tax, refund, custom pricing, urgent or sensitive), set needs_human=true and route to the owner.',
    '- Next steps: Audit form at /audit (consent checkbox required), booking flow at /book, owner handoff via the customer escalation path.'
  ].join('\n');
}

export function knowledgeFingerprint() {
  // ponytail: stable fingerprint used by scripts/retell-push.mjs for
  // idempotent pushes. Two knowledge blocks with identical canonical sources
  // must produce the same fingerprint; any change to PRICING_OFFERS, the
  // PORTFOLIO list, or INDUSTRIES flows through here.
  const payload = JSON.stringify({
    pricing: PRICING_OFFERS,
    regions: PRICE_REGIONS,
    tiers: PRICING_TIERS,
    portfolio: PORTFOLIO,
    industries: INDUSTRIES
  });
  return createHash('sha256').update(payload).digest('hex').slice(0, 16);
}