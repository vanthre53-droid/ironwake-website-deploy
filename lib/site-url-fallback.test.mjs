// ponytail: regression test for hostname hygiene.
// (1) All site-URL fallbacks must NOT hardcode the old ironwake-system.netlify.app host.
// (2) All site-URL fallbacks must NOT contain the old site id 1927c0b3-532f-469c-b302-1d96cb9c7367.
// (3) Production canonical origin must be the source of truth: FALLBACK_SITE_URL
//     must resolve to https://ironwake.dev when NEXT_PUBLIC_SITE_URL is unset.
//     The implementation may use either:
//       - `FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwake.dev'`
//       - `FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN`
//         where PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev' is declared in the same file.
//     Either form must include a hard-coded production canonical fallback so
//     metadataBase never falls back to localhost when the env is unset.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FORBIDDEN_HOSTS = ['ironwake-system.netlify.app'];
const FORBIDDEN_IDS = ['1927c0b3-532f-469c-b302-1d96cb9c7367'];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx|md|json)$/.test(entry.name)) yield full;
  }
}

test('hostname hygiene: no hardcoded old ironwake-system host in app/ source', async () => {
  const offenders = [];
  const root = fileURLToPath(new URL('../app', import.meta.url));
  for await (const file of walk(root)) {
    const text = await readFile(file, 'utf8');
    for (const host of FORBIDDEN_HOSTS) {
      if (text.includes(host)) offenders.push(`${file} contains ${host}`);
    }
    for (const id of FORBIDDEN_IDS) {
      if (text.includes(id)) offenders.push(`${file} contains ${id}`);
    }
  }
  assert.equal(offenders.length, 0, offenders.join('\n'));
});

test('hostname hygiene: production canonical origin is the FALLBACK_SITE_URL default', async () => {
  for (const path of ['app/layout.js', 'app/sitemap.js', 'app/robots.js']) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    // form A: inline literal fallback
    const inlineMatch = source.match(/FALLBACK_SITE_URL\s*=\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\|\|\s*['"]https:\/\/ironwake\.dev['"]/);
    // form B: identifier fallback declared in the same file
    const identifierMatch = source.match(/FALLBACK_SITE_URL\s*=\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\|\|\s*PRODUCTION_CANONICAL_ORIGIN/);
    assert.ok(
      inlineMatch || identifierMatch,
      `${path} must declare FALLBACK_SITE_URL with NEXT_PUBLIC_SITE_URL precedence and a hard-coded https://ironwake.dev fallback`,
    );
    if (identifierMatch) {
      // form B requires PRODUCTION_CANONICAL_ORIGIN literal in the same file
      const originMatch = source.match(/PRODUCTION_CANONICAL_ORIGIN\s*=\s*['"]https:\/\/ironwake\.dev['"]/);
      assert.ok(originMatch, `${path} must declare PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev'`);
    }
    // ponytail: no localhost leakage anywhere in the public URL chain
    assert.doesNotMatch(source, /FALLBACK_SITE_URL\s*=\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\|\|\s*['"]http:\/\/localhost/);
  }
});