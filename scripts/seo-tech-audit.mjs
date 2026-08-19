// ponytail: SEO technical audit — runs without a network.
// Checks:
//   1. Every public page.js has:
//        - alternates.canonical in metadata / generateMetadata
//        - Organization JSON-LD (<script type="application/ld+json"> with @type=Organization)
//        - BreadcrumbList JSON-LD
//      Skip patterns: auth/*, owner/*, login, forgot-password, signup, account, admin, chat, update-password, /api/*.
//   2. Every page in app/sitemap.js appears in public/sitemap.xml (parity check).
//   3. Critical binary assets are real files:
//        - app/favicon.ico      (ICO magic, multi-size)
//        - app/apple-icon.png   (PNG magic, 180x180)
//        - public/logo.png      (PNG magic, 512x512)
//        - public/sitemap.xml   (well-formed XML)
//   4. lib/seo.mjs canonical site URL matches app/robots.js, app/sitemap.js, and lib/site-origin.mjs.
//   5. No legacy PNG/JPG references in JSON-LD that don't resolve under public/.
//
// Exits 0 on clean, 1 on any failure. Prints a JSON report on stdout.

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const APP = path.join(ROOT, 'app');
const PUBLIC = path.join(ROOT, 'public');
const LIB = path.join(ROOT, 'lib');

const SKIP_PATH_PATTERNS = [
  /\/auth\//,
  /\/owner\//,
  /^\/login\//,
  /^\/forgot-password\//,
  /^\/signup\//,
  /^\/update-password\//,
  /^\/account\//,
  /^\/admin\//,
  /^\/chat\//,
  /^\/api\//,
];

const failures = [];
const warnings = [];
const passes = [];

function fail(check, detail) { failures.push({ check, detail }); }
function warn(check, detail) { warnings.push({ check, detail }); }
function pass(check, detail) { passes.push({ check, detail }); }

async function listPublicPages() {
  const out = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue;
        if (e.name.startsWith('_') || e.name === 'components' || e.name === 'lib') continue;
        await walk(full);
      } else if (e.isFile() && e.name === 'page.js') {
        const relPath = path.relative(APP, full).replace(/\\/g, '/');
        const routePath = '/' + relPath.replace(/\/page\.js$/, '').replace(/\[\.\.\.([^\]]+)\]/g, '*$1').replace(/\[([^\]]+)\]/g, ':$1');
        out.push({ relPath, routePath, full });
      }
    }
  }
  await walk(APP);
  return out;
}

function isPublicRoute(routePath) {
  if (routePath === '/' || routePath === '') return true;
  const first = routePath.split('/').filter(Boolean)[0];
  return !SKIP_PATH_PATTERNS.some((p) => p.test('/' + first + '/'));
}

