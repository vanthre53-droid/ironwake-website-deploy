import assert from 'node:assert/strict';
import test from 'node:test';
import { PRICING_OFFERS, PRICING_TIERS, dualLitePrice, getPricingOffer, litePriceSummary } from './pricing.mjs';

test('canonical pricing defines the approved five offers, three tiers, and regional Lite prices', () => {
  assert.equal(PRICING_OFFERS.length, 5);
  assert.deepEqual(PRICING_TIERS, ['Lite', 'Standard', 'Pro']);
  for (const offer of PRICING_OFFERS) {
    assert.equal(offer.india.length, 3);
    assert.equal(offer.intl.length, 3);
  }
  assert.equal(dualLitePrice('business-leak-audit'), '₹799 / $29');
  assert.equal(dualLitePrice('missed-lead-recovery'), '₹2,200 / $99');
  assert.equal(dualLitePrice('booking-control'), '₹12,999 / $199');
  assert.equal(dualLitePrice('trust-lead-capture'), '₹12,999 / $499');
  assert.equal(dualLitePrice('ai-receptionist'), '₹29,999 / $1,000');
  assert.equal(getPricingOffer('unknown'), null);
  assert.match(litePriceSummary(), /Business Leak Audit from ₹799\/\$29/);
});

test('canonical pricing marks exactly one offer as popular, and it is the middle offer (Dialzara pattern)', () => {
  // The "MOST POPULAR" badge on /pricing must appear on exactly one offer so
  // the visual treatment doesn't dilute. It is the middle offer of the 5-card
  // grid by convention (Dialzara / My AI Front Desk competitor pattern).
  const popular = PRICING_OFFERS.filter((o) => o.popular === true);
  assert.equal(popular.length, 1, 'expected exactly one offer to carry popular: true');
  const middleId = PRICING_OFFERS[Math.floor(PRICING_OFFERS.length / 2)].id;
  assert.equal(popular[0].id, middleId);
});
