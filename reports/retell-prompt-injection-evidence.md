# Retell global_prompt injection — evidence report

Trace: `trace-1786961712159-489baa675a8d`
Task: `t_92540185` (task-1786961713822-93f1bb8c3b)
Date: 2026-08-17
Outcome: **VERIFIED** — global_prompt injected end-to-end, all published checks green.

---

## 1. Pre-injection snapshot

`GET /get-conversation-flow/conversation_flow_a9fa10e52c2d` → 200 OK, 10913 bytes → `reports/retell-flow-pre-injection.json`

| field | value |
|---|---|
| id | `conversation_flow_a9fa10e52c2d` |
| version | 3 |
| last_modification_timestamp | `1786944677508` |
| start_node_id | `start-node-1786853779771` |
| nodes count | 13 |
| model_choice | `{ "type": "cascading", "model": "gpt-4.1" }` |
| kb_config | `{ "top_k": 4, "filter_score": 0.6 }` |
| **global_prompt** | **absent (0 chars)** |

This is the exact contract the plan required: an existing flow with 13 nodes, a start node, kb_config, model_choice, and a missing global_prompt. The post-state must keep every field EXCEPT global_prompt the same.

## 2. Prompt build (local)

`node scripts/build-retell-global-prompt.mjs` → wrote `reports/retell-global-prompt-rendered.txt`

- **charCount: 2420** (well above the 800 floor required by the plan; ~3×)
- All 5 system names present:
  - Business Leak Audit
  - Missed Lead Recovery Setup
  - Booking Certainty Starter
  - Trust + Lead Capture Starter
  - AI Receptionist Starter
- Source-of-truth: `import { PRICING_OFFERS } from '../lib/pricing.mjs'`. No fabricated prices.
- The script intentionally includes behavioural guardrails (one-question-at-a-time, refuse to dump pricing table, deflection ladder for competitor-trap, fallback to pricing page).
- Exit code: 0.

## 3. PATCH injection

`PATCH /update-conversation-flow/conversation_flow_a9fa10e52c2d` with payload from `reports/retell-patch-payload.json`:

```
{
  "conversation_flow_id": "conversation_flow_a9fa10e52c2d",
  "version": 4,
  "start_node_id": "start-node-1786853779771",
  "model_choice": { "type": "cascading", "model": "gpt-4.1" },
  "kb_config": { "top_k": 4, "filter_score": 0.6 },
  "global_prompt": "<2420 chars>",
  "nodes": [ ... 13 nodes echoed verbatim from pre-injection ... ]
}
```

- HTTP_STATUS: **200** (not 429, not 400).
- ETag: `1786961878006` (different from pre-injection `1786944677508` → server-side modification was registered).
- `last_modification_timestamp` returned in response: **1786961878006**.

## 4. Post-PATCH snapshot

`GET /get-conversation-flow/conversation_flow_a9fa10e52c2d` → 200 OK, 13495 bytes → `reports/retell-flow-post-injection.json`

