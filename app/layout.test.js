// Regression guard: layout alternates.canonical must be './' so Next.js
// auto-resolves it to the current route per page. A literal '/' would
// emit the homepage canonical on every child route, which Lighthouse
// flags as 'Document does not have a valid rel=canonical'.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('layout metadata declares alternates.canonical as a per-route placeholder', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(
    source,
    /alternates:\s*\{\s*canonical:\s*['"]\.\/['"]/,
    'layout must set alternates.canonical to "./" so Next.js resolves it per route from metadataBase'
  );
  assert.doesNotMatch(
    source,
    /alternates:\s*\{\s*canonical:\s*['"]\/['"]/,
    'layout must NOT set alternates.canonical to "/" — that emits homepage canonical on every route'
  );
});