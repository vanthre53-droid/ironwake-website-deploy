import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('homepage keeps truthful audit CTA and operating path', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Book Diagnostic/);
  assert.match(source, /Stop losing leads between enquiry and follow-up/);
  assert.match(source, /No live receptionist provider is connected/);
  assert.doesNotMatch(source, /Capability is built; live telephony/);
  assert.match(source, /<SiteFooter \/>/);
  for (const href of ['/systems/missed-lead-recovery', '/systems/booking-control', '/systems/ai-receptionist', '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas']) {
    assert.ok(source.includes(href), `homepage should expose ${href}`);
  }
});

test('homepage signal rail represents the implemented review-task workflow', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /className="signal-rail"/);
  assert.match(source, /aria-label="Operating flow: inquiry to review task to next action"/);
  assert.match(source, /signal-rail-label">Inquiry/);
  assert.match(source, /signal-rail-label">Review task/);
  assert.match(source, /signal-rail-label">Next action/);
  assert.match(source, /Due date/);
  assert.doesNotMatch(source, /assign a named owner/);
  assert.doesNotMatch(source, /Owner<\/dt><dd>Named/);
  assert.match(source, /<WakeSVG/);
  assert.match(source, /WakeSVG \/>/);
});
