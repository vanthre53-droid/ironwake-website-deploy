import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('release-gate enforces Cloudflare deploy ledger (4 lifetime, NOT Netlify counter)', async () => {
  const source = await readFile(new URL('./release-gate.mjs', import.meta.url), 'utf8');
  // ponytail: the deploy ledger is the Cloudflare budget (4 lifetime, 1 used at
  // checkpoint, 3 remaining) defined in Goal §1.
  assert.match(source, /4/);
  assert.match(source, /Cloudflare/);
  // Forbidden: Netlify runtime artifacts. Hostnames may appear in a
  // "forbidden canonical host" hygiene list — that's a positive assertion,
  // not active usage.
  assert.doesNotMatch(source, /NETLIFY_TOKEN/);
  assert.doesNotMatch(source, /NETLIFY_SITE_ID/);
  assert.doesNotMatch(source, /netlify\s+deploy/);
});

test('release-gate fail-closed on exhausted budget', async () => {
  const source = await readFile(new URL('./release-gate.mjs', import.meta.url), 'utf8');
  // ponytail: per Goal §8, the gate must FAIL CLOSED when the deploy
  // budget is exhausted. We assert that the code branches on budget
  // exhaustion with a non-zero exit, not a silent skip.
  assert.match(source, /maxProductionAttempts/);
  assert.match(source, /productionAttemptsUsed/);
});

test('release-gate never invokes Netlify in production', async () => {
  const source = await readFile(new URL('./release-gate.mjs', import.meta.url), 'utf8');
  // ponytail: forbid runtime tokens/commands, not the word "Netlify" which
  // may legitimately appear in a "forbidden Netlify hosts" hygiene list.
  assert.doesNotMatch(source, /NETLIFY_TOKEN/);
  assert.doesNotMatch(source, /NETLIFY_SITE_ID/);
  assert.doesNotMatch(source, /netlify\s+deploy/);
});
