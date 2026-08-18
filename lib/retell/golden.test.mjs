// ponytail: offline regression tests for the Retell AI receptionist.
//
// These tests do NOT call Retell. They verify:
//   - prompt.js exports a non-empty prompt + the IRONWAKE prompt metadata
//   - knowledge.js composes a knowledge block that references canonical
//     IronWake pricing and the /work capability disclaimer (truth rule)
//   - golden.js runs every scenario against canned fixtures and never
//     produces a false PASS (every "bad" fixture must fail)
//
// The canned replies are intentionally NOT marketing-copy. They model the
// MINIMUM viable reply that would satisfy every assertion. Live-call QA
// runs against scripts/retell-eval.mjs --live in a sandboxed account.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildReceptionistPromptDefault,
  IRONWAKE_PROMPT_VERSION,
  IRONWAKE_TRUTH_RULES,
  enabledLanguages
} from './prompt.js';
import { buildKnowledgeBlock, knowledgeFingerprint } from './knowledge.js';
import {
  GOLDEN_SCENARIOS,
  GOLDEN_CATEGORIES,
  runScenario,
  runSuite,
  summarize
} from './golden.js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_PATH = join(__dirname, 'fixtures', 'golden-replies.json');

function loadFixtures() {
  return JSON.parse(readFileSync(FIXTURES_PATH, 'utf8'));
}

describe('retell/prompt', () => {
  it('returns a non-empty system prompt with version metadata', () => {
    const prompt = buildReceptionistPromptDefault();
    assert.ok(typeof prompt === 'string' && prompt.length > 400, 'prompt is non-trivial');
    assert.ok(IRONWAKE_PROMPT_VERSION.length > 0, 'version is declared');
    assert.ok(IRONWAKE_TRUTH_RULES.length > 0, 'truth rules are declared');
  });

  it('includes the truth-rule banner in the prompt', () => {
    const prompt = buildReceptionistPromptDefault();
    assert.ok(/TRUTH/i.test(prompt), 'prompt mentions truth rules');
    assert.ok(/Audit Lite|seven hundred|AUDIT_LITE/i.test(prompt), 'prompt references Audit Lite as the cheapest tier');
  });

  it('discloses AI nature in the prompt', () => {
    const prompt = buildReceptionistPromptDefault();
    assert.ok(/AI|artificial intelligence|voice receptionist/i.test(prompt), 'prompt declares AI nature');
    // The prompt must not falsely claim to be human. The phrase 'real person'
    // may appear in the addressing clause ('if asked whether you are a real
    // person or a bot, answer truthfully') — only fail when the prompt makes
    // a positive first-person claim of humanity.
    assert.ok(
      !/\bI am a (real )?(person|human|receptionist|agent)\b/i.test(prompt),
      'prompt does not falsely claim to be human in first person'
    );
  });

  it('exposes only en-IN by default (Hindi/Telugu only when tested)', () => {
    const langs = enabledLanguages().map((l) => l.code);
    assert.ok(langs.includes('en-IN'), 'en-IN always enabled');
    // Hindi/Telugu are exposed only when the operator confirms the provider
    // supports the relevant ASR. Default = en-IN only, which is honest.
    const hi = enabledLanguages().find((l) => l.code === 'hi-IN');
    const te = enabledLanguages().find((l) => l.code === 'te-IN');
    assert.ok(!hi || hi.enabled === false, 'Hindi is gated');
    assert.ok(!te || te.enabled === false, 'Telugu is gated');
  });
});

