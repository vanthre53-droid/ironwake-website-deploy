import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai receptionist page separates future requirements from current provider state', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Capability vs status/);
  assert.match(source, /Current site status/);
  assert.match(source, /Provider status/);
  assert.match(source, /ILLUSTRATIVE SAMPLE — not a real call\. No live phone line is connected\./);
  assert.match(source, /No telephony, voice, messaging, or model provider is configured/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /PricingReference/);
  assert.match(source, /No AI receptionist is operating here/);
  assert.match(source, /deterministic decision tree, not an AI chat, phone, or DM assistant/);
});

test('ai receptionist page CTA requests a workflow audit instead of claiming an active service', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /Request a reception workflow audit/);
  assert.doesNotMatch(source, /built and ready for the provider layer/);
});
