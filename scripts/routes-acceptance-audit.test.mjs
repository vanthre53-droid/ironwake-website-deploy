// ponytail: all-routes acceptance matrix. We don't run a browser - we
// verify each public route:
//   1. the page file exists
//   2. it exports a default React component
//   3. it has a H1 (or Page.H1 in app-router)
//   4. it has a CTA pointing to /audit, /book, or /pricing
//   5. it is referenced in app/sitemap.js
//
// This is the safety net so we never ship a broken page link again.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const routeImportRe = /import\s+([\w{},\s*]+)\s+from\s+['"]([^'"]+)['"]/g;

const PUBLIC_ROUTES = [
  { path: '', file: 'app/page.js' },
  { path: '/systems', file: 'app/systems/page.js' },
  { path: '/systems/missed-lead-recovery', file: 'app/systems/missed-lead-recovery/page.js' },
  { path: '/systems/booking-control', file: 'app/systems/booking-control/page.js' },
  { path: '/systems/trust-lead-capture', file: 'app/systems/trust-lead-capture/page.js' },
  { path: '/systems/ai-receptionist', file: 'app/systems/ai-receptionist/page.js' },
  { path: '/work', file: 'app/work/page.js' },
  { path: '/work/rapidpulse', file: 'app/work/rapidpulse/page.js' },
  { path: '/work/dentacare-pro', file: 'app/work/dentacare-pro/page.js' },
  { path: '/work/atelier', file: 'app/work/atelier/page.js' },
  { path: '/work/harbour-estates', file: 'app/work/harbour-estates/page.js' },
  { path: '/work/aura-archives', file: 'app/work/aura-archives/page.js' },
  { path: '/work/luxe-studio', file: 'app/work/luxe-studio/page.js' },
  { path: '/work/bramble-cafe', file: 'app/work/bramble-cafe/page.js' },
  { path: '/work/voltix', file: 'app/work/voltix/page.js' },
  { path: '/work/retech', file: 'app/work/retech/page.js' },
  { path: '/industries', file: 'app/industries/page.js' },
  { path: '/industries/home-services', file: 'app/industries/home-services/page.js' },
  { path: '/industries/dental-clinics', file: 'app/industries/dental-clinics/page.js' },
  { path: '/industries/salons-spas', file: 'app/industries/salons-spas/page.js' },
  { path: '/pricing', file: 'app/pricing/page.js' },
  { path: '/scope', file: 'app/scope/page.js' },
  { path: '/process', file: 'app/process/page.js' },
  { path: '/about', file: 'app/about/page.js' },
  { path: '/insights', file: 'app/insights/page.js' },
  { path: '/insights/missed-lead-recovery-service-businesses', file: 'app/insights/[slug]/page.js' },
  { path: '/insights/booking-confirmation-vs-booking-request', file: 'app/insights/[slug]/page.js' },
  { path: '/insights/follow-up-ownership-service-businesses', file: 'app/insights/[slug]/page.js' },
  { path: '/insights/ai-receptionist-honest-assessment', file: 'app/insights/[slug]/page.js' },
  { path: '/audit', file: 'app/audit/page.js' },
  { path: '/book', file: 'app/book/page.js' },
  { path: '/privacy', file: 'app/privacy/page.js' },
  { path: '/terms', file: 'app/terms/page.js' },
];

function walkImports(file, depth, predicate, seen) {
  if (!file || depth > 6) return false;
  if (seen.has(file)) return false;
  seen.add(file);
  if (!fs.existsSync(file)) return false;
  const src = fs.readFileSync(file, 'utf8');
  if (predicate(src)) return true;
  routeImportRe.lastIndex = 0;
  let m;
  while ((m = routeImportRe.exec(src))) {
    if (!m[2].startsWith('.')) continue;
    const base = path.resolve(path.dirname(file), m[2]);
    const candidates = [base + '.js', base + '.jsx', path.join(base, 'index.js')];
    for (const c of candidates) {
      if (walkImports(c, depth + 1, predicate, seen)) return true;
    }
  }
  return false;
}

test(`every public route (${PUBLIC_ROUTES.length}) has a page file`, () => {
  for (const r of PUBLIC_ROUTES) {
    const full = path.join(ROOT, r.file);
    assert.ok(fs.existsSync(full), `page file missing: ${r.file} for route ${r.path || '/'}`);
  }
});

test('every page file exports a default React component', () => {
  for (const r of PUBLIC_ROUTES) {
    const full = path.join(ROOT, r.file);
    if (!fs.existsSync(full)) continue;
    const src = fs.readFileSync(full, 'utf8');
    assert.match(src, /export default (function|async function|\(?\w|\(\s*\w)|export \{[^}]*default/m, `${r.file} must export default a component`);
  }
});

test('every page has a real H1 (no orphan H1-less pages in header)', () => {
  const missing = [];
  for (const r of PUBLIC_ROUTES) {
    const full = path.join(ROOT, r.file);
    if (!fs.existsSync(full)) continue;
    const seen = new Set();
    const hasH1 = walkImports(full, 0, (src) => /<h1\b/.test(src), seen);
    if (!hasH1) missing.push(r.path || '/');
  }
  assert.equal(missing.length, 0, missing.length + ' routes are missing an H1 in their rendered tree: ' + missing.join(', '));
});

test('every page has at least one CTA that points to /audit, /book, or /pricing', () => {
  const missing = [];
  for (const r of PUBLIC_ROUTES) {
    const full = path.join(ROOT, r.file);
    if (!fs.existsSync(full)) continue;
    const seen = new Set();
    const hasCta = walkImports(full, 0, (src) => /\/audit|\/book|\/pricing/.test(src), seen);
    if (!hasCta) missing.push(r.path || '/');
  }
  assert.equal(missing.length, 0, missing.length + ' routes have no CTA to /audit, /book, or /pricing: ' + missing.join(', '));
});

test('every page is referenced in app/sitemap.js (STATIC_ROUTES)', () => {
  const sitemap = fs.readFileSync(path.join(APP, 'sitemap.js'), 'utf8');
  let missing = 0;
  for (const r of PUBLIC_ROUTES) {
    const path = r.path;
    if (!sitemap.includes(`path: '${path}'`)) {
      missing++;
    }
  }
  assert.equal(missing, 0, `${missing} routes are missing from sitemap.js STATIC_ROUTES`);
});