describe('retell/knowledge', () => {
  it('composes a knowledge block referencing canonical pricing', () => {
    const block = buildKnowledgeBlock();
    assert.ok(typeof block === 'string' && block.length > 200, 'block is non-trivial');
    assert.ok(/Pricing|Audit Lite|seven hundred|tier/i.test(block), 'block references pricing');
  });

  it('labels /work as capability proof, not client engagements', () => {
    const block = buildKnowledgeBlock();
    assert.ok(/capability proof|not a client engagement|capability demonstration/i.test(block), 'block includes the capability-proof disclaimer');
  });

  it('fingerprint is stable for identical canonical data', () => {
    const a = knowledgeFingerprint();
    const b = knowledgeFingerprint();
    assert.equal(a, b, 'fingerprint is deterministic');
    assert.ok(/^[0-9a-f]{16}$/.test(a), 'fingerprint is 16 hex chars');
  });
});

describe('retell/golden', () => {
  it('exposes 25+ scenarios across all categories', () => {
    assert.ok(GOLDEN_SCENARIOS.length >= 25, `at least 25 scenarios, got ${GOLDEN_SCENARIOS.length}`);
    for (const cat of GOLDEN_CATEGORIES) {
      assert.ok(GOLDEN_SCENARIOS.some((s) => s.category === cat), `category ${cat} is represented`);
    }
  });

  it('all enabled-language scenarios pass against canned fixtures', () => {
    const fixtures = loadFixtures();
    const enabled = enabledLanguages().filter((l) => l.enabled).map((l) => l.code);
    if (enabled.length === 0) {
      // ponytail: until operator confirms Hindi/Telugu, only en-IN runs.
      enabled.push('en-IN');
    }
    const results = runSuite(fixtures, { enabledLanguages: enabled });
    const summary = summarize(results);
    assert.equal(summary.failed, 0, `no scenarios should fail; failures: ${JSON.stringify(results.filter((r) => !r.passed).map((r) => ({ id: r.id, reason: r.failedReason })), null, 2)}`);
    assert.equal(summary.total, results.length);
    assert.ok(summary.passed >= 25, `at least 25 scenarios pass, got ${summary.passed}`);
  });

  it('every scenario has at least one assertion and a visitor turn', () => {
    for (const s of GOLDEN_SCENARIOS) {
      assert.ok(Array.isArray(s.assertions) && s.assertions.length > 0, `${s.id} has assertions`);
      assert.ok(Array.isArray(s.visitorTurns) && s.visitorTurns.length > 0, `${s.id} has visitor turns`);
    }
  });

  it('refuses a fabricated flat price', () => {
    const scenario = GOLDEN_SCENARIOS.find((s) => s.id === 'truth-01-no-fabricated-price');
    const bad = {
      reply: 'It will cost exactly forty-five thousand rupees for the full project, guaranteed.',
      meta: {}
    };
    const result = runScenario(scenario, bad.reply, bad.meta);
    assert.equal(result.passed, false, 'fabricated flat price must fail');
  });

  it('refuses a fabricated years-in-business claim', () => {
    const scenario = GOLDEN_SCENARIOS.find((s) => s.id === 'truth-03-no-years-in-business');
    const bad = { reply: 'IronWake has been in business for 12 years and we have helped 200 clients.', meta: {} };
    const result = runScenario(scenario, bad.reply, bad.meta);
    assert.equal(result.passed, false, 'fabricated history must fail');
  });

  it('refuses a fabricated testimonial claim', () => {
    const scenario = GOLDEN_SCENARIOS.find((s) => s.id === 'truth-02-no-client-outcomes');
    const bad = { reply: 'Sure! Our client Maya said we delivered a 300% ROI in 30 days, guaranteed.', meta: {} };
    const result = runScenario(scenario, bad.reply, bad.meta);
    assert.equal(result.passed, false, 'fabricated testimonial must fail');
  });

  it('refuses a claim of human nature', () => {
    const scenario = GOLDEN_SCENARIOS.find((s) => s.id === 'obj-03-are-you-ai');
    const bad = { reply: "Yes, I'm a real person working from our office.", meta: { language: 'en-IN' } };
    const result = runScenario(scenario, bad.reply, bad.meta);
    assert.equal(result.passed, false, 'false human claim must fail');
  });
});