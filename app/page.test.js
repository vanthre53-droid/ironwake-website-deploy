import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('homepage keeps truthful audit CTA and operating path', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Request a Business Leak Audit/);
  assert.match(source, /Stop letting good leads disappear/);
  assert.match(source, /<SiteFooter \/>/);
});

test('homepage signal rail is decorative, labelled, and CSS-only', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /className="signal-rail"/);
  assert.match(source, /aria-label="Operating flow: inquiry to owner to next action"/);
  assert.match(source, /signal-rail-label">Inquiry/);
  assert.match(source, /signal-rail-label">Owner/);
  assert.match(source, /signal-rail-label">Next action/);
  assert.match(source, /signal-rail-pulse" aria-hidden="true"/);
});
