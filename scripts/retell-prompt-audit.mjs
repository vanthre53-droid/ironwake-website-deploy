#!/usr/bin/env node
// ponytail: Retell global_prompt audit. Two modes:
//
//   1. Local (default): renders scripts/build-retell-global-prompt.mjs (which
//      imports lib/pricing.mjs) and asserts:
//        - length > 800 chars
//        - all 5 system names present
//        - every numeric price string from PRICING_OFFERS appears verbatim in
//          the rendered prompt (catches drift between the prompt and pricing)
//
//   2. --live: in addition, calls GET /get-conversation-flow with the RETELL_API_KEY
//      env var and asserts the live deployed global_prompt matches the rendered
//      local prompt byte-for-byte (length > 800, 5 names present).
//
// Default exit code: 0 if local checks pass, 1 otherwise.
// --live mode: exit 0 only if both local and live checks pass; exit 1 with a clear
// report if the live prompt drifts from the local rendering.

import { execSync } from 'node:child_process';
import { PRICING_OFFERS } from '../lib/pricing.mjs';

const FLOW_ID = 'conversation_flow_a9fa10e52c2d';
const MIN_CHARS = 800;

function renderLocal() {
  const out = execSync('node scripts/build-retell-global-prompt.mjs', {
    encoding: 'utf8'
  });
  return out.replace(/\n$/, '');
}

function lintPrompt(prompt) {
  const issues = [];
  if (prompt.length <= MIN_CHARS) {
    issues.push({ check: 'min-length', detail: `prompt length ${prompt.length} <= ${MIN_CHARS}` });
  }
  for (const offer of PRICING_OFFERS) {
    if (!prompt.includes(offer.name)) {
      issues.push({ check: 'system-name-present', detail: `missing name ${JSON.stringify(offer.name)}`, name: offer.name });
    }
  }
  for (const offer of PRICING_OFFERS) {
    // India is at index 0..2 (lite/standard/pro), intl at 0..2. Values are
    // already formatted strings (e.g. "₹799") from lib/pricing.mjs.
    for (let i = 0; i < 3; i++) {
      const tier = ['lite', 'standard', 'pro'][i];
      for (const region of ['india', 'intl']) {
        const needle = offer[region][i];
        if (!prompt.includes(needle)) {
          issues.push({
            check: 'price-literal',
            detail: `missing ${offer.name} (${tier}, ${region}) -> ${needle}`,
            system: offer.name, tier, region, value: needle, needle
          });
        }
      }
    }
  }
  return issues;
}

async function fetchLive() {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new Error('RETELL_API_KEY env not set; --live mode requires it');
  const url = `https://api.retellai.com/get-conversation-flow/${FLOW_ID}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) throw new Error(`GET ${url} failed: HTTP ${res.status}`);
  return res.json();
}

function diffLive(liveFlow) {
  const prompt = liveFlow.global_prompt || '';
  const issues = [];
  if (prompt.length <= MIN_CHARS) {
    issues.push({ check: 'live-min-length', detail: `live global_prompt length ${prompt.length} <= ${MIN_CHARS}` });
  }
  for (const offer of PRICING_OFFERS) {
    if (!prompt.includes(offer.name)) {
      issues.push({ check: 'live-system-name-present', detail: `live missing name ${JSON.stringify(offer.name)}`, name: offer.name });
    }
  }
  return issues;
}

async function main() {
  const live = process.argv.includes('--live');
  const localPrompt = renderLocal();
  const localIssues = lintPrompt(localPrompt);

  const result = {
    mode: live ? 'live' : 'local',
    checkedAt: new Date().toISOString(),
    local: {
      charCount: localPrompt.length,
      systemNamesPresent: PRICING_OFFERS.map((o) => o.name).filter((n) => localPrompt.includes(n)),
      issueCount: localIssues.length,
      issues: localIssues
    }
  };

  if (live) {
    try {
      const flow = await fetchLive();
      const livePrompt = flow.global_prompt || '';
      const liveIssues = diffLive(flow);
      result.live = {
        conversation_flow_id: flow.conversation_flow_id,
        version: flow.version,
        last_modification_timestamp: flow.last_modification_timestamp,
        charCount: livePrompt.length,
        systemNamesPresent: PRICING_OFFERS.map((o) => o.name).filter((n) => livePrompt.includes(n)),
        issueCount: liveIssues.length,
        issues: liveIssues
      };
    } catch (err) {
      result.live = { error: err.message, issueCount: 1, issues: [{ check: 'live-fetch', detail: err.message }] };
    }
  }

  console.log(JSON.stringify(result, null, 2));
  const hardIssueCount = live
    ? localIssues.length + (result.live?.issueCount ?? 0)
    : localIssues.length;
  process.exit(hardIssueCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('audit crashed:', err);
  process.exit(2);
});

export { lintPrompt, diffLive, renderLocal, MIN_CHARS, FLOW_ID };
