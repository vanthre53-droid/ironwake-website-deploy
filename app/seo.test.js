import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site allows indexing on netlify.app', async () => {
  const layout = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(layout, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/);
});
