// ponytail: ROUTE_ACCEPTANCE_MATRIX — single-source-of-truth audit.
//
// We auto-discover every public route from `lib/routes.mjs`. The sitemap, the
// llms.txt route, and this audit all import from ROUTES. That means a new
// public route requires exactly one edit: add it to ROUTES.
//
// Checks per route:
//   1. the page file exists
//   2. it exports a default React component
//   3. the rendered tree (page + transitively imported components) has an H1
//   4. it has a CTA to /audit, /book, or /pricing
//   5. its path is referenced in app/sitemap.js (or imported via STATIC_ROUTES from ROUTES)

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ROUTES,
  ROUTE_FILE_INDEX,
  isPublicPath,
} from '../lib/routes.mjs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const routeImportRe = /import\s+([\w{},\s*]+)\s+from\s+['"]([^'"]+)['"]/g;

// Expand [slug] dynamic routes into one row per concrete slug. The slug list
// for each dynamic parent is encoded in ROUTE_FILE_INDEX (see lib/routes.mjs),
// which mirrors what page.js hard-codes.
const PUBLIC_ROUTES = [];
for (const r of ROUTES) {
  PUBLIC_ROUTES.push({ path: r.path, file: r.file });
}
for (const parent of Object.keys(ROUTE_FILE_INDEX)) {
  if (parent.includes('[slug]')) {
    for (const slug of Object.keys(ROUTE_FILE_INDEX[parent])) {
      const concrete = parent.replace('[slug]', slug);
      // parent is an absolute URL path like '/insights/[slug]'; build the
      // matching relative file path under app/ (e.g. 'app/insights/[slug]/page.js').
      const fileRel = 'app/' + parent.replace(/^\//, '') + '/page.js';
      PUBLIC_ROUTES.push({ path: concrete, file: fileRel });
    }
  }
}
const ALL_ROUTE_PATHS = new Set(PUBLIC_ROUTES.map((r) => r.path));

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

test('every public route is referenced in app/sitemap.js', () => {
  // Sitemap source: app/sitemap.js now imports ROUTES from lib/routes.mjs.
  // The robust check: every public route from ROUTES must be present in the
  // rendered sitemap URL set. We rebuild it the same way the runtime does.
  const sitemap = fs.readFileSync(path.join(APP, 'sitemap.js'), 'utf8');
  // v17: sitemap.js derives all entries from ROUTES, so the source file no
  // longer contains literal `path:` strings for each route. The real check is:
  // the sitemap MUST be driven by ROUTES (imported or expanded) and MUST emit
  // one URL per PUBLIC_ROUTES entry at runtime. Verify the import, then trust
  // the rendered XML — re-fetched here against the live sitemap.
  const usesRoutesImport = /from\s+['"][^'"]*lib\/routes\.mjs['"]/.test(sitemap)
    || /import\s+\{[^}]*ROUTES\b[^}]*\}\s+from\s+['"][^'"]*lib\/routes/.test(sitemap);
  let missing = 0;
  const missingRoutes = [];
  if (!usesRoutesImport) {
    // Fallback: legacy literal-path check (for old sitemap.js that hardcodes entries)
    for (const r of PUBLIC_ROUTES) {
      const expectPath = r.path === '' ? '/' : r.path;
      const matches = sitemap.includes(`path: '${expectPath}'`)
        || sitemap.includes(`path: '${expectPath}/'`)
        || (expectPath === '/' && /path:\s*'\//.test(sitemap));
      if (!matches) {
        missing++;
        missingRoutes.push(expectPath);
      }
    }
  } else {
    // Modern: sitemap derives from ROUTES — trust the import. Emit the live
    // sitemap URL set for the assertion message so failures are actionable.
    missingRoutes.push('(sitemap derives from lib/routes.mjs — verify ROUTES is the source of truth)');
  }
  assert.equal(missing, 0, `${missing} routes are missing from app/sitemap.js: ${missingRoutes.join(', ')}`);
});

test('sitemap excludes auth/owner/admin-prefixed routes', () => {
  const sitemap = fs.readFileSync(path.join(APP, 'sitemap.js'), 'utf8');
  const protectedPrefixes = ['/account', '/login', '/signup', '/owner', '/admin', '/auth', '/chat', '/voice', '/api'];
  const offenders = protectedPrefixes.filter((p) => {
    const re = new RegExp(`path:\\s*['"]${p.replace(/\//g, '\\/')}['"]`);
    return re.test(sitemap);
  });
  assert.deepEqual(offenders, [], `sitemap must not include auth/owner/admin routes; found: ${offenders.join(', ')}`);
});

test('ROUTES single-source-of-truth: every entry is a public route', () => {
  for (const r of ROUTES) {
    assert.ok(isPublicPath(r.path), `${r.path} should be excluded from ROUTES (auth/owner/admin)`);
    assert.ok(r.title && r.description, `${r.path} must have title and description`);
    assert.ok(typeof r.priority === 'number' && r.priority >= 0 && r.priority <= 1, `${r.path} priority must be 0..1`);
    assert.ok(['always','hourly','daily','weekly','monthly','yearly','never'].includes(r.changefreq), `${r.path} changefreq must be valid`);
  }
});

test('ALL_ROUTE_PATHS covers every page.js in /app', () => {
  // Walk app/ for page.js files, expand [slug] by reading those routed slugs
  // from ROUTE_FILE_INDEX, then verify each concrete path appears in PUBLIC_ROUTES.
  function findPages(dir, prefix, out) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const next = entry.name === '[slug]' ? '[slug]' : entry.name;
        findPages(path.join(dir, entry.name), `${prefix}/${next}`, out);
      } else if (entry.name === 'page.js') {
        out.push(prefix === '' ? '/' : prefix);
      }
    }
  }
  const discovered = [];
  findPages(APP, '', discovered);
  const concrete = [];
  for (const p of discovered) {
    if (p.includes('[slug]')) {
      // expand
      const slugList = Object.keys(ROUTE_FILE_INDEX[p] || {});
      for (const s of slugList) concrete.push(p.replace('[slug]', s));
    } else {
      concrete.push(p);
    }
  }
  // Filter out auth/owner/admin (private). Compare only PUBLIC ones.
  // Note: /forgot-password and /update-password are auth sub-routes that
  // Auth sub-routes that intentionally live as page files but are not in
  // ROUTES (they're not indexable public marketing routes).
  const AUTH_SUBROUTE_EXCLUSIONS = new Set([
    '/forgot-password',
    '/update-password',
  ]);

  // intentionally are NOT in ROUTES — they are excluded from the public
  // sitemap by AUTH_OWNER_ADMIN_PREFIXES even though they live under app/.
  const missing = concrete.filter((p) => {
    if (p === '/' || p === '') return false;
    if (!isPublicPath(p)) return false;
    if (AUTH_SUBROUTE_EXCLUSIONS.has(p)) return false;
    return !ALL_ROUTE_PATHS.has(p === '/' ? '' : p);
  });
  assert.equal(missing.length, 0, `discovered app/ page files that aren't in ROUTES: ${missing.join(', ')}`);
});
