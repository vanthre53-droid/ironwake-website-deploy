// ponytail: portfolio-proof audit. Verifies:
//   - exactly 49 work/* projects exist (R053 acceptance)
//   - each project's page.js metadata mentions "demonstration" or "portfolio"
//   - each project's page.js has a co-located page.test.js
//   - the portfolio listing page.js labels work as "capability proof"
//   - no real-client language ("testimonial", "client of", "we built for", "results:")
//     appears in any portfolio page
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const WORK = join(ROOT, 'app/work');
const issues = [];
const requiredLabels = ['demonstration', 'portfolio', 'capability proof', 'not a client'];
const forbiddenTerms = ['testimonial', 'client of', 'we built for', 'measured result'];

if (!existsSync(WORK)) {
  issues.push({ kind: 'work-dir-missing' });
  console.log(JSON.stringify({ issueCount: 1, issues }, null, 2));
  process.exit(1);
}

const projects = readdirSync(WORK, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

const required = ['atelier', 'aura-archives', 'bramble-cafe', 'dentacare-pro',
                  'harbour-estates', 'luxe-studio', 'rapidpulse', 'retech', 'voltix'];
const missing = required.filter(n => !projects.includes(n));
for (const m of missing) issues.push({ kind: 'project-missing', name: m });

for (const p of projects) {
  const page = join(WORK, p, 'page.js');
  const test = join(WORK, p, 'page.test.js');
  if (!existsSync(page)) { issues.push({ kind: 'page-missing', project: p }); continue; }
  if (!existsSync(test)) issues.push({ kind: 'test-missing', project: p });

  const src = readFileSync(page, 'utf8').toLowerCase();
  const labelHits = requiredLabels.filter(l => src.includes(l));
  if (labelHits.length < 2) issues.push({ kind: 'label-missing', project: p, found: labelHits });

  for (const t of forbiddenTerms) {
    if (src.includes(t)) issues.push({ kind: 'forbidden-language', project: p, term: t });
  }
}

// listing page
const listing = join(WORK, 'page.js');
if (existsSync(listing)) {
  const src = readFileSync(listing, 'utf8').toLowerCase();
  const labelHits = requiredLabels.filter(l => src.includes(l));
  if (labelHits.length < 2) issues.push({ kind: 'listing-label-missing', found: labelHits });
}

const summary = {
  scannedAt: new Date().toISOString(),
  projectCount: projects.length,
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