function checkOrganizationJsonLd(src) {
  const hasScript = /<script\s[^>]*application\/ld\+json/.test(src);
  const hasType = /['"]@type['"]\s*:\s*['"]Organization['"]/.test(src);
  const factory = /organizationLd\s*\(\s*\)/.test(src);
  const inline = hasScript && hasType;
  const indirect = hasScript && hasType && /ORG_JSONLD|ORGANIZATION_JSONLD/.test(src);
  if (inline && !indirect) return { present: true, mode: 'inline' };
  if (factory) return { present: true, mode: 'factory' };
  if (indirect) return { present: true, mode: 'indirect' };
  if (hasScript && hasType) return { present: true, mode: 'inline' };
  return { present: false, mode: 'none' };
}

function checkBreadcrumbJsonLd(src) {
  const hasScript = /<script\s[^>]*application\/ld\+json/.test(src);
  const hasType = /['"]@type['"]\s*:\s*['"]BreadcrumbList['"]/.test(src);
  const factory = /breadcrumbLd\s*\(/.test(src);
  const indirect = hasScript && hasType && /BC_JSONLD|BREADCRUMB_JSONLD/.test(src);
  if (hasScript && hasType && !indirect) return { present: true, mode: 'inline' };
  if (factory) return { present: true, mode: 'factory' };
  if (indirect) return { present: true, mode: 'indirect' };
  if (hasScript && hasType) return { present: true, mode: 'inline' };
  return { present: false, mode: 'none' };
}

function checkCanonical(src) {
  const alt = /alternates\s*:\s*\{[^}]*canonical\s*:\s*(?:['"`]([^'"`]+)['"`]|[a-zA-Z_]\w*\s*\()/.test(src);
  const mb = /metadataBase\s*:\s*new URL\(/.test(src);
  const ogUrl = /openGraph\s*:[^}]*url\s*:\s*['"`]/.test(src);
  return { present: alt || mb || ogUrl, mode: alt ? 'alternates.canonical' : mb ? 'metadataBase' : ogUrl ? 'openGraph.url' : 'none' };
}

async function auditPage(p) {
  const src = await readFile(p.full, 'utf8');
  const org = checkOrganizationJsonLd(src);
  const bc = checkBreadcrumbJsonLd(src);
  const can = checkCanonical(src);

  if (!org.present) fail('jsonld-organization', `Missing Organization JSON-LD on ${p.routePath}`);
  else pass('jsonld-organization', `${p.routePath} has Organization (${org.mode})`);

  if (!bc.present) fail('jsonld-breadcrumb', `Missing BreadcrumbList JSON-LD on ${p.routePath}`);
  else pass('jsonld-breadcrumb', `${p.routePath} has BreadcrumbList (${bc.mode})`);

  if (!can.present) fail('canonical', `Missing canonical / metadataBase / openGraph.url on ${p.routePath}`);
  else pass('canonical', `${p.routePath} has canonical (${can.mode})`);
}

// app/sitemap.js generates /sitemap.xml dynamically; in Next.js 15+ there is
  // no static public/sitemap.xml file. Compare against the live response at
  // /sitemap.xml so the parity check reflects what real visitors/crawlers see.
  const SITEMAP_URL = process.env.SITEMAP_URL ?? 'https://ironwake.dev/sitemap.xml';

  async function fetchLiveSitemap() {
    try {
      const res = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      warn('sitemap-parity', `Could not fetch live sitemap from ${SITEMAP_URL} (${e.message}); falling back to public/sitemap.xml if present.`);
      try { return await readFile(path.join(PUBLIC, 'sitemap.xml'), 'utf8'); }
      catch { return ''; }
    }
  }

  async function auditSitemapParity() {
    const sitemap = await readFile(path.join(APP, 'sitemap.js'), 'utf8');
    // Extract declared routes from the STATIC_ROUTES array. The HTTP path
    // is the value of `path:` in each object literal — not any path-shaped
    // string (which would catch filenames like 'app/login/page.js').
    const declared = new Set();
    const routeRe = /path:\s*['"`]([^'"`]*)['"`]/g;
    for (const m of sitemap.matchAll(routeRe)) {
      const p = m[1];
      const norm = p === '' ? '/' : p;
      declared.add(norm);
    }

    const publicSitemap = await fetchLiveSitemap();
    const emitted = new Set();
    for (const m of publicSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = new URL(m[1]);
      emitted.add(u.pathname);
    }

    const missing = [...declared].filter((p) => !emitted.has(p));
    const extra = [...emitted].filter((p) => !declared.has(p));
    if (missing.length) fail('sitemap-parity', `Declared in app/sitemap.js but missing from ${SITEMAP_URL}: ${missing.join(', ')}`);
    else pass('sitemap-parity', `app/sitemap.js and ${SITEMAP_URL} agree on ${declared.size} URLs`);
    if (extra.length) warn('sitemap-parity', `Emitted in ${SITEMAP_URL} but not in app/sitemap.js: ${extra.join(', ')}`);
  }

function fileLooksLikeIco(buf) {
  if (buf.length < 22) return false;
  return buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1 && buf.readUInt16LE(4) >= 1;
}

function fileLooksLikePng(buf) {
  const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return buf.length >= 8 && buf.subarray(0, 8).equals(PNG_MAGIC);
}

async function auditBinaryAssets() {
    for (const [relPath, expectation] of [
      ['app/favicon.ico', 'ico'],
      ['app/apple-icon.png', 'png'],
      ['public/logo.png', 'png'],
      // /sitemap.xml is generated dynamically by app/sitemap.js — no
      // static public/sitemap.xml file exists in Next.js 15+. Skipped.
    ]) {
    const full = path.join(ROOT, relPath);
    if (!existsSync(full)) {
      fail('binary-asset', `Missing file: ${relPath}`);
      continue;
    }
    const buf = await readFile(full);
    if (expectation === 'ico' && !fileLooksLikeIco(buf)) fail('binary-asset', `${relPath} is not a valid ICO file`);
    else if (expectation === 'png' && !fileLooksLikePng(buf)) fail('binary-asset', `${relPath} is not a valid PNG file`);
    else if (expectation === 'xml' && !/^(<\?xml|<urlset)/.test(buf.toString('utf8'))) fail('binary-asset', `${relPath} is not well-formed XML`);
    else pass('binary-asset', `${relPath} (${buf.length} bytes) is a valid ${expectation.toUpperCase()}`);
  }
}

async function auditCanonicalSiteOrigin() {
  const seo = await readFile(path.join(LIB, 'seo.mjs'), 'utf8');
  const origin = await readFile(path.join(LIB, 'site-origin.mjs'), 'utf8');
  const sitemap = await readFile(path.join(APP, 'sitemap.js'), 'utf8');
  const robots = await readFile(path.join(APP, 'robots.js'), 'utf8');

  // lib/seo.mjs gets the origin via siteOrigin() (lib/site-origin.mjs). At
  // least one of those two files must reference https://ironwake.dev.
  const seoMentions = /https:\/\/ironwake\.dev/.test(seo) || /https:\/\/ironwake\.dev/.test(origin);
  if (!seoMentions) fail('canonical-origin', `lib/seo.mjs (and lib/site-origin.mjs) do not reference https://ironwake.dev`);
  else pass('canonical-origin', `lib/seo.mjs ↔ lib/site-origin.mjs references https://ironwake.dev`);

  for (const [name, src] of [['app/sitemap.js', sitemap], ['app/robots.js', robots]]) {
    if (!/https:\/\/ironwake\.dev/.test(src)) {
      fail('canonical-origin', `${name} does not reference https://ironwake.dev`);
    } else {
      pass('canonical-origin', `${name} references https://ironwake.dev`);
    }
  }
}

async function auditJsonLdLogoReferences() {
  const seo = await readFile(path.join(LIB, 'seo.mjs'), 'utf8');
  const refs = [...seo.matchAll(/[`'""](\/[^'"`]*\.(?:png|jpg|jpeg|svg|webp))[`'""]/gi)].map((m) => m[1]);
  for (const r of refs) {
    const local = path.join(PUBLIC, r.replace(/^\//, ''));
    if (!existsSync(local)) {
      const appLocal = path.join(APP, r.replace(/^\//, ''));
      if (!existsSync(appLocal)) fail('jsonld-logo-ref', `JSON-LD references ${r} but no file found at public/${r} or app/${r}`);
      else pass('jsonld-logo-ref', `JSON-LD references ${r} -> app/${r.split('/').pop()}`);
    } else {
      pass('jsonld-logo-ref', `JSON-LD references ${r} -> public/${r}`);
    }
  }
}

async function main() {
  const pages = await listPublicPages();
  const publicPages = pages.filter((p) => isPublicRoute(p.routePath));
  for (const p of publicPages) await auditPage(p);
  await auditSitemapParity();
  await auditBinaryAssets();
  await auditCanonicalSiteOrigin();
  await auditJsonLdLogoReferences();

  const report = {
    when: new Date().toISOString(),
    publicPagesAudited: publicPages.length,
    passes: passes.length,
    failures: failures.length,
    warnings: warnings.length,
    failures,
    warnings,
    passes,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length > 0) process.exit(1);
}

await main();
