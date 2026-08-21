// V15 §122 regression: high-risk canonical-brand and language contracts.
// Locks the unlocked production surface so the brand rename
// (IronWake Systems → IronWake) and the §127 demo-language swap
// (workflow mapping / pre-launch / capability demo) stay corrected.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKED = new Set([
  'app/globals.css',
  'app/layout.js',
  'app/page.js',
  'app/components/FlagshipHero.js',
  'app/components/DashboardDemo.js',
]);

const SAFE_RESTATEMENT_DIRS = ['lib/canonical-entity', 'lib/ironwake-ai-query-regression', 'lib/contradiction-gate'];

function isSafeRestatement(relPath) {
  if (relPath.endsWith('.md')) return true;
  return SAFE_RESTATEMENT_DIRS.some((d) => relPath.startsWith(d));
}

async function readAppFiles() {
  const out = [];
  const appDir = join(ROOT, 'app');
  async function visit(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await visit(full);
      } else if (e.isFile()) {
        const s = await stat(full);
        out.push({ rel: full.slice(ROOT.length), size: s.size });
      }
    }
  }
  await visit(appDir);
  return out;
}

let CACHED_FILES = null;
async function getAppFiles() {
  if (!CACHED_FILES) CACHED_FILES = await readAppFiles();
  return CACHED_FILES;
}

test('canonical-brand-contract: §86 IronWake Systems must not appear in unlocked production source', async () => {
  const offenders = [];
  for (const { rel } of await getAppFiles()) {
    if (LOCKED.has(rel)) continue;
    if (isSafeRestatement(rel)) continue;
    const text = await readFile(join(ROOT, rel), 'utf8');
    if (text.includes('IronWake Systems')) offenders.push(rel);
  }
  assert.deepEqual(offenders, [], `Found §86 brand rename in unlocked source: ${offenders.join(', ')}`);
});

test('canonical-brand-contract: §127 workflow mapping must not appear as company identity', async () => {
  const offenders = [];
  for (const { rel } of await getAppFiles()) {
    if (LOCKED.has(rel)) continue;
    if (isSafeRestatement(rel)) continue;
    const text = await readFile(join(ROOT, rel), 'utf8');
    if (text.toLowerCase().includes('workflow mapping')) offenders.push(rel);
  }
  assert.deepEqual(offenders, [], `Found §127 workflow mapping phrase in unlocked source: ${offenders.join(', ')}`);
});

test('canonical-brand-contract: §127 whole-site demo labelling forbidden; per-page capability demonstrations stay allowed', async () => {
  // V15 §87/§127: never erase truthful demo disclosure. Correct only the
  // phrases that label the whole site as a noncommercial demo.
  // Forbidden: "this site is a capability demo", "running in pre-launch mode",
  // "the site is a pre-launch demo".
  // Allowed: per-page "capability demonstration" labels on /work/* portfolio
  // disclosure boxes (these are mandated truthful demo disclosure).
  const offenders = [];
  for (const { rel } of await getAppFiles()) {
    if (LOCKED.has(rel)) continue;
    if (isSafeRestatement(rel)) continue;
    const text = await readFile(join(ROOT, rel), 'utf8');
    const lower = text.toLowerCase();
    if (
      lower.includes('this site is a capability demo') ||
      lower.includes('running in pre-launch mode') ||
      /\bthis site\b.{0,80}\bpre-launch\b/.test(lower)
    ) offenders.push(rel);
  }
  assert.deepEqual(offenders, [], `Found §127 whole-site demo label in unlocked source: ${offenders.join(', ')}`);
});

test('canonical-brand-contract: §102 navigation exposes /services + /verification entry points', async () => {
  const header = await readFile(join(ROOT, 'app/components/SiteHeader.js'), 'utf8');
  const footer = await readFile(join(ROOT, 'app/components/SiteFooter.js'), 'utf8');
  assert.match(header, /\['\/services', 'Services'\]/);
  assert.match(header, /\['\/verification', 'Proof'\]/);
  // SiteFooter links are stored as objects: { href, label }
  assert.match(footer, /href:\s*'\/services'/);
  assert.match(footer, /href:\s*'\/verification'/);
});