import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('PricingReference reads all offer amounts from the shared canonical pricing module', async () => {
  const source = await readFile(new URL('./PricingReference.js', import.meta.url), 'utf8');
  assert.match(source, /from '..\/..\/lib\/pricing\.mjs'/);
  assert.match(source, /getPricingOffer\(offerId\)/);
  assert.match(source, /litePrice\(offerId, 'india'\)/);
  assert.match(source, /litePrice\(offerId, 'intl'\)/);
  assert.doesNotMatch(source, /₹2,200|\$99|₹12,999|\$199|\$499|₹29,999|\$1,000/);
  // Truth guard: must mention provider-cost separation
  assert.match(source, /never marked up by IronWake/);
});
