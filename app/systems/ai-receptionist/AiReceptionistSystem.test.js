import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai receptionist page separates live demo on this domain from per-tenant client receptionist scope', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Capability vs status/);
  assert.match(source, /Current site status/);
  assert.match(source, /Client provider status/);
  // Live demo on this domain is honest — wired to verified production Retell agent.
  assert.match(source, /Live Retell web-call wired to agent_13eaebbdebd0cdf962680d26d7/);
  assert.match(source, /agent_13eaebbdebd0cdf962680d26d7/);
  assert.match(source, /Start a live receptionist call/);
  assert.match(source, /<VoicePanel /);
  assert.match(source, /<WhatsAppLauncher \/>/);
  // The per-tenant receptionist must remain honestly scoped — no claim that a multi-tenant receptionist exists yet.
  assert.match(source, /separately[- ]scoped/i);
  assert.match(source, /signed SOW/);
  assert.match(source, /does not claim a production tenant receptionist exists/);
  // The old "receptionist is not" framing is gone — it contradicted a live production reality (Retell agent verified 2026-08-22).
  assert.doesNotMatch(source, /receptionist is not/);
  assert.doesNotMatch(source, /not yet a deployed provider/);
  assert.doesNotMatch(source, /Provider pending — separately scoped/);
  assert.doesNotMatch(source, /No telephony, voice, messaging, or model provider is configured for client receptionist deployments/);
  assert.doesNotMatch(source, /ILLUSTRATIVE SAMPLE — not a real call\. No live phone line is connected\./);
  // ponytail: SiteFooter is rendered by the global layout (app/layout.js),
  // not by individual system components.
  const layout = await readFile(new URL('../../layout.js', import.meta.url), 'utf8');
  assert.match(layout, /SiteFooter/);
  assert.doesNotMatch(source, /<SiteFooter \/>/);
  assert.match(source, /PricingReference/);
  assert.doesNotMatch(source, /deterministic decision tree, not an AI chat, phone, or DM assistant/);
});

test('ai receptionist page offers a live-call CTA alongside the audit CTA', async () => {
  const source = await readFile(new URL('./AiReceptionistSystem.js', import.meta.url), 'utf8');
  assert.match(source, /Start a live receptionist call/);
  assert.match(source, /Request a reception workflow audit/);
  assert.doesNotMatch(source, /built and ready for the provider layer/);
});
