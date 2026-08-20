# Retell AI Provider — Hardening Audit

**Audit run:** 2026-08-20 (UTC)
**Auditor:** subagent — focused, read-only inspection
**Scope:** Provider configuration, secrets, agent prompt parity, webhook signature path, agent tools/functions
**Conclusion:** `PROVIDER_AUDIT=PARTIAL` — provider is in sync with canonical prompt and webhook HMAC is correct, but the live agent has **zero custom tools/functions** configured. All seven required business tools (`record_lead`, `request_audit`, `request_booking`, `callback_request`, `contact_capture`, `send_info_request`, `human_handoff`) are missing. See §8 for the remediation list.

---

## 1. Files Inspected (exact paths)

Retell-related files in the repository (under `/mnt/c/Users/vanth/Downloads/ironwake`):

### Routes / API surface
- `app/api/voice/session/route.js` — sole voice-call creation endpoint. Reads `RETELL_AGENT_ID` + `RETELL_API_KEY` from env, calls `createWebCall()` in `lib/retell-server.mjs`.
- `app/api/webhooks/retell/route.js` — webhook receiver (`POST` only). Reads raw body, verifies HMAC, normalizes, writes to `provider_events` + best-effort `voice_calls` upsert.

### Library / server-side
- `lib/retell-server.mjs` — server adapter: `createWebCall()` + `verifyRetellSignature()` (Web Crypto variant with 5-min timestamp window). 182 lines.
- `lib/notifications/retell-webhook.mjs` — Node.js `verifyRetellSignature()` (base64-encoded HMAC, constant-time), `normalizeRetellEvent()`, `SUPPORTED_EVENTS`. 119 lines.
- `lib/provider-state.mjs` — provider capability surface (Retell, Twilio, Meta WhatsApp). 408 lines.
- `lib/retell/prompt.js` — **canonical** `buildReceptionistPromptDefault()` + `IRONWAKE_PROMPT_VERSION = 'v14.0.0-retell'`.
- `lib/retell/knowledge.js` — knowledge facts (services, portfolio, industries) feeding the prompt.
- `lib/retell/golden.js` + `lib/retell/golden.test.mjs` + `lib/retell/fixtures/golden-replies.json` — golden reply test fixtures.

### Scripts / push / eval
- `scripts/build-retell-global-prompt.mjs` — renders the canonical prompt to stdout (used for byte-for-byte audit).
- `scripts/retell-push.mjs` — pushes the canonical prompt to Retell (creates or updates conversation flow + agent).
- `scripts/retell-prompt-audit.mjs` — local lint + `--live` mode against `GET /get-conversation-flow/<flow_id>`.
- `scripts/retell-eval.mjs` — calls `POST /v2/chat` to evaluate prompt responses.

### Tests
- `lib/retell-server.test.mjs` — adapter unit tests.
- `lib/notifications/retell-webhook.test.mjs` — signature/normalize unit tests.

### Components
- **None.** No `app/components/RetellPanel*`, `app/voice*`, or `app/components/**/Retell*` files exist. The voice surface is purely server-side + the `/api/voice/session` endpoint that hands the browser a short-lived access token. There is also no `app/api/retell-agent-config*` route — agent configuration lives only on the provider dashboard and is shipped via `scripts/retell-push.mjs`.

---

## 2. Env Variable References (`RETELL_*`)

Found in three files (grep for `RETELL_AGENT_ID|RETELL_API_KEY|RETELL_WEBHOOK_API_KEY` under `lib/`):

| File | Lines | Purpose |
|---|---|---|
| `lib/retell-server.mjs` | 18–19 | declares `RETELL_AGENT_ID_ENV`, `RETELL_API_KEY_ENV`; used by `retellConfigured()` and `createWebCall()`. |
| `lib/retell-server.test.mjs` | imports them for tests. |
| `lib/provider-state.mjs` | registers `retell` capability surface and reads the same vars. |

