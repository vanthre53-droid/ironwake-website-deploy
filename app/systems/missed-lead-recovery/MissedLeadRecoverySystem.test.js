import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('missed lead recovery system stays truthful and interactive', async () => {
  const source = await readFile(new URL('./MissedLeadRecoverySystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /aria-pressed={active === id}/);
  assert.match(source, /Request a Business Leak Audit/);
  assert.match(source, /Controlled owner-email delivery is connected/);
  assert.match(source, /owner-session evidence remains incomplete/);
  assert.match(source, /configured Resend worker/);
  assert.match(source, /named assignee is not yet implemented/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /PricingReference/);
  assert.match(source, /Capability vs status/);
  assert.doesNotMatch(source, /guaranteed|100%/i);
});
