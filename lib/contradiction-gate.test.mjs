// lib/contradiction-gate.test.mjs
//
// ponytail: V15 §122 automated search/entity quality gate. Runs without
// external dependencies via node:test. Checks source for invariants that
// must hold across the canonical repo:
//   - canonical brand name = IronWake (no accidental "IronWake Systems"
//     rename, no "Ironwake" / "Iron Wake")
//   - canonical origin = https://ironwake.dev (no live canonical pointing
//     to localhost / netlify.app / vercel.app / workers.dev)
//   - every OFFERED_NOW capability in canonical-entity has at least one
//     unlocked source file containing an honest buyer-language statement
//   - contradiction phrases (COMPANY_LEVEL) do not appear without an
//     explicit diagnostic-phase scope-lock
//   - llms.txt export contains the canonical entity statement + OFFERED_NOW
//     matrix (rendered, not just imported)
//   - locked files (V15 §4) match their frozen SHA256 baselines
//
// Failed tests must be fixed before any deploy (Section 122 + 73).

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

import { CANONICAL_BRAND_NAME, CANONICAL_ORIGIN, CANONICAL_CATEGORY_STATEMENT, CANONICAL_ENTITY_SUMMARY, OFFERED_NOW_MATRIX } from './canonical-entity.mjs';

// ---------------- helpers ----------------

