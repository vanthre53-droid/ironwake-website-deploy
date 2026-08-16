// ponytail: canonical site URL drives sitemap, robots, and JSON-LD.
// PRODUCTION_CANONICAL_ORIGIN is the one source of truth.
// NEXT_PUBLIC_SITE_URL is an opt-in override for preview/local environments;
// in production it must be unset or equal to PRODUCTION_CANONICAL_ORIGIN.
//
// lastmod is only set for URLs whose source content was materially updated.
// We do NOT stamp every entry with the request time — that would mislead
// crawlers and Search Console about which pages actually changed.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;

// ponytail: the static public route inventory. lastmod is read from the
// page file's mtime when the file exists; pages without a dedicated file
// (e.g. /api/*) are simply omitted from the sitemap.
const STATIC_ROUTES = [
  { path: '', priority: 1.0, file: 'app/page.js' },
  { path: '/systems', priority: 0.8, file: 'app/systems/page.js' },
  { path: '/systems/missed-lead-recovery', priority: 0.8, file: 'app/systems/missed-lead-recovery/page.js' },
  { path: '/systems/booking-control', priority: 0.8, file: 'app/systems/booking-control/page.js' },
  { path: '/systems/trust-lead-capture', priority: 0.8, file: 'app/systems/trust-lead-capture/page.js' },
  { path: '/systems/ai-receptionist', priority: 0.8, file: 'app/systems/ai-receptionist/page.js' },
  { path: '/work', priority: 0.8, file: 'app/work/page.js' },
  { path: '/work/rapidpulse', priority: 0.7, file: 'app/work/rapidpulse/page.js' },
  { path: '/work/dentacare-pro', priority: 0.7, file: 'app/work/dentacare-pro/page.js' },
  { path: '/work/atelier', priority: 0.7, file: 'app/work/atelier/page.js' },
  { path: '/work/harbour-estates', priority: 0.7, file: 'app/work/harbour-estates/page.js' },
  { path: '/work/aura-archives', priority: 0.7, file: 'app/work/aura-archives/page.js' },
  { path: '/work/luxe-studio', priority: 0.7, file: 'app/work/luxe-studio/page.js' },
  { path: '/work/bramble-cafe', priority: 0.7, file: 'app/work/bramble-cafe/page.js' },
  { path: '/work/voltix', priority: 0.7, file: 'app/work/voltix/page.js' },
  { path: '/work/retech', priority: 0.7, file: 'app/work/retech/page.js' },
  { path: '/industries', priority: 0.7, file: 'app/industries/page.js' },
  { path: '/industries/home-services', priority: 0.7, file: 'app/industries/home-services/page.js' },
  { path: '/industries/dental-clinics', priority: 0.7, file: 'app/industries/dental-clinics/page.js' },
  { path: '/industries/salons-spas', priority: 0.7, file: 'app/industries/salons-spas/page.js' },
  { path: '/pricing', priority: 0.8, file: 'app/pricing/page.js' },
  { path: '/scope', priority: 0.6, file: 'app/scope/page.js' },
  { path: '/process', priority: 0.6, file: 'app/process/page.js' },
  { path: '/about', priority: 0.5, file: 'app/about/page.js' },
  { path: '/insights', priority: 0.7, file: 'app/insights/page.js' },
  { path: '/insights/missed-lead-recovery-service-businesses', priority: 0.6, file: 'app/insights/missed-lead-recovery-service-businesses/page.js' },
  { path: '/insights/booking-confirmation-vs-booking-request', priority: 0.6, file: 'app/insights/booking-confirmation-vs-booking-request/page.js' },
  { path: '/insights/follow-up-ownership-service-businesses', priority: 0.6, file: 'app/insights/follow-up-ownership-service-businesses/page.js' },
  { path: '/insights/ai-receptionist-honest-assessment', priority: 0.6, file: 'app/insights/ai-receptionist-honest-assessment/page.js' },
  { path: '/audit', priority: 0.8, file: 'app/audit/page.js' },
  { path: '/book', priority: 0.8, file: 'app/book/page.js' },
  { path: '/login', priority: 0.3, file: 'app/login/page.js' },
  { path: '/signup', priority: 0.3, file: 'app/signup/page.js' },
  { path: '/forgot-password', priority: 0.3, file: 'app/forgot-password/page.js' },
  { path: '/privacy', priority: 0.3, file: 'app/privacy/page.js' },
  { path: '/terms', priority: 0.3, file: 'app/terms/page.js' },
];

function lastModifiedFor(file) {
  if (!file) return undefined;
  try {
    if (!existsSync(file)) return undefined;
    const m = statSync(file).mtime;
    return m.toISOString();
  } catch {
    return undefined;
  }
}

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;
  return STATIC_ROUTES
    .map(({ path: p, priority, file }) => {
      const url = `${base}${p}`;
      const lastModified = lastModifiedFor(file);
      return {
        url,
        lastModified: lastModified || new Date(),
        changeFrequency: p === '' ? 'daily' : p.startsWith('/insights') ? 'monthly' : 'weekly',
        priority: p === '/login' || p === '/signup' || p === '/forgot-password' ? 0.3 : priority,
      };
    })
    // Filter out routes that we never want indexed in the public sitemap
    // even if a stray file exists.
    .filter(({ url }) => !url.includes('/owner/') && !url.includes('/admin/') && !url.includes('/account/'));
}
