// ponytail: cross-check the sitemap against pages that opt out of indexing.
// Any page with `robots: { index: false }` must NOT appear in the sitemap.
// Any page in the sitemap must have a real page.js (or be served by a dynamic
// [slug] route whose ARTICLES array contains the slug).

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const NOINDEX_RE = /robots:\s*\{\s*index:\s*false/;

function findAllPageFiles(dir = 'app', acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      findAllPageFiles(p, acc);
    } else if (entry.name === 'page.js') {
      acc.push(p);
    }
  }
  return acc;
}

// dynamicDirs: pages that serve many URLs via [slug]/page.js
const dynamicDirs = readdirSync('app', { withFileTypes: true })
  .filter(e => e.isDirectory() && existsSync(join('app', e.name, '[slug]', 'page.js')))
  .map(e => join('app', e.name, '[slug]', 'page.js'));

function isServedByDynamic(route) {
  for (const dp of dynamicDirs) {
    const src = readFileSync(dp, 'utf8');
    const m = dp.match(/app\/([^/]+)\/\[slug\]/);
    if (!m) continue;
    const prefix = '/' + m[1];
    if (route.startsWith(prefix + '/')) {
      const slug = route.slice(prefix.length + 1);
      if (new RegExp(`slug:\\s*['"\`]${slug}['"\`]`).test(src)) return true;
    }
  }
  return false;
}

// Discovery: walk app/ for page.js with noindex
const pageFiles = findAllPageFiles('app');
const noindexPages = []; // { route, file }
for (const pf of pageFiles) {
  const src = readFileSync(pf, 'utf8');
  if (!NOINDEX_RE.test(src)) continue;
  const route = '/' + pf.replace(/^app\//, '').replace(/\/page\.js$/, '');
  noindexPages.push({ route, file: pf });
}

// Discover the sitemap URL inventory by parsing app/sitemap.js for the
// path strings it lists. This is sufficient — we don't need to actually
// run the Next.js route.
const sitemapSrc = readFileSync('app/sitemap.js', 'utf8');
const sitemapPaths = [...sitemapSrc.matchAll(/path:\s*'([^']+)'/g)].map(m => m[1]);
const sitemapUrls = sitemapPaths.map(p => 'https://ironwake.dev' + p);

const findings = [];
// 1. noindex pages must NOT be in sitemap
for (const { route, file } of noindexPages) {
  if (sitemapPaths.includes(route)) {
    findings.push({ kind: 'sitemap-noindex', severity: 'error', file, route, detail: 'page has noindex but is listed in sitemap' });
  }
}
// 2. sitemap routes must resolve to a real page file or a dynamic route
for (const path_ of sitemapPaths) {
  const file = 'app' + (path_ === '' ? '/page.js' : path_ + '/page.js');
  if (!existsSync(file) && !isServedByDynamic(path_)) {
    findings.push({ kind: 'sitemap-missing-page', severity: 'error', file, route: path_, detail: 'sitemap lists a route whose page.js is missing and no dynamic route serves it' });
  }
}

const errors = findings.filter(f => f.severity === 'error');
const audit = {
  scannedAt: new Date().toISOString(),
  sitemapUrls: sitemapUrls.length,
  noindexPagesFound: noindexPages.length,
  issueCount: errors.length,
  issues: errors,
  details: findings,
};
console.log(JSON.stringify(audit, null, 2));
process.exit(errors.length === 0 ? 0 : 1);