import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('layout defines IronWake metadata', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(source, /Systems that answer/);
  assert.match(source, /IronWake helps service businesses/);
});

test('layout documents the Sentry error-boundary pair and sets a theme-aware viewport', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(source, /app\/error\.js/);
  assert.match(source, /app\/global-error\.js/);
  assert.match(source, /export const viewport/);
  assert.match(source, /prefers-color-scheme: dark/);
});