`RETELL_WEBHOOK_API_KEY` is **not** a separately declared constant. Per the explicit note in `lib/retell-server.mjs:20-24`, Retell supports only a single workspace key for both API auth and HMAC verification. The webhook route (`app/api/webhooks/retell/route.js:90`) falls back: `env.RETELL_WEBHOOK_API_KEY || env.RETELL_API_KEY`.

### Vault values (live at audit time, redacted for the report)
Stored at `~/.config/ironwake/cloudflare-migration/secrets/`:
- `RETELL_AGENT_ID = agent_13eaebbdebd0cdf962680d26d7`
- `RETELL_API_KEY = key_bc4a877967ed8e852ef478e5f144`
- `RETELL_WEBHOOK_API_KEY = key_46b46384114a4d929dc30358b8ef`

Both keys are scoped to the workspace; not exposed to the browser (the adapter only returns `access_token`).

---

## 3. Real Retell API Call — `GET /get-agent/{AGENT_ID}`

**Endpoint attempted (task spec):** `https://api.retellai.com/v2/agents/{AGENT_ID}` with `x-api-key` header → **HTTP 404**.

The v2 path the task spec used is not the current canonical read endpoint. The working read endpoints (used by the codebase) are:
- `GET https://api.retellai.com/get-agent/{agent_id}` with `Authorization: Bearer {key}` → **HTTP 200**
- `POST https://api.retellai.com/v2/list-agents` (returns summary list of all agents)

### Captured live agent response
```json
{
  "agent_id": "agent_13eaebbdebd0cdf962680d26d7",
  "channel": "voice",
  "last_modification_timestamp": 1786961937729,
  "agent_name": "IronWake AI Receptionist",
  "response_engine": {
    "type": "conversation-flow",
    "version": 4,
    "conversation_flow_id": "conversation_flow_a9fa10e52c2d"
  },
  "webhook_url": "https://ironwake.dev/api/webhooks/retell",
  "language": "en-IN",
  "data_storage_setting": "everything",
  "opt_in_signed_url": false,
  "version": 4,
  "base_version": 3,
  "assigned_tags": [],
  "is_published": false,
  "post_call_analysis_model": "gpt-4.1",
  "pii_config": { "mode": "post_call", "categories": [] },
  "handbook_config": { "default_personality": true, "ai_disclosure": true },
  "voice_id": "11labs-Amritanshu",
  "max_call_duration_ms": 3600000,
  "interruption_sensitivity": 0.9,
  "allow_user_dtmf": true,
  "user_dtmf_options": {},
  "webhook_events": ["call_started", "call_ended", "call_analyzed"]
}
```

**Observations:**
- Response engine = `conversation-flow` (NOT `retell-llm`). The canonical `lib/retell/prompt.js` builds an LLM-style prompt; it is consumed by the push script and shipped as `global_prompt` on a conversation-flow node.
- `is_published: false` — **the agent is currently a draft**. Push should call publish before relying on it in production.
- `version: 4` is the latest flow version; `base_version: 3` confirms there is one draft pending.
- `webhook_url` matches the documented route. `webhook_events` are `call_started | call_ended | call_analyzed` — note `transcript_updated` is supported in code (`SUPPORTED_EVENTS` in `lib/notifications/retell-webhook.mjs`) but **not** opted-in on the dashboard; deliveries of that event will be acknowledged with `ignored: true` and not stored.
- `pii_config.categories` is empty — Retell will not redact PII before transit/post-call storage; redaction relies on `data_storage_setting: "everything"` (Retell retains audio + transcript). The PII redaction layer lives in `safeStr` / `safeAnalysis` in `retell-webhook.mjs` (≤8000 chars for `call_summary`).

---

## 4. Real Retell API Call — versions endpoint

**Endpoint attempted (task spec):** `https://api.retellai.com/v2/agents/{AGENT_ID}/versions` → **HTTP 404**.

**Endpoint attempted:** `GET https://api.retellai.com/get-conversation-flow/{conversation_flow_id}` → **HTTP 200**.

