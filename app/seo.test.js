import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// ponytail: regression guard. Layout must declare robots index/follow and
// its canonical host constant must equal the production apex. A regression
// that switches the canonical back to localhost or to a stale netlify.app
// host breaks every public route's canonical link, OG image URL, and
// JSON-LD @id — this test fails loudly before deploy.
test('layout enables indexing and pins the production canonical host', async () => {
  const layout = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(
    layout,
    /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/,
    'layout robots must allow index/follow'
  );
  assert.match(
    layout,
    /PRODUCTION_CANONICAL_ORIGIN\s*=\s*['"]https:\/\/ironwake\.dev['"]/,
    'layout must pin PRODUCTION_CANONICAL_ORIGIN to https://ironwake.dev'
  );
  assert.doesNotMatch(
    layout,
    /netlify\.app/,
    'layout must not reference the obsolete netlify.app host'
  );
});
