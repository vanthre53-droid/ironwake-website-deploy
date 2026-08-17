// ponytail: SEO content audit — runs without a network.
// Checks content quality signals on every public page.js:
//   1. Title: 30-65 chars recommended (warn outside).
//   2. Description: 70-200 chars recommended (warn outside).
//   3. Proof-of-work links: each "claim" page should reference at least one
//      link to /work/<slug> or /audit or /scope.
//   4. Legal pages (terms, privacy) are exempt from proof requirements.
//   5. No 'lorem' placeholder text.
//
// Exits 0 on clean, 1 on any failure.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const APP = path.join(ROOT, 'app');

const SKIP_PATH_PATTERNS = [
  /\/auth\//, /\/owner\//, /^\/login\//, /^\/forgot-password\//, /^\/signup\//,
  /^\/update-password\//, /^\/account\//, /^\/admin\//, /^\/chat\//, /^\/api\//,
];

const LEGAL_PAGES = new Set(['/terms', '/privacy']);

const failures = [];
const warnings = [];
const passes = [];

function fail(c, d) { failures.push({ check: c, detail: d }); }
function warn(c, d) { warnings.push({ check: c, detail: d }); }
function pass(c, d) { passes.push({ check: c, detail: d }); }

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
        const rel = path.relative(APP, full).replace(/\\/g, '/');
        let route = '/' + rel.replace(/page\.js$/, '').replace(/\[(\.\.\.)?([^\]]+)\]/g, (_, dots, k) => (dots ? '*' : ':') + k);
        if (route.endsWith('/')) route = route.slice(0, -1);
        out.push({ full, route });
      }
    }
  }
  await walk(APP);
  return out;
}

function isPublicRoute(route) {
  if (route === '/' || route === '') return true;
  const first = route.split('/').filter(Boolean)[0];
  return !SKIP_PATH_PATTERNS.some((p) => p.test('/' + first + '/'));
}

function firstString(src, key) {
  const re = new RegExp('(?:^|[\\s,{(])' + key + '\\s*:\\s*([\'"\`])([^\'"\`]+)\\1', 'm');
  const m = src.match(re);
  return m ? m[2] : null;
}

function getString(src, key) {
  return firstString(src, key);
}

async function auditPage(p) {
  const src = await readFile(p.full, 'utf8');

  const title = getString(src, 'title');
  if (!title) fail('title', p.route + ' has no title');
  else if (title.length < 30) warn('title', p.route + ' title is only ' + title.length + ' chars (target 30-65): "' + title + '"');
  else if (title.length > 65) warn('title', p.route + ' title is ' + title.length + ' chars (target 30-65): "' + title + '"');
  else pass('title', p.route + ' title (' + title.length + ' chars)');

  const desc = getString(src, 'description') || /description:\s*[a-zA-Z_][\w.]*/.test(src);
  if (!desc) fail('description', p.route + ' has no description');
  else if (desc.length < 70) warn('description', p.route + ' description is ' + desc.length + ' chars (target 70-200)');
  else if (desc.length > 200) warn('description', p.route + ' description is ' + desc.length + ' chars (target 70-200)');
  else pass('description', p.route + ' description (' + desc.length + ' chars)');

  const isLegal = LEGAL_PAGES.has(p.route);
  if (!isLegal) {
    const hasProofLink = /href\s*=\s*['"`](?:\/work\/[a-z0-9-]+|\/audit|\/scope)/i.test(src);
    if (!hasProofLink) warn('proof-link', p.route + ' has no internal proof-of-work link to /work/*, /audit, or /scope');
    else pass('proof-link', p.route + ' has at least one proof-of-work link');
  }

  if (/\bLorem\b/i.test(src)) {
    fail('placeholder', p.route + ' contains "Lorem" placeholder text');
  } else {
    pass('placeholder', p.route + ' no lorem placeholder');
  }
}

async function main() {
  const pages = (await listPublicPages()).filter((p) => isPublicRoute(p.route));
  for (const p of pages) await auditPage(p);

  const report = {
    when: new Date().toISOString(),
    pagesAudited: pages.length,
    passes: passes.length,
    warnings: warnings.length,
    failures: failures.length,
    failures,
    warnings,
    passes,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length > 0) process.exit(1);
}

await main();