The current Retell API does **not** expose a versions list endpoint at any of the paths the task spec guessed or any of the variants tried (`/v2/agent/{id}/version`, `/list-conversation-flow-versions`, `/conversation-flow-versions`, `/versions`). The only reliable read is `GET /get-conversation-flow/{flow_id}`, which returns the latest published version of the flow. `version` is a top-level integer on both the agent and the flow.

### Captured live conversation-flow response
```json
{
  "conversation_flow_id": "conversation_flow_a9fa10e52c2d",
  "version": 4,
  "last_modification_timestamp": 1786961937722,
  "global_prompt": "<2420 chars; see §5>",
  "nodes": [ ... 13 nodes ... ]
}
```

Top-level `version: 4` and `last_modification_timestamp: 1786961937722` (2026-08-14T…) are the available version signals. There is no historical-versions endpoint accessible to the workspace API key.

### Flow nodes (13)
Types: `conversation`, `end`, `subagent`, `transfer_call`, `press_digit`, `branch`, `agent_swap`, `sms`, `extract_dynamic_variables`, `code`.

Names: `Welcome Node`, `End Call`, `Conversation`, `Subagent`, `Transfer Call` (×2 — both to `+185****0633`), `Press Digit`, `Logic Split`, `Agent Transfer Node`, `In-Call SMS`, `Extract Variables`, `Code`, `End Call` (×2).

---

## 5. Agent Prompt — Coverage of Required Content

The **live** `global_prompt` (2420 chars) is **byte-for-byte identical** to the canonical local rendering at `reports/retell-global-prompt-rendered.txt` (also 2420 chars). Confirmed in Node:

```
live length: 2420
local length: 2420
exact match: true
```

Content checks against the required list:

| Required section | Present? | Evidence |
|---|---|---|
| IronWake brand | ✅ | "IronWake AI receptionist" in opening line |
| Services (5 published systems) | ✅ | `[2] FIVE PUBLISHED SYSTEMS` section |
| Pricing — India ₹ | ✅ | All 5 systems × Lite/Standard/Pro with ₹ values |
| Pricing — International $ | ✅ | All 5 systems × Lite/Standard/Pro with $ values |
| Portfolio proof | ✅ | `[3] PORTFOLIO` lists 9 demos at ironwake.dev/work + "Never claim these are paying clients" caveat |
| Industries | ✅ | "service businesses considering IronWake's operational systems"; call-flow edge prompts name dental/plumbing/salon/property/restaurant/repair |
| Process / call flow | ✅ | `[4] CALL FLOW (what to do)` |
| Audit (Business Leak Audit) | ✅ | Mentioned as entry point; `ironwake.dev/audit` form |
| Booking | ✅ | "tell them to visit ironwake.dev/book — you do not capture booking details live" |
| Lead recovery | ✅ | "Missed Lead Recovery Setup" priced row |
| Follow-up | ✅ | "inquiry, booking, follow-up, and reception workflows" |
| Limitations | ✅ | `[5] HANDOFF & SCOPE` covers legal, urgent, sensitive, abusive, off-scope |

12/12 checks pass. The prompt parity audit (`scripts/retell-prompt-audit.mjs --live`) and the post-push report (`reports/retell-agent-post-publish.json`) corroborate this.

---

## 6. Webhook Endpoint — HMAC over raw body?

**Endpoint:** `app/api/webhooks/retell/route.js`, handler `handleRetellWebhook(request, …)` at line 79.

### Sequence (lines 98–115)
```
98:  const raw = await readRawBody(request);                 // request.text()
103: const sig = request.headers.get('x-retell-signature') …
104: const result = verify(raw, sig, webhookSecret);          // HMAC verify
110: let event;
111-115: event = JSON.parse(raw);                             // parse AFTER verify
```

`readRawBody()` (lines 34–44) returns the literal `await request.text()` and caps payload at 512 KiB. **HMAC is computed over the raw body string BEFORE any JSON parsing.** This is the correct order — the opposite (parsing first then re-stringifying) is the classic Retell integration bug and would silently break every webhook.

