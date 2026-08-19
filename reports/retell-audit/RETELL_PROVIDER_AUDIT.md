# Retell Provider Audit — ironwake v13 (HEAD 13cf9c52)

**Run date:** 2026-08-19
**Vault:** `~/.config/ironwake/cloudflare-migration/secrets/` (per-file secrets)
**Live URL probed:** `https://ironwake.dev/api/webhooks/retell`
**Snapshot files:** `reports/retell-audit/retell-live-snapshot.json`, `retell-version-compare.json`

---

## 1. Provider state (LIVE, what real callers hit)

| Field | Value | Source |
|---|---|---|
| `AGENT_ID` | `agent_13eaebbdebd0cdf962680d26d7` | vault `RETELL_AGENT_ID` matches Retell API |
| `AGENT_NAME` | `IronWake AI Receptionist` | API |
| `AGENT_STATUS` | **PUBLISHED** (live, v=3) | API `is_published=true`, `version=3`, `base_version=2` |
| `CHANNEL` | `voice` | API |
| `RESPONSE_ENGINE` | `conversation-flow` (v=3) | API — `response_engine.type`, `response_engine.version` |
| `FLOW_ID` | `conversation_flow_a9fa10e52c2d` | API `response_engine.conversation_flow_id` |
| `VOICE` | `11labs-Amritanshu` | API `voice_id` |
| `LLM` (model) | `gpt-4.1` | API agent `post_call_analysis_model` + flow inherits |
| `PROMPT` | `global_prompt` 2420 chars, sha256 `8122933b30d1bed5` | API — matches canonical source byte-for-byte |
| `KNOWLEDGE` | **EMPTY** — `kb_config.knowledge_base_ids=[]`, `kb_config.top_k=4`, `kb_config.filter_score=0.6` | Retell `list-knowledge-bases` returns `[]` |
| `TOOLS` | none | API — no `tools` on agent or flow |
| `WEBHOOK_URL` | `https://ironwake.dev/api/webhooks/retell` | API `webhook_url` |
| `WEBHOOK_EVENTS` | `call_started`, `call_ended`, `call_analyzed` | API `webhook_events` |
| `LANGUAGES` | agent `language=en-IN` | API |
| `INTERRUPTION_SENSITIVITY` | `0.9` (high) | API |
| `ALLOW_USER_DTMF` | `true` | API |
| `MAX_CALL_DURATION_MS` | `3600000` (60 min) | API |
| `SILENCE` | retell default (no override on agent) | API |
| `LATENCY_CONFIG` | retell default (no explicit override) | API |
| `DATA_STORAGE` | `everything` | API `data_storage_setting` |
| `PII_CONFIG` | `mode: post_call`, `categories: []` | API |
| `HANDBOOK` | `default_personality`, `ai_disclosure` both true | API |
| `PUBLISH_STATE` | **Live v=3 is published, draft v=4 is unpublished** | API |

### Conversation flow v=3 (live)

- `version=3, is_published=true`
- `model` (inherited from agent) = `gpt-4.1`
- `global_prompt` length 2420, sha256 `8122933b30d1bed5` — **identical to canonical source**
- 13 nodes, 0 edges (Conversation flow in Retell uses node->convey transitions, not edges):
  - `Welcome Node` (conversation)
  - `End Call` (end)
  - `Conversation` (conversation)
  - `Subagent` (subagent)
  - `Transfer Call` x2 (transfer_call)
  - `Press Digit` (press_digit)
  - `Logic Split` (branch)
  - `Agent Transfer Node` (agent_swap)
  - `In-Call SMS` (sms)
  - `Extract Variables` (extract_dynamic_variables)
  - `Code` (code)
  - `End Call` (end)

### Conversation flow v=4 (draft on Retell side)

- `version=4, is_published=false`
- `global_prompt` length 2420, sha256 `8122933b30d1bed5` — **identical to canonical source**
- Same prompt hash as v=3 → draft is in sync with live

---

## 2. Canonical truth sync (✅ GREEN)

| Canonical source path | Renders |
|---|---|
| `scripts/build-retell-global-prompt.mjs` | length 2420, sha256 `8122933b30d1bed5` |
| `reports/retell-global-prompt-rendered.txt` | length 2420, sha256 `8122933b30d1bed5` |
| Retell flow v=3 `global_prompt` (live) | length 2420, sha256 `8122933b30d1bed5` |
| Retell flow v=4 `global_prompt` (draft) | length 2420, sha256 `8122933b30d1bed5` |

**All four match byte-for-byte.** Canonical truth ↔ live published: **SYNCED**.

---

## 3. Webhook E2E test (live production endpoint)

| Test | Result |
|---|---|
| `GET https://ironwake.dev/api/webhooks/retell` | 403 `error code: 1010` (Cloudflare browser-integrity block on missing UA) |
| `POST` no signature, no timestamp | 401 `Invalid webhook signature` |
| `POST` valid sig + `x-retell-timestamp` (vault WH_SECRET) | **401 `Invalid webhook signature`** |
| `POST` valid sig + timestamp, secret = `RETELL_API_KEY` (fallback path) | **401 `Invalid webhook signature`** |
| `POST` `call_started`, `call_ended`, `call_analyzed` (sig + timestamp) | **401** across all three |

