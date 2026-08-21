// ponytail: ROUTE_ACCEPTANCE_MATRIX — the single source of truth for every
// public route in the IronWake site. Sitemap, llms.txt, and the audit scripts
// all import from this file. Adding a public route without adding it here is
// a v17 release-blocker (sitemap audit enforces).
//
// What "public" means here:
//   - Reachable from the homepage / footer / nav without logging in
//   - Has a stable canonical URL
//   - Is allowed by robots.txt (not in /admin / /owner / /account / /auth /chat /voice /api)
//   - Has metadata.title + metadata.description + alternates.canonical in the page module
//
// What is NOT public (and is NEVER added here):
//   - /login, /signup, /forgot-password, /update-password, /auth/*
//   - /account, /admin, /owner, /chat, /voice/api
//   - any /api/* route
//
// Field rules:
//   - path: starts with '/' or is '' for the homepage
//   - parent: the section root, used for breadcrumb schemas and llms.txt grouping
//   - priority: 0.0–1.0 per the sitemap protocol
//   - changefreq: 'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never'
//   - title: the page.title as written in the page module
//   - description: the page.description as written in the page module
//   - file: relative path to the page module (used to compute lastmod via fs mtime)
//
// Drift note: the audit script (scripts/route-acceptance-audit.mjs) compares
// ROUTES against the actual app/*/page.js tree and exits non-zero on drift.

import { canonicalUrl } from './seo.mjs';

