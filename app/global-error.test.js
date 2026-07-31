import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('root error boundary renders its own html/body and reports to Sentry only when configured', async () => {
  const source = await readFile(new URL('./global-error.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /<html lang="en">/);
  assert.match(source, /<body>/);
  assert.match(source, /import '\.\/globals\.css'/);
  assert.match(source, /getClientDsn/);
  assert.match(source, /Sentry\.captureException\(error\)/);
});