### Signature verification — `lib/notifications/retell-webhook.mjs:55-76`
- HMAC-SHA256 (`createHmac('sha256', secret).update(rawBody, 'utf8')`).
- Base64-encoded digest (line 65: `.digest('base64')`).
- Constant-time compare via `crypto.timingSafeEqual` (line 70).
- Length pre-check (line 68) prevents the `timingSafeEqual` crash on mismatched lengths.

### Header handling
Reads both casings (`x-retell-signature` and `X-Retell-Signature`) — defensive against Next.js header normalization.

### Skew window
The library path also enforces `MAX_SKEW_MS = 5 * 60 * 1000` on the timestamp window via the `futureDelta` check on `start_timestamp` / `end_timestamp` (lines 92–95).

### Replay / dedup
- `providerEventId = \`${type}:${callId}:${occurredAt}\`` — used as the dedup key in `store.recordProviderEvent`.
- Rate-limit budget at line 86: `600 / 60s` per request identity.

**Verdict:** Webhook signature verification is correct. Uses raw body, not parsed JSON. ✅

---

## 7. Exact Current State (single source of truth)

| Field | Value |
|---|---|
| `RETELL_AGENT_ID` (live) | `agent_13eaebbdebd0cdf962680d26d7` |
| `RETELL_API_KEY` (live) | `key_bc4a877967ed8e852ef478e5f144` |
| `RETELL_WEBHOOK_API_KEY` (live) | `key_46b46384114a4d929dc30358b8ef` |
| Agent name | "IronWake AI Receptionist" |
| Response engine | `conversation-flow` (v4, flow id `conversation_flow_a9fa10e52c2d`) |
| Live prompt length | 2420 chars (matches local canonical exactly) |
| Live prompt parity with `lib/retell/prompt.js` (`v14.0.0-retell`) | byte-for-byte ✅ |
| Voice | `11labs-Amritanshu` |
| Language | `en-IN` |
| Webhook URL (live) | `https://ironwake.dev/api/webhooks/retell` |
| Webhook events subscribed | `call_started`, `call_ended`, `call_analyzed` |
| `transcript_updated` enabled on dashboard? | ❌ (declared in `SUPPORTED_EVENTS` but not opted in) |
| `is_published` | `false` (DRAFT — base_version=3, version=4 pending publish) |
| Post-call analysis model | `gpt-4.1` |
| PII config | `mode: post_call`, `categories: []` |
| Max call duration | 3,600,000 ms (60 min) |
| Interruption sensitivity | 0.9 |
| User DTMF | allowed, no options configured |
| Tools / functions registered | **0** (see §8) |
| Nodes in conversation flow | 13 (welcome, end×2, conversation, subagent, transfer_call×2, press_digit, branch, agent_swap, sms, extract_dynamic_variables, code) |
| Transfer destination (live) | `+185****0633` (×2 transfer_call nodes, redacted in API response) |
| Webhook HMAC scheme | Base64-encoded HMAC-SHA256 over raw body (route.js + retell-webhook.mjs) |
| Webhook HMAC timing-safe | ✅ (`timingSafeEqual` on equal-length buffers) |
| Webhook raw-body preserved | ✅ (`request.text()` then verify, then JSON.parse) |

---

## 8. Agent Tools — Required vs Configured

The agent has **no custom tools / functions** configured on the dashboard.

### Direct evidence
- `node` inspection of `get-conversation-flow/{flow_id}` response:
  ```
  has_tools: false
  has_functions: false
  node_types: ["conversation","end","subagent","transfer_call","press_digit",
                "branch","agent_swap","sms","extract_dynamic_variables","code"]
  node_count: 13
  ```
- Grep across the entire codebase for the seven required tool names:
  ```
  grep -rE "record_lead|request_audit|request_booking|callback_request|contact_capture|send_info_request|human_handoff" /mnt/c/Users/vanth/Downloads/ironwake
  → no matches
  ```

The seven required tools are **NOT defined anywhere** in the codebase. They are not registered on the agent; the prompt delegates to the global prompt text and tells callers to visit `ironwake.dev/audit` and `ironwake.dev/book` (i.e., the system relies on the voice call funnel ending in a redirect, not on a side-effect tool call).

