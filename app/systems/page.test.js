import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('systems page explains categories without implying a live provider connection', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Missed Lead Recovery/);
  assert.match(source, /Booking Certainty/);
  assert.match(source, /AI Receptionist/);
  assert.match(source, /Request-only; provider pending/);
  assert.match(source, /Not yet built/);
  assert.match(source, /export const metadata/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /guarantee|testimonial|% (faster|reduction|increase)/i);
});
