import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('404 explains the missing route and returns home', async () => {
  const source = await readFile(new URL('./not-found.js', import.meta.url), 'utf8');
  assert.match(source, /Path unowned/);
  assert.match(source, /Return home/);
  assert.match(source, /export const metadata/);
});