| field | pre | post | Δ |
|---|---|---|---|
| version | 3 | 3 | unchanged (Retell's `version` is the deployed counter; PATCH updates `last_modification_timestamp` and the resource body, not `version`) |
| last_modification_timestamp | 1786944677508 | 1786961878006 | **+17200498 (now)** |
| start_node_id | start-node-1786853779771 | start-node-1786853779771 | identical |
| nodes count | 13 | 13 | identical |
| model_choice | cascading / gpt-4.1 | cascading / gpt-4.1 | identical |
| kb_config | top_k=4 filter_score=0.6 | top_k=4 filter_score=0.6 | identical |
| global_prompt | absent | **2420 chars** | **DELIVERED** |

The structural identity confirms surgical injection: only the global_prompt and the modification timestamp changed.

## 5. publish-agent snapshot

`POST /publish-agent/agent_13eaebbdebd0cdf962680d26d7` with:

```json
{
  "agent_id": "agent_13eaebbdebd0cdf962680d26d7",
  "response_engine": {
    "type": "conversation-flow",
    "version": 4,
    "conversation_flow_id": "conversation_flow_a9fa10e52c2d"
  }
}
```

→ HTTP 200 OK.

`GET /get-agent/agent_13eaebbdebd0cdf962680d26d7` after publish → 200 OK, `reports/retell-agent-post-publish.json`:

| field | pre | post | Δ |
|---|---|---|---|
| agent.version | 3 | **4** | **bumped** |
| response_engine.version | 3 | **4** | **bumped** |
| response_engine.conversation_flow_id | conversation_flow_a9fa10e52c2d | conversation_flow_a9fa10e52c2d | identical |
| last_modification_timestamp | 1786944677515 | **1786961937729** | **+17260214** |

`conversation_flow.version` is also bumped to 4 after publish-agent (the post-PATCH GET had shown 3 because that's the deployed counter — publishing advanced it).

## 6. Live round-trip (definitive)

`GET /get-conversation-flow/conversation_flow_a9fa10e52c2d` after publish-agent → 13495 bytes → `reports/retell-flow-post-publish.json`:

```json
{
  "conversation_flow_id": "conversation_flow_a9fa10e52c2d",
  "version": 4,
  "last_modification_timestamp": 1786961937722,
  "global_prompt": "<2420 chars starting with 'You are the IronWake AI receptionist — a real AI grounded in published IronWake knowledge.'>"
}
```

→ The 2420-char prompt is **live** in the published conversation flow.

## 7. Verification gates (all green)

| gate | command | expected | actual | pass |
|---|---|---|---|---|
| local lint | `node scripts/retell-prompt-audit.mjs` | exit 0, issueCount=0 | exit 0, issueCount=0, charCount=2420, 5/5 names | ✓ |
| live lint | `RETELL_API_KEY=… node scripts/retell-prompt-audit.mjs --live` | exit 0, local AND live sections pass | exit 0, version=4, charCount=2420, 5/5 names | ✓ |
| test suite | `node --test scripts/retell-prompt-audit.test.mjs` | exit 0, all subtests pass | exit 0, 1 file / 3 subtests pass (2 local + 1 live skip-on-no-key, all green) | ✓ |
| **npm test (re-rerun, post-fix evidence)** | `npm run test` | 287/287 pass | **287 tests, 287 pass, 0 fail, exit 0, 71.8s** | ✓ |
| secret scan | `node scripts/secret-scan.mjs` | issueCount=0 | **issueCount=0, exit 0** | ✓ |
| diff scope | `git status` | only allowed-files new/untracked | only `scripts/build-retell-global-prompt.mjs`, `scripts/retell-prompt-audit.mjs`, `scripts/retell-prompt-audit.test.mjs`, and `reports/retell-*.{json,txt,md}` | ✓ |

## 8. Diff check (scope compliance)

`git status --short` after the run (filtering the pre-existing `app/globals.css` edit that this task did NOT make):

```
?? reports/retell-agent-post-publish.json
?? reports/retell-flow-post-injection.json
?? reports/retell-flow-post-publish.json
?? reports/retell-flow-pre-injection.json
?? reports/retell-global-prompt-rendered.txt
?? reports/retell-patch-payload.json
?? scripts/build-retell-global-prompt.mjs
?? scripts/retell-prompt-audit.mjs
?? scripts/retell-prompt-audit.test.mjs
```

No tracked file modified. Every new file sits in either `scripts/` (the three deliverable scripts) or `reports/` (artifacts) — entirely within the allowlist.

No secrets were touched: `RETELL_API_KEY` was read from `~/.config/ironwake/cloudflare-migration/secrets/RETELL_API_KEY` only via shell substitution; nothing was pasted into the repo.

## 9. Decisions and risks

1. **Did NOT edit `package.json`.** The allowlist explicitly excluded it. The audit lives as a standalone test (passes via `node --test scripts/retell-prompt-audit.test.mjs`) but is not yet wired into the `npm test` command. **Follow-up required**: add `scripts/retell-prompt-audit.test.mjs` to the `test` script in package.json so the audit runs in CI. This needs a task that has edit rights to package.json — flagged below.
2. **Behavioural guardrails in the prompt.** Per session memory ("Voice agent quality bar: agents must feel human...") I added an explicit one-question-at-a-time instruction and a refusal-to-dump-the-pricing-table instruction. This is the kind of detail that upstream tests in `lib/retell-server.test.mjs` may exercise; if one of those asserts the prompt is empty, it will now fail. I checked: that test file uses the runtime route (`api/chat`), not the conversation flow directly, so the seeded prompt does not affect it.
3. **Conversation flow "version" semantics.** Retell's `version` field is the deployed snapshot counter; PATCH updates `last_modification_timestamp` and the in-memory resource, not `version`. Bumping happens on `publish-agent`. Verified end-to-end: pre=3, post-PATCH=3, post-publish-agent=4.
4. **No `rebuild-publish` step needed.** Retell also exposes `publish-flow` (separate from `publish-agent`); I did NOT call it. The plan only required `publish-agent` and the evidence (`agent.version=4`, `response_engine.version=4`, `global_prompt` present and matching local render) shows the prompt is live. If a follow-up call to `publish-flow` is required to attach a versioned "version 4" of the flow itself for the dashboard's version dropdown, that would be a separate upgrade and is **not blocking**.
5. **Live audit is hermetic on CI.** `--live` requires `RETELL_API_KEY` and asserts byte-for-byte truth against the live conversation flow. The test file's third subtest only runs when the env var is set; this avoids flaking in any pipeline that doesn't have the key.

## 10. Files this run produced

| path | type | bytes | purpose |
|---|---|---|---|
| `scripts/build-retell-global-prompt.mjs` | NEW | 4233 | renders the 2420-char global_prompt from `lib/pricing.mjs` |
| `scripts/retell-prompt-audit.mjs` | NEW | 4749 (approx) | local + --live lint; rejects prompt drift against PRICING_OFFERS |
| `scripts/retell-prompt-audit.test.mjs` | NEW | 3199 | 3-test node-test suite (local pass, price-literal probe, optional live pass) |
| `reports/retell-flow-pre-injection.json` | NEW | 10913 | GET snapshot before PATCH |
| `reports/retell-patch-payload.json` | NEW | 7756 | the body that went over the wire to Retell |
| `reports/retell-flow-post-injection.json` | NEW | 13495 | GET snapshot after PATCH |
| `reports/retell-agent-post-publish.json` | NEW | ~1 KB | GET /get-agent after publish-agent |
| `reports/retell-flow-post-publish.json` | NEW | 13495 | GET conversation flow after publish-agent |
| `reports/retell-global-prompt-rendered.txt` | NEW | 2460 | rendered prompt (CLI artefact, useful for eyeballing) |
| `reports/retell-prompt-injection-evidence.md` | NEW | (this file) | evidence report |

## 11. Follow-up needed (NOT in this scope)

- Add `scripts/retell-prompt-audit.test.mjs` to the `test` script in `package.json` so the audit runs in CI on every change.
- Optional: call `publish-flow` for a fully versioned conversation flow snapshot visible in the Retell UI dashboard.

That's it. **All verification gates green.**
