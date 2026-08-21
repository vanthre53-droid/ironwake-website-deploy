// lib/truth-registry.mjs
//
// ponytail: IRONWAKE_CANONICAL_TRUTH — single source of canonical IronWake
// service truth, grounded in real existing /systems, /work, /industries routes
// from lib/routes.mjs. This file is the V14 §24 / §39 "canonical business truth
// layer" — additive, do not delete existing content, do not invent routes.
//
// ANTI-FABRICATION RULES (V14 §3, §10, §59):
//   - Every serviceId maps to ZERO OR MORE real existing route paths.
//   - No fabricated statistics, testimonials, ratings, awards, customer counts.
//   - No invented routes. If a service has no real route, routePaths = [].
//   - proofClass is one of: DEMONSTRATION | INTERNAL_VERIFIED_BUILD |
//                            CLIENT_DEPLOYMENT | CLIENT_VERIFIED_RESULT |
//                            QUANTIFIED_VERIFIED_RESULT.
//   - supportStatus reflects real capability. Do not claim things that aren't shipped.
//
// PROOF CLASSIFICATION (V14 §59):
//   - DEMONSTRATION            = a portfolio page on ironwake.dev only
//   - INTERNAL_VERIFIED_BUILD  = built and self-tested inside IronWake systems
//   - CLIENT_DEPLOYMENT        = known to be live for a paying client (speak to owner)
//   - CLIENT_VERIFIED_RESULT   = measured outcome (owner only, never claimed in copy)
//   - QUANTIFIED_VERIFIED_RESULT = owner-only evidence; never copied into marketing copy

import { ROUTES } from './routes.mjs';

// ---------- helpers ----------

function findRoute(path) {
  return ROUTES.find((r) => r.path === path) || null;
}

function routeExists(path) {
  return Boolean(findRoute(path));
}

// ---------- V14 §24 12-service catalog ----------

