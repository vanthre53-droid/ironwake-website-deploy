import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('segment error boundary reports to Sentry only when configured, and offers recovery', async () => {
  const source = await readFile(new URL('./error.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /getClientDsn/);
  assert.match(source, /if \(!dsn\) return;/);
  assert.match(source, /Sentry\.captureException\(error\)/);
  assert.match(source, /reset\(\)/);
  assert.match(source, /Return home/);
});
