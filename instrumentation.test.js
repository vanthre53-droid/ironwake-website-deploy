import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('instrumentation registers the server Sentry config only in the Node runtime', async () => {
  const source = await readFile(new URL('./instrumentation.js', import.meta.url), 'utf8');
  assert.match(source, /export async function register/);
  assert.match(source, /NEXT_RUNTIME.*nodejs/);
  assert.match(source, /sentry\.server\.config\.js/);
});