export const ROUTES = Object.freeze([
  // ============================================================ Home
  {
    path: '',
    title: 'IronWake — The enquiry arrived. Where did it go?',
    description: 'IronWake builds operational systems that capture enquiries, make the next review step visible, and control follow-up without overstating provider status.',
    parent: null,
    priority: 1.0,
    changefreq: 'weekly',
    file: 'app/page.js',
    section: 'Foundation',
    owner: 'home',
  },
  // ============================================================ Systems
  {
    path: '/systems',
    title: 'Systems — IronWake',
    description: 'Four operational systems targeting the real places where an enquiry, booking, or follow-up can lose visibility: missed lead recovery, booking certainty, trust + lead capture, and the AI receptionist plan.',
    parent: null,
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/systems/page.js',
    section: 'Systems',
    owner: 'systems',
  },
  {
    path: '/systems/missed-lead-recovery',
    title: 'Missed Lead Recovery — IronWake',
    description: 'Capture every enquiry to a durable record before any notification runs, then route by intent. No silent follow-up',
    parent: '/systems',
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/systems/missed-lead-recovery/page.js',
    section: 'Systems',
    owner: 'systems',
  },
  {
    path: '/systems/booking-control',
    title: 'Booking Certainty — IronWake',
    description: 'Separate a booking request from a confirmed appointment so neither side assumes the wrong state.',
    parent: '/systems',
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/systems/booking-control/page.js',
    section: 'Systems',
    owner: 'systems',
  },
  {
    path: '/systems/trust-lead-capture',
    title: 'Trust + Lead Capture — IronWake',
    description: 'A conversion-optimised intake that persists first, notifies second. The enquiry survives even when the channels do not.',
    parent: '/systems',
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/systems/trust-lead-capture/page.js',
    section: 'Systems',
    owner: 'systems',
  },
  {
    path: '/systems/ai-receptionist',
    title: 'AI Receptionist Planning — IronWake',
    description: 'Planning requirements for a disclosed, human-supervised first-response build. No live receptionist provider is connected.',
    parent: '/systems',
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/systems/ai-receptionist/page.js',
    section: 'Systems',
    owner: 'systems',
  },

  // ============================================================ Industries
  {
    path: '/industries',
    title: 'Industries — IronWake',
    description: 'Per-vertical operational guidance for home services, dental & private clinics, and salons & spas.',
    parent: null,
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/industries/page.js',
    section: 'Industries',
    owner: 'industries',
  },
  {
    path: '/industries/home-services',
    title: 'Home Services — IronWake',
    description: 'Keep missed calls and urgent requests from ending without a documented callback plan.',
    parent: '/industries',
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/industries/home-services/page.js',
    section: 'Industries',
    owner: 'industries',
  },
  {
    path: '/industries/dental-clinics',
    title: 'Dental & Private Clinics — IronWake',
    description: 'Keep phone, walk-in, and online requests in one reviewable intake path.',
    parent: '/industries',
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/industries/dental-clinics/page.js',
    section: 'Industries',
    owner: 'industries',
  },
  {
    path: '/industries/salons-spas',
    title: 'Salons & Spas — IronWake',
    description: 'Make sure consultation interest receives a clear follow-up before it cools.',
    parent: '/industries',
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/industries/salons-spas/page.js',
    section: 'Industries',
    owner: 'industries',
  },
  {
    path: '/industries/dental',
    title: 'AI Receptionist for Dental Practices — IronWake',
    description: 'Front-desk call recovery for dental and private-clinic practices. Plan a 24/7 AI receptionist that answers, captures, and routes inbound enquiries.',
    parent: '/industries',
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/industries/dental/page.js',
    section: 'Industries',
    owner: 'industries',
  },

  // ============================================================ Work (portfolio)
  {
    path: '/work',
    title: 'Work — IronWake',
    description: 'Capability demonstrations, not client engagements. Every portfolio item is plainly labelled.',
    parent: null,
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/work/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/atelier',
    title: 'Atelier Safe — IronWake Work',
    description: 'A portfolio demonstration of consultation-request handling for appointment-led businesses. Capability proof only, not a client engagement.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/atelier/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/aura-archives',
    title: 'Aura Archives — IronWake Work',
    description: 'A portfolio demonstration of enquiry-persistence for a curation-style business. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/aura-archives/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/bramble-cafe',
    title: 'Bramble Cafe — IronWake Work',
    description: 'A portfolio demonstration of reservation-style intake handling. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/bramble-cafe/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/dentacare-pro',
    title: 'DentaCare Pro — IronWake Work',
    description: 'A portfolio demonstration of intake-to-review for a clinic-style front desk. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/dentacare-pro/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/harbour-estates',
    title: 'Harbour Estates — IronWake Work',
    description: 'A portfolio demonstration of long-cycle enquiry handling. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/harbour-estates/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/luxe-studio',
    title: 'Luxe Studio — IronWake Work',
    description: 'A portfolio demonstration of consultation-capture for a creative studio. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/luxe-studio/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/rapidpulse',
    title: 'RapidPulse — IronWake Work',
    description: 'A portfolio demonstration of speed-to-first-response for an inquiry-led business. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/rapidpulse/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/retech',
    title: 'Retell Retech — IronWake Work',
    description: 'A portfolio demonstration of retained-tech intake. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/retech/page.js',
    section: 'Work',
    owner: 'work',
  },
  {
    path: '/work/voltix',
    title: 'Voltix — IronWake Work',
    description: 'A portfolio demonstration of utility-style onboarding. Capability proof only.',
    parent: '/work',
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/work/voltix/page.js',
    section: 'Work',
    owner: 'work',
  },
  // ============================================================
  // V15-013: 40 personalised-competitor salon demos removed
  // (V15 §56/§105/§115/§122). Canonical portfolio (9 entries)
  // remains as the only OFFERED_NOW proof under /work/.
  // Rollback: .ironwake/v15-013-orphan-snapshot/lib-routes-pre.tar.gz
  // ============================================================
  ...[],

  // ============================================================ Insights
  {
    path: '/insights',
    title: 'Insights — IronWake',
    description: 'Operational insights for service businesses: lead recovery, booking control, follow-up automation, and workflow improvement.',
    parent: null,
    priority: 0.7,
    changefreq: 'weekly',
    file: 'app/insights/page.js',
    section: 'Insights',
    owner: 'insights',
  },
  {
    path: '/insights/missed-lead-recovery-service-businesses',
    title: 'Where service businesses typically lose enquiries before follow-up — IronWake',
    description: 'Operational gaps between the first enquiry and the first response are the usual suspect. Here are the most common patterns and how to identify which one applies to your business.',
    parent: '/insights',
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/insights/[slug]/page.js',
    section: 'Insights',
    owner: 'insights',
  },
  {
    path: '/insights/booking-confirmation-vs-booking-request',
    title: 'Booking certainty without presumption — IronWake',
    description: 'Most no-show and I-thought-they-confirmed arguments are about presuming state. The fix is to make a request and a confirmed appointment visually and procedurally distinct.',
    parent: '/insights',
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/insights/[slug]/page.js',
    section: 'Insights',
    owner: 'insights',
  },
  {
    path: '/insights/follow-up-ownership-service-businesses',
    title: 'Follow-up discipline without burning out the team — IronWake',
    description: 'Disciplined follow-up is not more messages. It is one named owner per enquiry, one due time per stage, and one visible next action per record.',
    parent: '/insights',
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/insights/[slug]/page.js',
    section: 'Insights',
    owner: 'insights',
  },
  {
    path: '/insights/ai-receptionist-honest-assessment',
    title: 'AI receptionist: an honest assessment for service businesses — IronWake',
    description: 'An AI receptionist is a disclosed automated first responder, not a person. It earns trust by what it commits to, not by what it pretends to be.',
    parent: '/insights',
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/insights/[slug]/page.js',
    section: 'Insights',
    owner: 'insights',
  },

  // ============================================================ Pricing
  {
    path: '/pricing',
    title: 'Pricing — IronWake | 5 Systems, 3 Tiers Each',
    description: 'IronWake pricing for India and international service businesses. Five operational systems with Lite, Standard, and Pro tiers.',
    parent: null,
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/pricing/page.js',
    section: 'Pricing',
    owner: 'pricing',
  },

  // ============================================================ Process / Scope / About
  {
    path: '/process',
    title: 'Process — IronWake',
    description: 'How an IronWake engagement starts, what is shipped, and what stops short until evidence exists.',
    parent: null,
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/process/page.js',
    section: 'Foundation',
    owner: 'process',
  },
  {
    path: '/scope',
    title: 'Scope — IronWake',
    description: 'What IronWake does, what it does not do, and the boundaries of the practice.',
    parent: null,
    priority: 0.6,
    changefreq: 'monthly',
    file: 'app/scope/page.js',
    section: 'Foundation',
    owner: 'scope',
  },
  {
    path: '/about',
    title: 'About — IronWake',
    description: 'IronWake is a founder-led systems practice for service businesses, built around labelled, verified claims instead of theatre.',
    parent: null,
    priority: 0.5,
    changefreq: 'monthly',
    file: 'app/about/page.js',
    section: 'Foundation',
    owner: 'about',
  },
  {
    path: '/services',
    title: 'Services — IronWake | Capability Catalogue',
    description: 'Every capability IronWake designs, builds, and operates today — by delivery model, by proof class, and by the work route where the capability is already exercised. OFFERED_NOW only. No invented roadmap.',
    parent: null,
    priority: 0.7,
    changefreq: 'monthly',
    file: 'app/services/page.js',
    section: 'Foundation',
    owner: 'services',
  },

  // ============================================================ Audit / Book (conversion)
  {
    path: '/audit',
    title: 'Business Leak Audit — IronWake',
    description: 'A written review identifying where your enquiry, booking, or follow-up process loses momentum. No booking, quote, or provider connection is implied until scope is confirmed.',
    parent: null,
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/audit/page.js',
    section: 'Conversion',
    owner: 'audit',
  },
  {
    path: '/book',
    title: 'Book a diagnostic — IronWake',
    description: 'Request a Business Leak Audit. Written review first; implementation only after confirmed scope.',
    parent: null,
    priority: 0.8,
    changefreq: 'weekly',
    file: 'app/book/page.js',
    section: 'Conversion',
    owner: 'book',
  },
  {
    path: '/voice',
    title: 'Live voice assistant — IronWake',
    description: 'A disclosed, consent-first browser voice session against the published IronWake assistant. No microphone activation until you tap start.',
    parent: null,
    priority: 0.4,
    changefreq: 'monthly',
    file: 'app/voice/page.js',
        section: 'Product',
        owner: 'voice',
        noindex: true,
      },

      // ============================================================ Customer-facing chat surface (full-screen, distinct from the FAB widget)
      {
        path: '/chat',
        title: 'Ask IronWake — IronWake',
        description: 'Full conversation view of the IronWake site assistant. Model-backed, scoped to IronWake business questions, never used as a general coding tool.',
        parent: null,
        priority: 0.5,
        changefreq: 'monthly',
        file: 'app/chat/page.js',
        section: 'Product',
        owner: 'chatbot',
        noindex: true,
      },

      // ============================================================ Legal
  {
    path: '/privacy',
    title: 'Privacy — IronWake',
    description: 'How IronWake collects, uses, and stores data. Honest, scoped, and minimal.',
    parent: null,
    priority: 0.3,
    changefreq: 'yearly',
    file: 'app/privacy/page.js',
    section: 'Legal',
    owner: 'legal',
  },
  {
    path: '/terms',
    title: 'Terms — IronWake',
    description: 'Terms of use for the IronWake site and services.',
    parent: null,
    priority: 0.3,
    changefreq: 'yearly',
    file: 'app/terms/page.js',
    section: 'Legal',
    owner: 'legal',
  },
]);

