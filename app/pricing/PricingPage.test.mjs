import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('PricingPage hero does not link to /services (dead route)', async () => {
  const source = await readFile(new URL('./PricingPage.js', import.meta.url), 'utf8');
  // Convert "Browse Services" was the broken Link; it now points to /systems.
  assert.match(source, /href="\/systems"/);
  assert.doesNotMatch(source, /href="\/services"/);
});

test('PricingPage cross-links /scope from the truth-standard section', async () => {
  const source = await readFile(new URL('./PricingPage.js', import.meta.url), 'utf8');
  // /scope exists and tells visitors how each tier maps to operations;
  // pricing should let a thoughtful buyer reach it without leaving the page.
  assert.match(source, /href="\/scope"/);
});
