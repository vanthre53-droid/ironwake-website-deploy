// ponytail: regression test for hostname hygiene.
// (1) All site-URL fallbacks must NOT hardcode the old ironwake-system.netlify.app host.
// (2) All site-URL fallbacks must NOT contain the old site id 1927c0b3-532f-469c-b302-1d96cb9c7367.
// (3) FALLBACK_SITE_URL may be empty (production relies on NEXT_PUBLIC_SITE_URL).
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

test('hostname hygiene: FALLBACK_SITE_URL in core files is empty (env-driven)', async () => {
  for (const path of ['app/layout.js', 'app/sitemap.js', 'app/robots.js']) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    const match = source.match(/FALLBACK_SITE_URL\s*=\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\|\|\s*['"]([^'"]*)['"]/);
    assert.ok(match, `${path} must declare FALLBACK_SITE_URL with NEXT_PUBLIC_SITE_URL precedence`);
    assert.equal(match[1], '', `${path} FALLBACK_SITE_URL must be empty so production must set NEXT_PUBLIC_SITE_URL`);
  }
});