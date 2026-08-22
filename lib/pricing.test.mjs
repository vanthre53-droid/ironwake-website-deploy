import assert from 'node:assert/strict';
import test from 'node:test';
import { PRICING_OFFERS, PRICING_TIERS, dualLitePrice, getPricingOffer, litePriceSummary } from './pricing.mjs';

test('canonical pricing covers 15 offers (5 starter + 10 extended), three tiers, and regional Lite prices', () => {
  // Five starter offers are FROZEN — their prices/ids/cta/popular flags must
  // not change. Extended offers were added 2026-08-22 per owner directive
  // (custom SaaS, app-idea collab, custom website, plus pricing for services
  // that previously had none). See evidence/pricing-research-2026-08-22.md.
  assert.equal(PRICING_OFFERS.length, 15);
  assert.deepEqual(PRICING_TIERS, ['Lite', 'Standard', 'Pro']);
  for (const offer of PRICING_OFFERS) {
    assert.equal(offer.india.length, 3, `${offer.id}.india must have 3 tier prices`);
    assert.equal(offer.intl.length, 3, `${offer.id}.intl must have 3 tier prices`);
    assert.ok(offer.id, 'offer must have id');
    assert.ok(offer.name, 'offer must have name');
    assert.ok(offer.description, 'offer must have description');
    assert.ok(offer.cta, 'offer must have cta');
  }
  // Frozen starter offers — exact bytes must remain
  assert.equal(dualLitePrice('business-leak-audit'), '₹799 / $29');
  assert.equal(dualLitePrice('missed-lead-recovery'), '₹2,200 / $99');
  assert.equal(dualLitePrice('booking-control'), '₹12,999 / $199');
  assert.equal(dualLitePrice('trust-lead-capture'), '₹12,999 / $499');
  assert.equal(dualLitePrice('ai-receptionist'), '₹29,999 / $1,000');
  assert.equal(getPricingOffer('unknown'), null);
  assert.match(litePriceSummary(), /Business Leak Audit from ₹799\/\$29/);
});

test('canonical pricing marks exactly one offer as popular (Dialzara pattern), and it remains the original booking-control offer', () => {
  // The "MOST POPULAR" badge on /pricing must appear on exactly one offer so
  // the visual treatment doesn't dilute. The flagged offer is the original
  // starter `booking-control` and must not be re-pointed to an extended
  // offer without explicit owner approval — this preserves existing surface
  // identity (owner directive: "don't change existing prices").
  const popular = PRICING_OFFERS.filter((o) => o.popular === true);
  assert.equal(popular.length, 1, 'expected exactly one offer to carry popular: true');
  assert.equal(popular[0].id, 'booking-control');
});

test('canonical pricing exposes new OFFERED_NOW lines: custom conversion website, custom SaaS, app-idea collab', () => {
  const customSite = getPricingOffer('custom-conversion-website');
  const customSaas = getPricingOffer('custom-saas-app');
  const collab = getPricingOffer('app-idea-collab');
  assert.ok(customSite, 'custom-conversion-website must exist');
  assert.ok(customSaas, 'custom-saas-app must exist');
  assert.ok(collab, 'app-idea-collab must exist');
  assert.equal(customSite.deliveryClass, 'CUSTOM_SCOPED_READY_NOW');
  assert.equal(customSaas.highTicket, true);
  assert.equal(collab.deliveryClass, 'OWNER_APPROVAL_REQUIRED');
  assert.equal(collab.highTicket, true);
  assert.equal(collab.india[0], 'By deal');
  assert.equal(collab.intl[0], 'By deal');
});
