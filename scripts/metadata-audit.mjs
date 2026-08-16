// ponytail: per-page metadata audit. For every indexed page.js in app/,
// assert:
//   1. export const metadata exists with a unique title
//   2. description is set and non-empty
//   3. openGraph { title, description, url, type } is present
//   4. JSON-LD structured data is present (via <script type="application/ld+json">)

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

// Route is noindex if any page.js or layout.js up the chain has robots: { index: false }
function routeIsNoindex(route) {
  const candidates = [];
  if (route === '/') {
    candidates.push('app/page.js', 'app/layout.js');
  } else {
    candidates.push('app' + route + '/page.js');
    let dir = 'app' + route;
    while (dir.length > 3) {
      candidates.push(dir + '/layout.js');
      dir = dir.replace(/\/[^/]+$/, '');
    }
  }
  for (const c of candidates) {
    if (existsSync(c) && NOINDEX_RE.test(readFileSync(c, 'utf8'))) return true;
  }
  return false;
}

const pageFiles = findAllPageFiles('app');
const findings = [];
const titles = {};
const descriptions = {};

for (const pf of pageFiles) {
  const src = readFileSync(pf, 'utf8');
  const route = '/' + pf.replace(/^app\//, '').replace(/\/page\.js$/, '');
  // Strip /index from trailing
  const cleanRoute = route.replace(/\/index$/, '');

  // Skip noindex pages (they may omit metadata — handled by layout)
  if (routeIsNoindex(cleanRoute)) continue;

  // 1. unique title
  const titleMatch = src.match(/title:\s*['"`]([^'"`]+)['"`]/);
  if (!titleMatch) {
    findings.push({ kind: 'metadata-missing-title', severity: 'error', file: pf, route: cleanRoute, detail: 'no title found in metadata' });
  } else {
    const title = titleMatch[1];
    if (titles[title]) {
      findings.push({ kind: 'metadata-duplicate-title', severity: 'error', file: pf, route: cleanRoute, detail: `title duplicates ${titles[title]}` });
    }
    titles[title] = pf;
  }

  // 2. description
  const descMatch = src.match(/description:\s*['"`]([^'"`]+)['"`]/);
  if (!descMatch) {
    findings.push({ kind: 'metadata-missing-description', severity: 'error', file: pf, route: cleanRoute, detail: 'no description found in metadata' });
  } else {
    const desc = descMatch[1];
    if (descriptions[desc]) {
      findings.push({ kind: 'metadata-duplicate-description', severity: 'warning', file: pf, route: cleanRoute, detail: `description duplicates ${descriptions[desc]}` });
    }
    descriptions[desc] = pf;
  }

  // 3. openGraph
  if (!/openGraph:\s*\{/.test(src)) {
    findings.push({ kind: 'metadata-missing-opengraph', severity: 'warning', file: pf, route: cleanRoute, detail: 'no openGraph block' });
  }

  // 4. JSON-LD structured data
  if (!/application\/ld\+json/.test(src)) {
    findings.push({ kind: 'metadata-missing-jsonld', severity: 'warning', file: pf, route: cleanRoute, detail: 'no JSON-LD structured data' });
  }
}

const errors = findings.filter(f => f.severity === 'error');
const audit = {
  scannedAt: new Date().toISOString(),
  pageFilesAudited: pageFiles.length,
  uniqueTitles: Object.keys(titles).length,
  issueCount: errors.length,
  warningCount: findings.filter(f => f.severity === 'warning').length,
  issues: errors,
  details: findings,
};
console.log(JSON.stringify(audit, null, 2));
process.exit(errors.length === 0 ? 0 : 1);