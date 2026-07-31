import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('unreleased site blocks indexing without inventing a canonical domain', async () => {
  const [layout, robots] = await Promise.all([
    readFile(new URL('./layout.js', import.meta.url), 'utf8'),
    readFile(new URL('./robots.js', import.meta.url), 'utf8')
  ]);
  assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(robots, /disallow:\s*'\/'/);
  assert.doesNotMatch(layout, /metadataBase|canonical/);
});
