import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('PricingReference exports canonical offer tiers matching PricingPage spec', async () => {
  const source = await readFile(new URL('./PricingReference.js', import.meta.url), 'utf8');
  // All four system offers must be present with their canonical Lite-tier values
  assert.match(source, /'missed-lead-recovery': \{ name: 'Missed Lead Recovery Setup', indiaLite: '₹2,200', intlLite: '\$99'/);
  assert.match(source, /'booking-control': \{ name: 'Booking Certainty Starter', indiaLite: '₹12,999', intlLite: '\$199'/);
  assert.match(source, /'trust-lead-capture': \{ name: 'Trust \+ Lead Capture Starter', indiaLite: '₹12,999', intlLite: '\$499'/);
  assert.match(source, /'ai-receptionist': \{ name: 'AI Receptionist Starter', indiaLite: '₹29,999', intlLite: '\$1,000'/);
  // Truth guard: must mention provider-cost separation
  assert.match(source, /never marked up by IronWake/);
});
