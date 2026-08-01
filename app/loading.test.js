import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('loading state is accessible and makes no unsupported operation claim', async () => {
  const source = await readFile(new URL('./loading.js', import.meta.url), 'utf8');
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-busy="true"/);
  assert.match(source, /No inquiry, booking, or provider action is happening/);
});