// ponytail: lookup helpers used by sitemap, llms.txt, and the route audit.
const _byPath = new Map(ROUTES.map((r) => [r.path, r]));

export function getRouteMetadata(path) {
  if (_byPath.has(path)) return _byPath.get(path);
  // normalize trailing-slash / blank path
  if (path === '/' || path === '') return _byPath.get('');
  return null;
}

export function getRoutesBySection(section) {
  return ROUTES.filter((r) => r.section === section);
}

export function getRoutesByOwner(owner) {
  return ROUTES.filter((r) => r.owner === owner);
}

// ponytail: convenience — build a breadcrumb chain for any route (used by JSON-LD).
export function getBreadcrumbChain(path) {
  const chain = [];
  const route = getRouteMetadata(path);
  if (!route) return [{ name: 'Home', path: '/' }];
  let cursor = route;
  while (cursor) {
    chain.unshift({ name: cursor.title.replace(/ — IronWake$/, ''), path: cursor.path });
    if (!cursor.parent) break;
    cursor = getRouteMetadata(cursor.parent);
    if (!cursor) break;
  }
  // Always lead with Home if not already present.
  if (chain[0]?.path !== '/') chain.unshift({ name: 'Home', path: '/' });
  return chain;
}

// ponytail: convenience — quick URL set for cross-checks (sitemap audit).
export function getAllPublicUrls() {
  return ROUTES.map((r) => canonicalUrl(r.path));
}