### Webhook finding (CRITICAL — production bug)

The deployed `app/api/webhooks/retell/route.js` rejects **every** signed delivery from the vault's `RETELL_WEBHOOK_API_KEY`. Both the primary env `RETELL_WEBHOOK_API_KEY` and the fallback `RETELL_API_KEY` (per `route.js:90`) were tried and both rejected.

**Interpretation:** the deployed webhost's environment has a **different** `RETELL_WEBHOOK_API_KEY` (and `RETELL_API_KEY`) value than the vault. The Retell Dashboard would sign with *the same secret the operator configured in Settings → API Keys*. If Retell is configured with the same secret the host knows, calls would be accepted; if Retell is configured with the vault secret, calls still fail. Either way, **no caller delivery is currently verifiable end-to-end**.

**Action required (owner gate):**
1. Open the production env (Vercel / Next.js host env for `ironwake.dev`) and reveal the actual values of `RETELL_WEBHOOK_API_KEY` and `RETELL_API_KEY`.
2. Open Retell Dashboard → Settings → API Keys and confirm which key is the webhook signing key.
3. Rotate the vault + host + Retell so all three agree on the same `RETELL_WEBHOOK_API_KEY`.
4. Re-run this webhook probe — until it returns `200 {"received":true}` on a real-shape payload, **call_analyzed events are silently dropped in production**.

The handler code itself (`lib/notifications/retell-webhook.mjs` + `app/api/webhooks/retell/route.js`) is correct: it does HMAC-SHA256 over the raw body, constant-time compare, 5-minute timestamp window, and a Supabase `summary` persistence branch. The bug is 100% env-sync, not code.

---

## 4. Phone number binding (⚠️ second issue)

Retell `list-phone-numbers` returns **one** number `+144****5146` (the ironwake.dev line) and its `agent_id` field is **empty**.

**Interpretation:** the phone number is **not bound to the live agent** in the Retell Dashboard. Inbound calls to `+1447-215-5146` may not be routed to `agent_13eaebbdebd0cdf962680d26d7` (which is what the canonical state assumes).

**Action required (owner gate):**
1. Retell Dashboard → Phone Numbers → `+14472155146` → Inbound Agent = `agent_13eaebbdebd0cdf962680d26d7` (IronWake AI Receptionist).

---

## 5. Tools / Knowledge base gaps

- `tools`: **none** on agent or flow. The conversation flow has a `press_digit` node, an `extract_dynamic_variables` node, and a `code` node (all native flow nodes — not external tools). If the canonical story is "no external tools", this is consistent.
- `knowledge_base_ids`: **none**. The `kb_config` exists on the agent with `top_k=4, filter_score=0.6` but no KB is attached. If IronWake is supposed to have a knowledge base, this is a gap. If not, the kb_config object can be removed.

---

## 6. Configuration drift (no remote updates required)

The repo's `scripts/retell-push.mjs` is commented as "Drop-in replacement: rebuild as Retell-LLM agent". That script uses `response_engine.type=retell-llm` and a flat voice_model config — **this is not the canonical path for the current live agent**. The current canonical path is:

- `reports/retell-patch-payload.json` (the agent + flow patch payload)
- `scripts/build-retell-global-prompt.mjs` (the canonical prompt builder)

Both produce a payload that matches the live state byte-for-byte. **No remote config update is needed.**

---

## 7. Summary

| Item | Status |
|---|---|
| `AGENT_ID` present and authoritative | ✅ |
| `AGENT_STATUS` published | ✅ (live v=3) |
| `FLOW_ID` present and bound | ✅ |
| `VOICE` set | ✅ |
| `LLM` set | ✅ |
| `PROMPT` matches canonical source | ✅ (sha256 matches all four sources) |
| `KNOWLEDGE` attached | ⚠️ empty (may or may not be intentional) |
| `TOOLS` attached | ✅ (none, intentional) |
| `WEBHOOK_URL` set on agent | ✅ |
| `WEBHOOK_EVENTS` configured | ✅ |
| `LANGUAGES` set | ✅ |
| `INTERRUPTION_SENSITIVITY` set | ✅ |
| `SILENCE` / `LATENCY_CONFIG` configured | ⚠️ relying on Retell defaults (no explicit override) |
| `PUBLISH_STATE` synced to canonical | ✅ |
| **Webhook signature verification passes on live endpoint** | ❌ **CRITICAL — env secret mismatch** |
| **Phone number bound to agent** | ❌ **CRITICAL — unbound** |

**Two production-critical owner gates remain for full live readiness:**

1. **Webhook secret parity** — vault `RETELL_WEBHOOK_API_KEY` ≠ deployed env `RETELL_WEBHOOK_API_KEY`. Real Retell webhooks are being rejected with 401.
2. **Phone number binding** — `+14472155146` is not bound to the IronWake agent in Retell Dashboard, so inbound calls may not be routed.

The repo / canonical truth is correctly synced to Retell; the live deploy platform is the source of the gap.
