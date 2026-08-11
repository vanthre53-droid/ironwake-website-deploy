import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Section 26 portfolio link regression assertion.
// IronWake source MUST reference exactly the 9 protected Vercel URLs and
// MUST NOT invent P5 or replace any URL. Detects accidental replacement,
// typo, wrong Vercel project, or missing portfolio link.

const PROTECTED = [
  'https://rapidpulse-plumbing.vercel.app',
  'https://bristol-architectural.vercel.app',
  'https://manchester-gentle-dental.vercel.app',
  'https://bluestone-jewellery-prototype.vercel.app',
  'https://luxe-studio-wine.vercel.app',
  'https://bramble-cafe.vercel.app',
  'https://voltix-fawn.vercel.app',
  'https://re-tech-umber.vercel.app',
  'https://atelier-luxury-salon.vercel.app',
];

const SCAN_ROOTS = ['app', 'content', 'lib'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'graphify-out', '.ironwake', '.netlify', '.wrangler']);
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json', '.md']);

// ponytail: test files contain env fixtures (e.g. candidate.netlify.app). The
// portfolio-link contract applies to production source, not tests.
function isTestFile(p) {
  return p.includes('/__tests__/') || /\.(test|spec)\.[cm]?[jt]sx?$/.test(p);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (EXTS.has(full.slice(full.lastIndexOf('.'))) && !isTestFile(full)) out.push(full);
  }
  return out;
}

const sources = SCAN_ROOTS.flatMap((r) => walk(r));

test('portfolio link contract: all 9 protected URLs are referenced in main source', () => {
  for (const url of PROTECTED) {
    const found = sources.some((f) => readFileSync(f, 'utf8').includes(url));
    assert.equal(found, true, `Missing reference to ${url}`);
  }
});

test('portfolio link contract: no P5 placeholder URL is invented', () => {
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    // No "p5" subdomains, no generic placeholder. Allow only exact protected hostnames.
    const matches = text.match(/https:\/\/[a-z0-9-]+\.vercel\.app/g) || [];
    for (const m of matches) {
      assert.ok(
        PROTECTED.includes(m),
        `Unexpected portfolio URL ${m} in ${relative(process.cwd(), file)}`
      );
    }
  }
});

test('portfolio link contract: no portfolio link references a non-vercel host', () => {
  // Allow the canonical main host and any protected portfolio alias.
  const ALLOWED_HOSTS = new Set([
    'ironwake-system.netlify.app',
    'ironwake-site.netlify.app',
    ...PROTECTED.map((u) => new URL(u).host),
  ]);
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    const matches = text.match(/https:\/\/[a-z0-9.-]+/gi) || [];
    for (const m of matches) {
      const host = m.replace(/^https:\/\//, '').split('/')[0];
      if (host.endsWith('.vercel.app') || host.endsWith('.netlify.app')) {
        assert.ok(ALLOWED_HOSTS.has(host), `Unexpected host ${host} in ${relative(process.cwd(), file)}`);
      }
    }
  }
});