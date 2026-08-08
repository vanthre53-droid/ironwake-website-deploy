import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai receptionist page separates capability from live provider status', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Capability vs status/);
  assert.match(source, /Demo status/);
  assert.match(source, /Provider status/);
  assert.match(source, /ILLUSTRATIVE SAMPLE — not a real call\. No live phone line is connected\./);
  assert.match(source, /Telephony, voice, and messaging providers pending/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /PricingReference/);
  assert.doesNotMatch(source, /Not yet connected|No phone number is connected to this concept page|concept under active scoping|future version would commit/i);
});