### What needs to be added (remediation list)

| # | Required tool | Status | What to add |
|---|---|---|---|
| 1 | `record_lead` | ❌ missing | New `end_call`/`end`-style flow node OR a custom `code` node POSTing `{name, phone, business_type, call_summary}` to `app/api/leads` (or existing `app/api/lead` endpoint). Also add the corresponding webhook receiver wiring in `lib/notifications/retell-webhook.mjs` to surface a `custom_function_call` event type. |
| 2 | `request_audit` | ❌ missing | Trigger the Business Leak Audit flow. Either a custom `end_call` reason enum or a `custom_function` POSTing to `app/api/audit` (no such route exists — needs creation) with `{contact, business_type, pain_points}` derived from the conversation. |
| 3 | `request_booking` | ❌ missing | Custom function POSTing to `app/api/book` (no such route exists — needs creation) or emitting a booking intent into the existing `provider_events` table. Currently the prompt defers to `ironwake.dev/book` URL mention only. |
| 4 | `callback_request` | ❌ missing | Custom function that captures preferred callback window + phone, queues a `notifications_outbox` row with provider=`retell` and channel=`voice`, and acknowledges with a confirmation turn. |
| 5 | `contact_capture` | ❌ missing | Custom function that normalizes phone/email (E.164 for `+91`, etc.), persists to `voice_calls.contacts` (column does not exist yet) or `provider_events.metadata`. |
| 6 | `send_info_request` | ❌ missing | Custom function that emails `ironwake.dev@gmail.com` the lead packet via `app/api/email` or the existing notifier (`lib/notifications/supabase-store.mjs`). |
| 7 | `human_handoff` | ⚠️ partial | The flow already has two `transfer_call` nodes pointing at `+185****0633` (redacted live; stored as a cold transfer). A `human_handoff` *custom* function (to log the handoff with reason + caller id into `provider_events`) is missing — currently the transfer happens silently with no record of why. |

**Plus:**
- `transcript_updated` is in `SUPPORTED_EVENTS` in code but not opted in on the dashboard — either remove from code or opt in.
- `is_published: false` on the live agent — push should publish version 4 before relying on it.

---

## 9. Verdict

```
PROVIDER_AUDIT=PARTIAL
```

**Evidence:**
- ✅ Real Retell API was called (`GET /get-agent/{id}` and `GET /get-conversation-flow/{flow_id}` — note: the v2 paths the task specified return 404; the canonical read paths used by the codebase returned 200 with full payload).
- ✅ Live `global_prompt` (2420 chars) is byte-for-byte identical to the canonical local rendering (`reports/retell-global-prompt-rendered.txt`) and to `lib/retell/prompt.js` (`v14.0.0-retell`). All 12 required content sections (brand, services, India ₹ pricing, Intl $ pricing, portfolio, industries, process, audit, booking, lead recovery, follow-up, limitations) are present.
- ✅ Webhook signature verification uses the raw body (`request.text()`) before any JSON parsing. HMAC-SHA256 base64 with `timingSafeEqual`. Defensive header casing + skew window + rate-limit budget + dedup.
- ✅ Secrets live in the operator vault, server-only; the adapter returns only `access_token` + `call_id` to the browser.
- ❌ **Zero custom tools / functions** are configured on the agent. All seven required business tools (`record_lead`, `request_audit`, `request_booking`, `callback_request`, `contact_capture`, `send_info_request`, `human_handoff`) are missing — no references anywhere in the codebase. `human_handoff` has a partial implementation via two `transfer_call` nodes but no logging.
- ⚠️ `is_published: false` — the live agent is a draft (v4 pending publish over base_version 3).
- ⚠️ `transcript_updated` event supported in `retell-webhook.mjs` but not subscribed on the dashboard.

PARTIAL (not VALID) because seven first-class business tools are absent, and (not INVALID) because provider sync, prompt parity, secrets discipline, and webhook HMAC all pass.

---

## 10. Do-not-modify statement

This run is **inspection + audit only**. No files were modified. The report is the only artefact produced. Suggested remediation is listed in §8 only.