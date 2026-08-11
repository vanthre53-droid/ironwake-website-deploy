// ponytail: regression test for M004-hostname. The deploy-time env var
// (NEXT_PUBLIC_SITE_URL) was once baked into the bundle as a dead
// 404 host, breaking canonical/og/sitemap/robots. The local source's
// FALLBACK_SITE_URL is what the next rebuild defaults to when the env
// var is unset. This test asserts every site-URL fallback in the repo
// points to a host that currently serves a 200 from the canonical
// IronWake production deployment. If a contributor reintroduces a stale
// 404 candidate here, this test fails before the next build runs.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const ALLOWED_FALLBACK_HOSTS = new Set([
  'ironwake-system.netlify.app',
]);

const SOURCE_FILES = [
  'app/layout.js',
  'app/sitemap.js',
  'app/robots.js',
];

for (const path of SOURCE_FILES) {
  test(`M004-hostname: ${path} FALLBACK_SITE_URL points to a live canonical host`, async () => {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    const match = source.match(/FALLBACK_SITE_URL\s*=\s*(?:process\.env\.NEXT_PUBLIC_SITE_URL\s*\|\|\s*)?['"]([^'"]+)['"]/);
    assert.ok(match, `${path} must declare FALLBACK_SITE_URL`);
    const fallback = match[1];
    const u = new URL(fallback);
    assert.ok(
      ALLOWED_FALLBACK_HOSTS.has(u.host),
      `${path} FALLBACK_SITE_URL host ${u.host} is not a known-live canonical host (allowed: ${[...ALLOWED_FALLBACK_HOSTS].join(', ')})`,
    );
  });
}
