import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('homepage keeps truthful audit CTA and operating path', async () => {
  // ponytail: hero markup moved to <FlagshipHero/>; check both files.
  const page = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  const hero = await readFile(new URL('./components/FlagshipHero.js', import.meta.url), 'utf8');
  const combined = page + hero;
  assert.match(combined, /Map my leak/);
  assert.match(combined, /The enquiry arrived/);
  assert.match(page, /No live receptionist provider is connected/);
  assert.doesNotMatch(page, /Capability is built; live telephony/);
  assert.match(page, /<SiteFooter \/>/);
  for (const href of ['/systems/missed-lead-recovery', '/systems/booking-control', '/systems/ai-receptionist', '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas']) {
    assert.ok(page.includes(href), `homepage should expose ${href}`);
  }
});

test('homepage outcome strip represents the implemented review-task workflow', async () => {
  // ponytail: v13 outcome-strip replaces the previous signal-rail markup in <FlagshipHero/>.
  // The .signal-rail CSS class remains as decorative infrastructure for future use.
  const page = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  const hero = await readFile(new URL('./components/FlagshipHero.js', import.meta.url), 'utf8');
  const combined = page + hero;
  assert.match(combined, /className="outcome-strip"/);
  assert.match(combined, /aria-label="What IronWake delivers"/);
  assert.match(combined, /outcome-strip-tag">Outcome/);
  assert.match(combined, /<strong>Captured<\/strong>/);
  assert.match(combined, /<strong>Reviewed<\/strong>/);
  assert.match(combined, /<strong>Visible<\/strong>/);
  assert.match(combined, /<strong>Verified<\/strong>/);
  assert.match(combined, /Due date/);
  assert.doesNotMatch(combined, /assign a named owner/);
  assert.doesNotMatch(combined, /Owner<\/dt><dd>Named/);
  assert.match(combined, /<WakeSVG/);
  assert.match(combined, /WakeSVG \/>/);
});
