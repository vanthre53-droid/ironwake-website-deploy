// ponytail: emit a static public/sitemap.xml from the same route inventory
// Next.js uses in app/sitemap.js. The two MUST stay in sync — if they
// diverge, scripts/seo-tech-audit.mjs fails the build.
//
// Why both:
//   - app/sitemap.js is served at /sitemap.xml by Next.js (returns XML).
//   - public/sitemap.xml is served verbatim from the public/ bucket.
// Both must agree so crawlers (and humans) see the same URL surface in
// dev, preview, and production — and so the sitemap is recoverable even
// if the Next runtime errors out during boot.

import { writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;

// ponytail: mirror of STATIC_ROUTES in app/sitemap.js. Keep alphabetical
// within priority groups. The two files are coupled by
// scripts/seo-tech-audit.mjs.
const STATIC_ROUTES = [
  { path: '', priority: 1.0, file: 'app/page.js' },
  { path: '/about', priority: 0.5, file: 'app/about/page.js' },
  { path: '/audit', priority: 0.8, file: 'app/audit/page.js' },
  { path: '/book', priority: 0.8, file: 'app/book/page.js' },
  { path: '/industries', priority: 0.7, file: 'app/industries/page.js' },
  { path: '/industries/dental-clinics', priority: 0.7, file: 'app/industries/dental-clinics/page.js' },
  { path: '/industries/home-services', priority: 0.7, file: 'app/industries/home-services/page.js' },
  { path: '/industries/salons-spas', priority: 0.7, file: 'app/industries/salons-spas/page.js' },
  { path: '/insights', priority: 0.7, file: 'app/insights/page.js' },
  { path: '/insights/ai-receptionist-honest-assessment', priority: 0.6, file: 'app/insights/[slug]/page.js' },
  { path: '/insights/booking-confirmation-vs-booking-request', priority: 0.6, file: 'app/insights/[slug]/page.js' },
  { path: '/insights/follow-up-ownership-service-businesses', priority: 0.6, file: 'app/insights/[slug]/page.js' },
  { path: '/insights/missed-lead-recovery-service-businesses', priority: 0.6, file: 'app/insights/[slug]/page.js' },
  { path: '/pricing', priority: 0.8, file: 'app/pricing/page.js' },
  { path: '/privacy', priority: 0.3, file: 'app/privacy/page.js' },
  { path: '/process', priority: 0.6, file: 'app/process/page.js' },
  { path: '/scope', priority: 0.6, file: 'app/scope/page.js' },
  { path: '/systems', priority: 0.8, file: 'app/systems/page.js' },
  { path: '/systems/ai-receptionist', priority: 0.8, file: 'app/systems/ai-receptionist/page.js' },
  { path: '/systems/booking-control', priority: 0.8, file: 'app/systems/booking-control/page.js' },
  { path: '/systems/missed-lead-recovery', priority: 0.8, file: 'app/systems/missed-lead-recovery/page.js' },
  { path: '/systems/trust-lead-capture', priority: 0.8, file: 'app/systems/trust-lead-capture/page.js' },
  { path: '/terms', priority: 0.3, file: 'app/terms/page.js' },
  { path: '/work', priority: 0.8, file: 'app/work/page.js' },
  { path: '/work/atelier', priority: 0.7, file: 'app/work/atelier/page.js' },
  { path: '/work/aura-archives', priority: 0.7, file: 'app/work/aura-archives/page.js' },
  { path: '/work/bramble-cafe', priority: 0.7, file: 'app/work/bramble-cafe/page.js' },
  { path: '/work/dentacare-pro', priority: 0.7, file: 'app/work/dentacare-pro/page.js' },
  { path: '/work/harbour-estates', priority: 0.7, file: 'app/work/harbour-estates/page.js' },
  { path: '/work/luxe-studio', priority: 0.7, file: 'app/work/luxe-studio/page.js' },
  { path: '/work/rapidpulse', priority: 0.7, file: 'app/work/rapidpulse/page.js' },
  { path: '/work/retech', priority: 0.7, file: 'app/work/retech/page.js' },
  { path: '/work/voltix', priority: 0.7, file: 'app/work/voltix/page.js' },
];

function lastModifiedFor(file) {
  const full = join(projectRoot, file);
  if (!existsSync(full)) return undefined;
  try {
    return statSync(full).mtime.toISOString();
  } catch {
    return undefined;
  }
}

function buildXml(base, routes) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const { path: p, priority, file } of routes) {
    const loc = `${base}${p}`;
    const lastmod = lastModifiedFor(file);
    const changefreq = p === '' ? 'daily' : p.startsWith('/insights') ? 'monthly' : 'weekly';
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
    lines.push(`    <priority>${priority.toFixed(1)}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
}

export function generateSitemap({ base = FALLBACK_SITE_URL, routes = STATIC_ROUTES } = {}) {
  return buildXml(base, routes);
}

// CLI entry: `node scripts/sitemap-generator.mjs` writes public/sitemap.xml
// and prints a short summary so it can be used in pre-deploy hooks.
if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = join(projectRoot, 'public');
  mkdirSync(outDir, { recursive: true });
  const xml = generateSitemap();
  const outPath = join(outDir, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  const summary = {
      base: FALLBACK_SITE_URL,
      urlCount: STATIC_ROUTES.length,
      bytes: xml.length,
      outPath,
    };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}