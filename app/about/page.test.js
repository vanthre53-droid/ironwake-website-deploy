import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('about page explains the truth standard and keeps founder attribution approved', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Truth before theatre/);
  assert.match(source, /Revanth Nunna/);
  assert.match(source, /Founder, IronWake/);
  assert.match(source, /DEMONSTRATION/);
  assert.match(source, /PROVIDER PROOF PENDING/);
  assert.match(source, /AWAITING VERIFICATION/);
  assert.match(source, /export const metadata/);
  assert.doesNotMatch(source, /mailto:/, 'CTA stays the audit request flow, not a raw email link, until send/receive monitoring is confirmed');
});