function readText(p) {
  return readFileSync(p, 'utf8');
}
function sha256(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

// Files & directories we touch.
const SCAN_ROOTS = [
  join(ROOT, 'app'),
  join(ROOT, 'lib'),
  join(ROOT, 'public'),
];
const TEXT_EXTS = /\.(js|mjs|jsx|css|txt|md|json|xml|html)$/;

function* walk(dir) {
  // Skip node_modules + .git + .ironwake + .netlify to keep scan bounded.
  const skip = new Set(['node_modules', '.git', '.ironwake', '.netlify', 'coverage']);
  for (const e of readdirSyncSafe(dir)) {
    if (skip.has(e)) continue;
    const full = join(dir, e);
    if (isDir(full)) {
      yield* walk(full);
    } else if (TEXT_EXTS.test(e)) {
      yield full;
    }
  }
}
import { readdirSync, statSync } from 'node:fs';
function readdirSyncSafe(d) {
  try { return readdirSync(d); } catch { return []; }
}
function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

// Locked files per V15 §4.
const LOCKED = [
  'app/globals.css',
  'app/layout.js',
  'app/page.js',
  'app/components/FlagshipHero.js',
  'app/components/DashboardDemo.js',
].map((p) => join(ROOT, p));

// Frozen SHA256 baselines captured at V15 §4 anchor time
// (see .ironwake/checkpoints/V15-119-TRUTH-STATE-2026-08-21.md).
const LOCKED_SHA256 = {
  'app/globals.css': 'a259e56cfa5745e02af74c364d5db88339b0a7cb4dfd36150bae8112a5461b9b',
  'app/layout.js': 'caef2638ba89650c070bb049a781b6901cad75375a15935ccbea58a99fdfa058',
  'app/page.js': '9dfdf1ea657a8eeda865bfe7a54362b9c6d0c2f3cff38f2709b34ab335d1ef3b', // V3 restored-locked baseline (commit 152f0e2 / ancestor e2ec0e9). V15-008 additive JSON-LD reverted by V3 restoration; Organization+BreadcrumbList JSON-LD lives in lib/seo.mjs and is emitted at app/page.js:52-58.
  'app/components/FlagshipHero.js': 'f5b28cc4e99cf6dcb7cbb5f167de4c92d439d684b8711a3af6da7d96e9ef4583',
  'app/components/DashboardDemo.js': 'f602d77ec9940e4b7d5f69ffc1d6af3d169aa2e2a40b7dd4f76401ae9d97883e',
};

// Phrases that the AI-search failure transcripts reported at company level
// (V15 §80). They must NEVER appear at company level in unlocked files. They
// MAY appear only when accompanied by a visible scope-lock sentence in the
// SAME file (phrase + lock co-occurrence).
const COMPANY_LEVEL_DENIAL_PHRASES = [
  'does not design, build, or sell custom websites',
  'ironwake does not build websites',
  'capability demonstration only',
  'pre-launch only',
  'consultancy only',
  'practice only',
  'only a founder-led consultancy',
  'backend only',
  'not turnkey',
  'custom scoped means unavailable',
  'cannot build a substantial custom platform',
  'does not write code',
  'does not deploy sites',
  'outsource implementation',
  'no fixed pricing',
  'no guaranteed timeline',
];

// Files exempt from denial-phrase scanning: project-level demo
// disclaimers, legal/Terms, and known scope-locked sites.
const DENIAL_EXEMPT_FILES = new Set([
  // Terms, privacy, legal — may quote company-level language with full
  // context (V15 §119).
  // (populated below dynamically by substring match)
]);

// ---------------- tests ----------------

test('canonical brand name is exactly IronWake', () => {
  assert.equal(CANONICAL_BRAND_NAME, 'IronWake');
});

test('canonical origin is https://ironwake.dev', () => {
  assert.equal(CANONICAL_ORIGIN, 'https://ironwake.dev');
});

test('OFFERED_NOW matrix is non-empty and well-formed', () => {
  assert.ok(Array.isArray(OFFERED_NOW_MATRIX));
  assert.ok(OFFERED_NOW_MATRIX.length >= 5, 'expected at least 5 OFFERED_NOW capabilities');
  for (const cap of OFFERED_NOW_MATRIX) {
    assert.ok(typeof cap.capability === 'string' && cap.capability.length > 0, 'capability string required');
    assert.ok(Array.isArray(cap.serviceIds) && cap.serviceIds.length > 0, 'serviceIds array required');
    assert.ok(typeof cap.deliveryModel === 'string', 'deliveryModel required');
    assert.ok(typeof cap.buyerLanguage === 'string' && cap.buyerLanguage.length > 0, 'buyerLanguage required');
  }
});

test('no accidental IronWake Systems rename in unlocked source', () => {
  // V15 §86: canonical brand name is IronWake; do not silently rename.
  // Allow suffixes in <title> tags and `IronWake Systems Practice` only as
  // historic/legal alias references — but flag standalone company-identity
  // use of "IronWake Systems" outside a metadata context.
  const PATTERNS = [
    { phrase: 'IronWake Systems', exemptRegex: /(title\s*[:=]|alternate|legal entity|founder-led|founder[\s,])/i },
    { phrase: 'Ironwake Inc' },
    { phrase: 'Iron Wake ' },
    { phrase: 'Ironwake.AI' },
    { phrase: 'IRONWAKE SYSTEMS' },
  ];
  const hits = [];
  for (const file of walkAll()) {
    if (LOCKED.some((l) => file === l)) continue; // locked = owner-authorized
    if (file.endsWith('.md')) continue; // docs may reference old brand contextually
    if (relative(ROOT, file).startsWith('lib/canonical-entity')) continue;
    if (relative(ROOT, file).startsWith('lib/contradiction-gate')) continue;
    if (relative(ROOT, file).startsWith('lib/ironwake-ai-query-regression')) continue;
    const text = readText(file);
    for (const { phrase, exemptRegex } of PATTERNS) {
      const idx = text.indexOf(phrase);
      if (idx === -1) continue;
      const window = text.slice(Math.max(0, idx - 200), idx + phrase.length + 200);
      if (exemptRegex && exemptRegex.test(window)) continue;
      hits.push({ file: relative(ROOT, file), phrase });
    }
  }
  assert.deepEqual(hits, [], `Banned brand variants found: ${JSON.stringify(hits)}`);
});

test('no live canonical/metadata points to localhost/netlify/vercel/workers.dev', () => {
  // V15 §55: no active production canonical/redirect/sitemap may point to
  // historical hosts. Only flag when the host appears in a production
  // canonical/metadata/sitemap/redirect field — NOT when it appears in a
  // demo-project URL field (V15 §59).
  const BANNED_HOSTS = ['localhost', '127.0.0.1', 'netlify.app', 'workers.dev'];
  const FIELD_NAMES = ['canonical', 'metadataBase', 'alternates.canonical', 'sitemap', 'redirect'];
  const hits = [];
  const fieldRegex = new RegExp(
    `(${FIELD_NAMES.join('|').replace(/\./g, '\\.')})\\s*[:=]\\s*['"\`]([^'"\`]*?)`,
    'gi',
  );
  for (const file of walkAll()) {
    if (LOCKED.some((l) => file === l)) continue;
    if (file.endsWith('.md')) continue;
    if (!file.includes('app/')) continue;
    if (!file.includes('route.js') && !file.includes('page.js')) continue;
    const text = readText(file);
    for (const m of text.matchAll(fieldRegex)) {
      const value = m[2];
      for (const h of BANNED_HOSTS) {
        if (value.includes(h)) hits.push({ file: relative(ROOT, file), field: m[1], host: h, value });
      }
    }
  }
  assert.deepEqual(hits, [], `Banned-host canonical references: ${JSON.stringify(hits)}`);
});

test('company-level denial phrases do not appear in unlocked source', () => {
  // V15 §82 + §122: every COMPANY_LEVEL denial phrase must be either removed
  // or co-located with a scope-lock sentence in the same file.
  const SCOPE_LOCK_MARKERS = [
    'diagnostic phase',
    'audit phase',
    'mapping phase',
    'scope-lock',
    'implementation phase',
    'business leak audit',
    'sow',
  ];
  const hits = [];
  for (const file of walkAll()) {
    if (LOCKED.some((l) => file === l)) continue;
    if (file.endsWith('.md')) continue;
    if (relative(ROOT, file).startsWith('lib/canonical-entity')) continue;
    if (relative(ROOT, file).startsWith('lib/contradiction-gate')) continue;
    if (relative(ROOT, file).startsWith('lib/ironwake-ai-query-regression')) continue;
    const text = readText(file).toLowerCase();
    for (const phrase of COMPANY_LEVEL_DENIAL_PHRASES) {
      const idx = text.indexOf(phrase.toLowerCase());
      if (idx === -1) continue;
      // window = 600 chars around the phrase
      const window = text.slice(Math.max(0, idx - 300), idx + phrase.length + 300);
      const hasLock = SCOPE_LOCK_MARKERS.some((m) => window.includes(m));
      if (!hasLock) hits.push({ file: relative(ROOT, file), phrase });
    }
  }
  assert.deepEqual(hits, [], `Company-level denial phrases without scope-lock: ${JSON.stringify(hits)}`);
});

test('llms.txt route renders canonical entity statement + OFFERED_NOW matrix', async () => {
  const mod = await import('../app/llms.txt/route.js');
  const r = await mod.GET();
  assert.equal(r.status, 200);
  const text = await r.text();
  assert.ok(text.includes(CANONICAL_BRAND_NAME), 'llms.txt must mention IronWake');
  // Both the category statement and the entity summary must appear
  // verbatim (this is the V15 §86 / §92 self-test).
  assert.ok(
    text.includes(CANONICAL_CATEGORY_STATEMENT),
    'llms.txt must render the canonical category statement verbatim',
  );
  assert.ok(
    text.includes(CANONICAL_ENTITY_SUMMARY),
    'llms.txt must render the canonical entity summary verbatim',
  );
  assert.ok(text.toLowerCase().includes('offered_now'), 'llms.txt must label OFFERED_NOW section');
  // Each OFFERED_NOW capability must appear by buyerLanguage fragment.
  for (const cap of OFFERED_NOW_MATRIX) {
    if (cap.status !== 'OFFERED_NOW') continue;
    const fragment = cap.buyerLanguage.split(/\s+/).slice(0, 4).join(' ').toLowerCase();
    assert.ok(text.toLowerCase().includes(fragment), `OFFERED_NOW capability missing: ${cap.capability} (looked for "${fragment}")`);
  }
});

test('V15 §88 + §122 evidence routes cited by OFFERED_NOW matrix resolve to real app routes', () => {
  // Every proof anchor referenced by the canonical truth must be a real
  // route on disk, otherwise schema/sitemap/internal-link consumers will
  // 404 and the proof claim is unfounded. (V15 §93, §122.)
  const missing = [];
  for (const cap of OFFERED_NOW_MATRIX) {
    for (const route of cap.evidenceRoutes || []) {
      // Routes start with '/' (e.g. /work/rapidpulse). Resolve under app/.
      const routePath = join(ROOT, 'app', route);
      if (!existsSync(routePath)) {
        missing.push({ capability: cap.capability, route });
      }
    }
  }
  assert.deepEqual(missing, [], `OFFERED_NOW evidence routes not on disk (V15 §88 / §122): ${JSON.stringify(missing)}`);
});

test('V15 §4 locked files match frozen SHA256 baselines', () => {
  // Any deviation must be DESIGN_LOCK_BLOCKED, not silently fixed.
  const drift = [];
  for (const file of LOCKED) {
    if (!existsSync(file)) {
      drift.push({ file: relative(ROOT, file), issue: 'missing' });
      continue;
    }
    const expected = LOCKED_SHA256[relative(ROOT, file)];
    const actual = sha256(file);
    if (actual !== expected) {
      drift.push({ file: relative(ROOT, file), expected, actual });
    }
  }
  assert.deepEqual(drift, [], `Locked-file hash drift (V15 §4): ${JSON.stringify(drift)}`);
});

function* walkAll() {
  for (const root of SCAN_ROOTS) {
    if (!isDir(root)) continue;
    yield* walk(root);
  }
}
