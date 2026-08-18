#!/usr/bin/env node
// ponytail: run the Retell AI receptionist golden suite.
//
// Two modes:
//
//   1. OFFLINE MODE (default) — checks the canonical prompt + knowledge
//      block shape against canned reply fixtures stored in
//      lib/retell/fixtures/*.json. This is the CI gate: it fails when
//      someone changes the prompt in a way that breaks expected behavior,
//      and it exits non-zero on regression.
//
//   2. LIVE MODE (--live) — calls the Retell chat/test endpoint for each
//      scenario. Requires RETELL_API_KEY and RETELL_AGENT_ID. Disabled by
//      default because most CI runs do not have provider credentials.
//
// Usage:
//   node scripts/retell-eval.mjs                 # offline, all scenarios
//   node scripts/retell-eval.mjs --category truth
//   node scripts/retell-eval.mjs --language en-IN
//   node scripts/retell-eval.mjs --live          # provider round-trip
//
// Exit codes:
//   0   all enabled scenarios passed
//   1   one or more scenarios failed (regression)
//   2   configuration error (missing fixtures, invalid args)

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GOLDEN_SCENARIOS, runScenario, summarize, GOLDEN_CATEGORIES } from '../lib/retell/golden.js';
import { enabledLanguages } from '../lib/retell/prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_DIR = join(__dirname, '..', 'lib', 'retell', 'fixtures');

function parseArgs(argv) {
  const out = { category: null, language: null, live: false, verbose: false, fixture: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--live') out.live = true;
    else if (a === '--verbose' || a === '-v') out.verbose = true;
    else if (a === '--category') out.category = argv[++i];
    else if (a === '--language') out.language = argv[++i];
    else if (a === '--fixture') out.fixture = argv[++i];
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      printHelp();
      process.exit(2);
    }
  }
  return out;
}

function printHelp() {
  console.log(`Usage: node scripts/retell-eval.mjs [options]

Options:
  --category <name>    Run only scenarios in this category (${GOLDEN_CATEGORIES.join(', ')})
  --language <code>    Run only scenarios for this language (en-IN, hi-IN, te-IN)
  --fixture <path>     Override the canned-reply fixture JSON
  --live               Run a live round-trip against Retell (requires RETELL_API_KEY + RETELL_AGENT_ID)
  --verbose, -v        Print every scenario result
  --help, -h           Show this help`);
}

async function loadFixtures({ category, language } = {}) {
  const fixturePath = join(FIXTURES_DIR, 'golden-replies.json');
  let raw;
  try {
    raw = await readFile(fixturePath, 'utf8');
  } catch (err) {
    throw new Error(`Cannot read fixtures at ${fixturePath}: ${err.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Fixtures are not valid JSON: ${err.message}`);
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Fixtures must be an object keyed by scenario id');
  }
  return parsed;
}

function filterScenarios({ category, language, enabled }) {
  return GOLDEN_SCENARIOS.filter((s) => {
    if (!enabled.includes(s.language)) return false;
    if (category && s.category !== category) return false;
    if (language && s.language !== language) return false;
    return true;
  });
}

function runOffline(scenarios, fixtures, { verbose }) {
  const results = [];
  for (const scenario of scenarios) {
    const canned = fixtures[scenario.id];
    if (!canned) {
      results.push({ id: scenario.id, language: scenario.language, category: scenario.category, passed: false, failedReason: 'no canned reply in fixtures', results: [] });
      continue;
    }
    const result = runScenario(scenario, canned.reply, canned.meta || {});
    results.push(result);
    if (verbose) {
      const tag = result.passed ? 'PASS' : 'FAIL';
      console.log(`  [${tag}] ${scenario.id} (${scenario.category}) — ${result.failedReason || 'ok'}`);
    }
  }
  return results;
}

async function runLive(scenarios, { apiKey, agentId, fetchImpl = fetch }) {
  if (!apiKey || !agentId) {
    throw new Error('Live mode requires RETELL_API_KEY and RETELL_AGENT_ID');
  }
  const results = [];
  const endpoint = 'https://api.retellai.com/v2/chat';
  for (const scenario of scenarios) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          agent_id: agentId,
          metadata: { scenario: scenario.id, language: scenario.language },
          // Retell's chat endpoint accepts a `messages` array — we simulate a
          // single visitor turn; production callers loop per scenario.
          messages: [{ role: 'user', content: scenario.visitorTurns.join('\n') }]
        })
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        results.push({ id: scenario.id, language: scenario.language, category: scenario.category, passed: false, failedReason: `retell ${response.status}`, results: [] });
        continue;
      }
      const replyText = body?.messages?.slice(-1)?.[0]?.content || body?.reply || '';
      const meta = {
        language: scenario.language,
        priority: body?.priority,
        category: body?.category,
        handoff: body?.handoff,
        needs_human: body?.needs_human
      };
      results.push(runScenario(scenario, replyText, meta));
    } catch (err) {
      results.push({ id: scenario.id, language: scenario.language, category: scenario.category, passed: false, failedReason: `network: ${err?.message || err}`, results: [] });
    } finally {
      clearTimeout(timeout);
    }
  }
  return results;
}

function printReport({ total, passed, failed, byCategory }, failedScenarios, verbose) {
  console.log('');
  console.log('=== Retell Golden Suite ===');
  console.log(`Total: ${total}  Passed: ${passed}  Failed: ${failed}`);
  console.log('By category:');
  for (const [cat, stats] of Object.entries(byCategory)) {
    console.log(`  ${cat.padEnd(14)} ${stats.passed}/${stats.total}`);
  }
  if (failed > 0) {
    console.log('');
    console.log('Failing scenarios:');
    for (const f of failedScenarios) {
      console.log(`  - ${f.id} (${f.category}/${f.language}): ${f.failedReason}`);
    }
  }
  if (verbose) {
    console.log('');
    console.log('(verbose mode — full per-assertion output above)');
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const enabled = enabledLanguages().map((l) => l.code);

  if (args.category && !GOLDEN_CATEGORIES.includes(args.category)) {
    console.error(`Unknown category: ${args.category}. Allowed: ${GOLDEN_CATEGORIES.join(', ')}`);
    process.exit(2);
  }

  const scenarios = filterScenarios({ category: args.category, language: args.language, enabled });
  if (scenarios.length === 0) {
    console.error('No scenarios match the filter and enabled-language set.');
    process.exit(2);
  }

  let results;
  if (args.live) {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.RETELL_AGENT_ID;
    if (!apiKey || !agentId) {
      console.error('Live mode requires RETELL_API_KEY and RETELL_AGENT_ID in env.');
      process.exit(2);
    }
    console.log(`Running ${scenarios.length} scenario(s) against live Retell...`);
    results = await runLive(scenarios, { apiKey, agentId });
  } else {
    const fixtures = await loadFixtures({ category: args.category, language: args.language });
    console.log(`Running ${scenarios.length} scenario(s) offline against fixtures (enabled languages: ${enabled.join(', ')})...`);
    results = runOffline(scenarios, fixtures, { verbose: args.verbose });
  }

  const summary = summarize(results);
  const failed = results.filter((r) => !r.passed);
  printReport(summary, failed, args.verbose);
  process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('retell-eval failed:', err?.message || err);
  process.exit(2);
});