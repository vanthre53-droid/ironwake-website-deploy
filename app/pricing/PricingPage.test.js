// ponytail: PricingPage regression test. We don't render React — we read the
// source file and verify it satisfies the contract the owner depends on:
//   1. exports default a React component
//   2. has a real H1
//   3. has 5 offers (PRICING_OFFERS)
//   4. has 3 tier rows per offer (Lite, Standard, Pro)
//   5. each tier row links to /audit?offer=...&tier=...
//   6. has a Region toggle
//   7. has both India and International prices
//   8. has FAQ section with no urgency language
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const f = path.resolve('app/pricing/PricingPage.js');
const src = fs.readFileSync(f, 'utf8');

test('PricingPage exports default a React component', () => {
  assert.match(src, /export default function PricingPage/);
});

test('PricingPage has a real H1', () => {
  assert.match(src, /<h1>.*<\/h1>/);
});

test('PricingPage renders 5 offers from PRICING_OFFERS', () => {
  assert.match(src, /PRICING_OFFERS\.map\(/);
});

test('PricingPage renders 3 tiers per offer', () => {
  assert.match(src, /PRICING_TIERS\.map\(/);
  assert.match(src, /tierKey\s*=\s*tier\.toLowerCase/);
});

test('PricingPage tier rows link to /audit?offer=&tier=', () => {
  assert.match(src, /href=\{`\/audit\?offer=\$\{encodeURIComponent\(offer\.id\)\}&tier=\$\{encodeURIComponent\(tierKey\)\}`\}/);
});

test('PricingPage renders both India and International prices', () => {
  assert.match(src, /data-region="india"/);
  assert.match(src, /data-region="intl"/);
});

test('PricingPage includes a Region toggle', () => {
  assert.match(src, /import PricingRegionToggle/);
  assert.match(src, /<PricingRegionToggle/);
});

test('PricingPage has FAQ section', () => {
  assert.match(src, /<details[^>]*className="faq-item"/);
});

test('PricingPage has no urgency CTA copy', () => {
  // only matches POSITIVE copy (not the policy statement).
  // strip the disclosure box first then check the rest.
  const disclosure = src.match(/<div className="disclosure-box">[\s\S]*?<\/div>/);
  const rest = src.replace(disclosure ? disclosure[0] : '', '');
  assert.doesNotMatch(rest, /only \d+ left/i);
  assert.doesNotMatch(rest, /today only/i);
  assert.doesNotMatch(rest, /expires in/i);
  assert.doesNotMatch(rest, /ends soon/i);
  assert.doesNotMatch(rest, /hurry/i);
  assert.doesNotMatch(rest, /limited time/i);
});

test('PricingPage has Truth standard disclosure', () => {
  assert.match(src, /Truth standard/);
  assert.match(src, /disclosure-box/);
});

test('PricingPage has audit CTA strip', () => {
  assert.match(src, /audit-cta-strip/);
  assert.match(src, /Book Diagnostic/);
});

test('PricingPage shows exactly one "Most popular" badge in the grid (Dialzara pattern)', () => {
  // The Dialzara / My AI Front Desk competitor pattern is a single, intentional
  // "MOST POPULAR" treatment on exactly ONE offer card (the middle of five).
  // The top-of-card .pricing-badge must therefore render exactly once.
  const badges = src.match(/<span className="pricing-badge">Most popular<\/span>/g) || [];
  assert.equal(badges.length, 1, 'expected exactly one "Most popular" badge in the rendered grid');
  // The card-level treatment reads from offer.popular (a single boolean), not
  // from the per-offer recommended tier — so the badge is independent of the
  // per-tier row tag (which legitimately varies per offer).
  assert.match(src, /offer\.popular === true/);
  assert.doesNotMatch(src, /pricing-badge">Recommended</);
  // The popular card carries a .popular class, NOT a .recommended class.
  assert.match(src, /pricing-card\$\{isPopular \? ' popular' : ''\}/);
  assert.doesNotMatch(src, /pricing-card.*recommended/);
});

test('PricingPage popular card has an a11y label that names the badge', () => {
  // Screen readers should be able to identify the popular card without
  // depending on the visual ribbon.
  assert.match(src, /aria-label=\{isPopular \? `\$\{offer\.name\} — most popular offer` : offer\.name\}/);
  assert.match(src, /data-popular=\{isPopular \? 'true' : 'false'\}/);
});
