// ponytail: shell into scripts/retell-prompt-audit.mjs and assert exit 0.
// The audit renders scripts/build-retell-global-prompt.mjs (which imports
// lib/pricing.mjs) and asserts:
//   - length > 800 chars
//   - all 5 system names present
//   - every numeric price string from PRICING_OFFERS appears verbatim
// It does NOT call the Retell API (use --live for that).
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('retell-prompt-audit local mode reports zero issues', () => {
  const r = spawnSync('node', ['scripts/retell-prompt-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.mode, 'local', `expected mode=local, got ${json.mode}`);
  assert.equal(json.local.issueCount, 0, `expected 0 local issues, got ${json.local.issueCount}\n${JSON.stringify(json.local.issues, null, 2)}`);
  assert.ok(json.local.charCount > 800, `expected local charCount > 800, got ${json.local.charCount}`);
  assert.equal(json.local.systemNamesPresent.length, 5, `expected 5 system names present, got ${json.local.systemNamesPresent}`);
});

test('retell-prompt-audit detects missing price literal', async () => {
  const { lintPrompt } = await import('./retell-prompt-audit.mjs');
  // Minimal stub that covers length + 5 names but is missing ALL price strings.
  const stub = new Array(801).fill('a').join('') + 'Business Leak Audit Missed Lead Recovery Setup Booking Certainty Starter Trust + Lead Capture Starter AI Receptionist Starter';
  const issues = lintPrompt(stub);
  // Expect zero length issues, zero missing-name issues, but at least one price-literal issue per tier×region.
  const priceIssues = issues.filter((i) => i.check === 'price-literal');
  assert.ok(priceIssues.length > 0, `expected price-literal issues, got: ${JSON.stringify(issues, null, 2)}`);
  // Also: min-length should pass for the stub.
  assert.ok(!issues.some((i) => i.check === 'min-length'), `min-length should pass`);
  assert.ok(!issues.some((i) => i.check === 'system-name-present'), `system-name-present should pass`);
});

// live-mode test: only runs if RETELL_API_KEY is exported
test('retell-prompt-audit --live matches live conversation flow', { skip: !process.env.RETELL_API_KEY }, () => {
  const r = spawnSync('node', ['scripts/retell-prompt-audit.mjs', '--live'], { encoding: 'utf8', env: process.env });
  // Skip semantics in node:test use `skip`; we manually guard. Fail loud if --live fails.
  assert.equal(r.status, 0, `expected exit 0 from --live, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.mode, 'live');
  assert.equal(json.local.issueCount, 0);
  assert.ok(json.live, 'expected live section');
  assert.ok(!json.live.error, `live fetch errored: ${json.live.error}`);
  assert.equal(json.live.issueCount, 0, `live has drift:\n${JSON.stringify(json.live.issues, null, 2)}`);
  assert.ok(json.live.charCount > 800, `live charCount too low: ${json.live.charCount}`);
  assert.equal(json.live.systemNamesPresent.length, 5);
});