export const SERVICE_CATALOG = Object.freeze([
  {
    id: 'ai-receptionist-voice',
    name: 'AI Receptionist & Voice',
    routePaths: ['/systems/ai-receptionist', '/systems/trust-lead-capture'],
    primaryRoute: '/systems/ai-receptionist',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/dentacare-pro', '/work/luxe-studio', '/work/harbour-estates'],
    industries: ['/industries/dental-clinics', '/industries/salons-spas', '/industries/home-services'],
    handoffRoutes: ['/audit', '/book'],
    supportStatus: 'live',
    notes: 'Voice receptionist demo work pages exist on /work. Retell is the sole active voice provider.',
  },
  {
    id: 'ai-agents-workflow-automation',
    name: 'AI Agents & Workflow Automation',
    routePaths: ['/systems/missed-lead-recovery', '/systems/booking-control'],
    primaryRoute: '/systems/missed-lead-recovery',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/rapidpulse', '/work/harbour-estates'],
    industries: ['/industries/home-services'],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Bounded automation, not fictional autonomous employees. Real implementation, real audit log, real approval boundary.',
  },
  {
    id: 'missed-lead-recovery-followup',
    name: 'Missed Lead Recovery & Follow-up',
    routePaths: ['/systems/missed-lead-recovery'],
    primaryRoute: '/systems/missed-lead-recovery',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/rapidpulse', '/work/aura-archives'],
    industries: ['/industries/home-services'],
    handoffRoutes: ['/audit', '/book'],
    supportStatus: 'live',
    notes: 'Captures every enquiry to a durable record before any notification runs, then routes by intent.',
  },
  {
    id: 'whatsapp-business-automation',
    name: 'WhatsApp Business Automation',
    routePaths: ['/systems/trust-lead-capture'],
    primaryRoute: '/systems/trust-lead-capture',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/rapidpulse', '/work/bramble-cafe'],
    industries: ['/industries/home-services'],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Direct Meta WhatsApp Cloud API path. Template + 24-hour window rules enforced at webhook layer.',
  },
  {
    id: 'crm-lead-pipeline',
    name: 'CRM & Lead Pipeline',
    routePaths: ['/systems/missed-lead-recovery', '/systems/booking-control'],
    primaryRoute: '/systems/missed-lead-recovery',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/harbour-estates'],
    industries: [],
    handoffRoutes: ['/audit', '/book'],
    supportStatus: 'live',
    notes: 'Supabase-backed. Canonical lead identity via lib/supabase and interaction timeline.',
  },
  {
    id: 'booking-reservation-dispatch',
    name: 'Booking, Reservation & Dispatch',
    routePaths: ['/systems/booking-control'],
    primaryRoute: '/systems/booking-control',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/rapidpulse', '/work/luxe-studio', '/work/bramble-cafe', '/work/atelier'],
    industries: ['/industries/salons-spas', '/industries/home-services'],
    handoffRoutes: ['/book'],
    supportStatus: 'live',
    notes: 'Booking-request state machine; never fabricate confirmed calendar booking when only a request was recorded.',
  },
  {
    id: 'seo-search-visibility',
    name: 'SEO & Search Visibility',
    routePaths: ['/systems/trust-lead-capture'],
    primaryRoute: '/systems/trust-lead-capture',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: [],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Truthful technical eligibility. No "#1 ranking" claims. Core SEO/decision copy is server-rendered.',
  },
  {
    id: 'google-business-profile-local',
    name: 'Google Business Profile & Local Visibility',
    routePaths: [],
    primaryRoute: null,
    proofClass: 'DEMONSTRATION',
    proofRoutes: [],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'scope-only',
    notes: 'IronWake scopes this service for eligible clients. No GBP created for IronWake itself (online-only operation).',
  },
  {
    id: 'conversion-websites',
    name: 'Conversion Websites',
    routePaths: ['/systems/trust-lead-capture'],
    primaryRoute: '/systems/trust-lead-capture',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/atelier', '/work/luxe-studio'],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Copper/Ivory design system preserved. Real demo routes in /work. Apple-quality restraint, no chrome overload.',
  },
  {
    id: 'quote-support-repair-intake',
    name: 'Quote, Support & Repair Intake',
    routePaths: ['/systems/booking-control'],
    primaryRoute: '/systems/booking-control',
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: ['/work/voltix', '/work/retech'],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Voltix (electronics quote/support) and RE-TECH (repair intake/tracking) work pages exist as real references.',
  },
  {
    id: 'integrations-api',
    name: 'Integrations & API',
    routePaths: [],
    primaryRoute: null,
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: [],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Existing API endpoints under app/api/*: audit, chat, voice/session, webhooks/{retell,meta,whatsapp,resend}, owner/*, whatsapp/start.',
  },
  {
    id: 'monitoring-optimization-intelligence',
    name: 'Monitoring, Optimization & Operational Intelligence',
    routePaths: [],
    primaryRoute: null,
    proofClass: 'INTERNAL_VERIFIED_BUILD',
    proofRoutes: [],
    industries: [],
    handoffRoutes: ['/audit'],
    supportStatus: 'live',
    notes: 'Owner-facing visibility via /owner routes. Provider health surfaced via lib/provider-state.mjs probes.',
  },
]);

// ---------- industries registry ----------

export const INDUSTRIES = Object.freeze([
  { id: 'home-services', route: '/industries/home-services' },
  { id: 'dental-clinics', route: '/industries/dental-clinics' },
  { id: 'salons-spas', route: '/industries/salons-spas' },
  { id: 'dental', route: '/industries/dental' },
]);

// ---------- portfolio registry (real demo references, V14 §59) ----------

export const PORTFOLIO = Object.freeze([
  { id: 'rapidpulse', route: '/work/rapidpulse', vertical: 'plumbing dispatch', proofClass: 'DEMONSTRATION' },
  { id: 'harbour-estates', route: '/work/harbour-estates', vertical: 'property lead automation', proofClass: 'DEMONSTRATION' },
  { id: 'dentacare-pro', route: '/work/dentacare-pro', vertical: 'dental receptionist', proofClass: 'DEMONSTRATION' },
  { id: 'aura-archives', route: '/work/aura-archives', vertical: 'luxury jewellery inquiry', proofClass: 'DEMONSTRATION' },
  { id: 'luxe-studio', route: '/work/luxe-studio', vertical: 'studio booking', proofClass: 'DEMONSTRATION' },
  { id: 'bramble-cafe', route: '/work/bramble-cafe', vertical: 'reservations and catering', proofClass: 'DEMONSTRATION' },
  { id: 'voltix', route: '/work/voltix', vertical: 'electronics quote and support', proofClass: 'DEMONSTRATION' },
  { id: 'retech', route: '/work/retech', vertical: 'repair intake and tracking', proofClass: 'DEMONSTRATION' },
  { id: 'atelier', route: '/work/atelier', vertical: 'luxury salon booking', proofClass: 'DEMONSTRATION' },
]);

// ---------- brand identity (V14 §59) ----------

export const BRAND = Object.freeze({
  name: 'IronWake',
  tagline: 'AI Receptionist & Lead Recovery Systems',
  canonicalOrigin: 'https://ironwake.dev',
  classification: 'business-outcome systems company',
});

// ---------- design lock fingerprint (V14 §3, §4) ----------

export const DESIGN_LOCK = Object.freeze({
  paperCanvas: '#F5F3EE',
  warmStone: '#EDEAE3',
  primaryInk: '#0A0A0A',
  copperAction: '#B94D2F',
  copperHover: '#A33D20',
  copperPressed: '#842E18',
  supportingAqua: '#1E7582',
  themeColor: '#F5F3EE',
  lockedFiles: [
    'app/globals.css',
    'app/layout.js',
    'app/page.js',
    'app/components/FlagshipHero.js',
    'app/components/DashboardDemo.js',
  ],
});

// ---------- invariants ----------

export function listServices() {
  return SERVICE_CATALOG.slice();
}

export function getServiceById(id) {
  return SERVICE_CATALOG.find((s) => s.id === id) || null;
}

export function validateRegistry() {
  const errors = [];
  const seenIds = new Set();
  for (const s of SERVICE_CATALOG) {
    if (seenIds.has(s.id)) errors.push(`duplicate id: ${s.id}`);
    seenIds.add(s.id);
    if (typeof s.name !== 'string' || s.name.length === 0) errors.push(`${s.id}: missing name`);
    if (!Array.isArray(s.routePaths)) errors.push(`${s.id}: routePaths must be array`);
    for (const p of s.routePaths) {
      if (!routeExists(p)) errors.push(`${s.id}: route path "${p}" not in ROUTES`);
    }
    if (s.primaryRoute !== null && !routeExists(s.primaryRoute)) {
      errors.push(`${s.id}: primaryRoute "${s.primaryRoute}" not in ROUTES`);
    }
    for (const p of s.proofRoutes) {
      if (!routeExists(p)) errors.push(`${s.id}: proof route "${p}" not in ROUTES`);
    }
    for (const p of s.industries) {
      if (!routeExists(p)) errors.push(`${s.id}: industry "${p}" not in ROUTES`);
    }
    const allowed = ['DEMONSTRATION','INTERNAL_VERIFIED_BUILD','CLIENT_DEPLOYMENT','CLIENT_VERIFIED_RESULT','QUANTIFIED_VERIFIED_RESULT'];
    if (!allowed.includes(s.proofClass)) errors.push(`${s.id}: proofClass "${s.proofClass}" invalid`);
  }
  if (SERVICE_CATALOG.length !== 12) {
    errors.push(`V14 §24 mandates exactly 12 services, found ${SERVICE_CATALOG.length}`);
  }
  const expectedOrder = [
    'ai-receptionist-voice','ai-agents-workflow-automation','missed-lead-recovery-followup',
    'whatsapp-business-automation','crm-lead-pipeline','booking-reservation-dispatch',
    'seo-search-visibility','google-business-profile-local','conversion-websites',
    'quote-support-repair-intake','integrations-api','monitoring-optimization-intelligence',
  ];
  const actualOrder = SERVICE_CATALOG.map((s) => s.id);
  if (JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder)) {
    errors.push(`service order mismatch: expected ${expectedOrder.join(',')}; got ${actualOrder.join(',')}`);
  }
  return errors;
}

export function designFingerprintMatches() {
  // Read-only string fingerprint of the locked palette; consumers can re-check at runtime
  // without importing CSS. Token values below MUST equal V14 §3.
  return [
    DESIGN_LOCK.paperCanvas,
    DESIGN_LOCK.warmStone,
    DESIGN_LOCK.primaryInk,
    DESIGN_LOCK.copperAction,
    DESIGN_LOCK.copperHover,
    DESIGN_LOCK.copperPressed,
    DESIGN_LOCK.supportingAqua,
  ].join('|');
}
