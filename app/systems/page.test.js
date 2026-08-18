import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('systems page explains categories without implying a live provider connection', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Missed Lead Recovery/);
  assert.match(source, /Booking Certainty/);
  assert.match(source, /Trust and Lead Capture/);
  assert.match(source, /AI Receptionist/);
  assert.match(source, /Request-only; provider pending/);
  assert.match(source, /Not yet built/);
  assert.match(source, /export const metadata/);
  // ponytail: SiteFooter is now in the global layout (app/layout.js), not per-page.
  const layout = await readFile(new URL('../layout.js', import.meta.url), 'utf8');
  assert.match(layout, /SiteFooter/);
  assert.doesNotMatch(source, /<SiteFooter \/>/);
  assert.match(source, /\/systems\/missed-lead-recovery/);
  assert.match(source, /\/systems\/booking-control/);
  assert.match(source, /\/systems\/trust-lead-capture/);
  assert.match(source, /\/systems\/ai-receptionist/);
  assert.doesNotMatch(source, /guarantee|testimonial|% (faster|reduction|increase)/i);
});