export function isPublicRoute(path) {
  return getRouteMetadata(path) !== null;
}

// Customer-facing product routes that should NOT be treated as auth/owner:
//   - /voice is the public Retell web-call page (visitor-facing)
//   - /chat is not a route today (chatbot is a widget, not a page); if a /chat
//     page is later added it will also be public.
// /api/* is always private — those are API handlers, not marketing pages.
export const AUTH_OWNER_ADMIN_PREFIXES = ['/account', '/login', '/signup', '/owner', '/admin', '/auth', '/api'];

/** Path-based public-route check (string instead of route-existence). */
export function isPublicPath(path) {
  if (path === undefined || path === null) return false;
  const p = String(path).startsWith('/') ? String(path) : `/${path}`;
  return !AUTH_OWNER_ADMIN_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
}

export function groupRoutesByParent() {
  const groups = new Map();
  for (const r of ROUTES) {
    const segments = (r.path || '').split('/').filter(Boolean);
    const parent = segments[0] || '_root';
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(r);
  }
  return groups;
}

// ponytail: INSIGHTS_SLUGS mirrors the ARTICLES slug list in
// app/insights/[slug]/page.js. If you add an article, add the slug here so
// ROUTE_FILE_INDEX expands the dynamic route correctly.
export const INSIGHTS_SLUGS = [
  'missed-lead-recovery-service-businesses',
  'booking-confirmation-vs-booking-request',
  'follow-up-ownership-service-businesses',
  'ai-receptionist-honest-assessment',
];

/** Concrete slug index for dynamic [slug] parents, sourced from constants in this file. */
export const ROUTE_FILE_INDEX = (() => {
  const index = {};
  index['/insights/[slug]'] = Object.fromEntries(
    INSIGHTS_SLUGS.map((slug) => [slug, `/insights/${slug}`])
  );
  return index;
})();
