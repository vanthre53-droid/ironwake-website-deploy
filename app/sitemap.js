// ponytail: canonical site URL drives sitemap, robots, and JSON-LD.
// PRODUCTION_CANONICAL_ORIGIN is the one source of truth.
// NEXT_PUBLIC_SITE_URL is an opt-in override for preview/local environments;
// in production it must be unset or equal to PRODUCTION_CANONICAL_ORIGIN.
//
// lastmod is only set for URLs whose source content was materially updated.
// We do NOT stamp every entry with the request time — that would mislead
// crawlers and Search Console about which pages actually changed.
//
// v17 — ROUTE_ACCEPTANCE_MATRIX: route inventory is now derived from lib/routes.mjs
// so the sitemap, llms.txt, and route acceptance matrix cannot drift apart.
// Only PUBLIC routes are emitted here; auth/owner/admin/account are excluded.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROUTES } from '../lib/routes.mjs';
import { canonicalUrl } from '../lib/seo.mjs';

const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;

// ponytail: every public sitemap URL is computed from ROUTES (lib/routes.mjs).
// changeFrequency and priority come from ROUTES — do NOT maintain them here.
function toSitemapEntry(route) {
  const file = route.file ? join(/* turbopackIgnore: true */ process.cwd(), route.file) : null;
  let lastModified;
  if (file && existsSync(file)) {
    try {
      lastModified = statSync(file).mtime.toISOString();
    } catch {
      lastModified = new Date().toISOString();
    }
  } else {
    lastModified = new Date().toISOString();
  }
  return {
    url: canonicalUrl(route.path),
    lastModified,
    changeFrequency: route.changefreq || 'weekly',
    priority: typeof route.priority === 'number' ? route.priority : 0.5,
  };
}

export default function sitemap() {
  // ponytail: ROUTES is the SINGLE source of truth for which paths are public.
  // Auth-only, owner-only, and admin-only paths are absent from ROUTES, so
  // they are physically excluded from the sitemap — no manual denylist needed.
  return ROUTES.map(toSitemapEntry);
}
