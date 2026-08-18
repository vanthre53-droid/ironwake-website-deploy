import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('homepage keeps truthful audit CTA and operating path', async () => {
  // ponytail: hero markup moved to <FlagshipHero/>; check both files.
  const page = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  const hero = await readFile(new URL('./components/FlagshipHero.js', import.meta.url), 'utf8');
  const combined = page + hero;
  assert.match(combined, /Book Diagnostic/);
  assert.match(combined, /Stop losing leads between enquiry and follow-up/);
  assert.match(page, /No live receptionist provider is connected/);
  assert.doesNotMatch(page, /Capability is built; live telephony/);
  assert.match(page, /<SiteFooter \/>/);
  for (const href of ['/systems/missed-lead-recovery', '/systems/booking-control', '/systems/ai-receptionist', '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas']) {
    assert.ok(page.includes(href), `homepage should expose ${href}`);
  }
});

test('homepage signal rail represents the implemented review-task workflow', async () => {
  // ponytail: signal-rail markup now lives in <FlagshipHero/>; check both files.
  const page = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  const hero = await readFile(new URL('./components/FlagshipHero.js', import.meta.url), 'utf8');
  const combined = page + hero;
  assert.match(combined, /className="signal-rail"/);
  assert.match(combined, /aria-label="Operating flow: inquiry to review task to next action"/);
  assert.match(combined, /signal-rail-label">Inquiry/);
  assert.match(combined, /signal-rail-label">Review task/);
  assert.match(combined, /signal-rail-label">Next action/);
  assert.match(combined, /Due date/);
  assert.doesNotMatch(combined, /assign a named owner/);
  assert.doesNotMatch(combined, /Owner<\/dt><dd>Named/);
  assert.match(combined, /<WakeSVG/);
  assert.match(combined, /WakeSVG \/>/);
});
