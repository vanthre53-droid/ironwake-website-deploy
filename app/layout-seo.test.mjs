import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('layout.js declares canonical ironwake.dev as metadataBase and contains no netlify.app URL', async () => {
  const layout = await readFile(new URL('../app/layout.js', import.meta.url), 'utf8');
  // ponytail: the live page bug had metadataBase resolve to http://localhost:3000
  // because NEXT_PUBLIC_SITE_URL was empty in the Worker. Hard-code the
  // production canonical origin as the default.
  assert.match(layout, /PRODUCTION_CANONICAL_ORIGIN\s*=\s*['"]https:\/\/ironwake\.dev['"]/);
  assert.doesNotMatch(layout, /ironwake\.netlify\.app/);
  assert.doesNotMatch(layout, /netlify/);
});
