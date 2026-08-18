import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking control system keeps truthful requested/confirmed states', async () => {
  const source = await readFile(new URL('./BookingControlSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Form submission alone can never reach this state/);
  // ponytail: SiteFooter is rendered by the global layout (app/layout.js),
  // not by individual system components.
  const layout = await readFile(new URL('../../layout.js', import.meta.url), 'utf8');
  assert.match(layout, /SiteFooter/);
  assert.doesNotMatch(source, /<SiteFooter \/>/);
  assert.match(source, /PricingReference/);
  assert.match(source, /Capability vs status/);
  assert.doesNotMatch(source, /instant confirmation/i);
});
