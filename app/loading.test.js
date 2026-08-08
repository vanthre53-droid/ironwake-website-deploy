import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('loading state is accessible and makes no unsupported operation claim', async () => {
  const source = await readFile(new URL('./loading.js', import.meta.url), 'utf8');
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /aria-busy="true"/);
  assert.match(source, /No inquiry, booking, or provider action is happening/);
});

// ponytail: regression guard — loading boundary must NOT render a heading element; SSR + the real page H1 would otherwise create two H1s per page for crawlers and screen readers.
test('loading state does not render a heading element', async () => {
  const source = await readFile(new URL('./loading.js', import.meta.url), 'utf8');
  // Find the JSX expression the component returns and assert it does not contain any heading tag.
  const jsx = source.match(/return\s*(.*?)\s*\};?\s*$/s);
  assert.ok(jsx, 'expected a return statement with JSX in Loading component');
  assert.doesNotMatch(jsx[1], /<h[1-6]\b/);
  assert.doesNotMatch(jsx[1], /<\/h[1-6]>/);
});
