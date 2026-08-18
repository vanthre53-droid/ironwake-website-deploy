# Retell Audit

**Audit date:** 2026-08-18 · **Mode:** read-only, surgical
**Workspace:** `/mnt/c/Users/vanth/Downloads/ironwake`
**Probe status:** BLOCKED_PROVIDER — no Retell MCP server registered in this session. `mcp__vapi__*` and `mcp__retell__*` tools both absent. All findings are sourced from code, migrations, and the `reports/` evidence pack.

**Secret presence only (NEVER read contents):**
- `~/.config/ironwake/cloudflare-migration/secrets/RESEND_WEBHOOK_SIGNING_SECRET` — file exists (`-rw-------`, 59 B). Not relevant to Retell.
- The expected `RETELL_API_KEY`, `RETELL_WEBHOOK_API_KEY`, `RETELL_AGENT_ID` keys are referenced by `scripts/worker-secrets-audit.mjs` lines 27–29 (declared as required worker secrets). **`RETELL_PHONE_NUMBER_ID` is NOT declared anywhere in source.** It appears only in prose (decision packet handoffs).
- `.env.example` does NOT define any `RETELL_*` variables. `worker-secrets-audit` enforces them as worker-side secrets only.

---

## Code-inferred agent setup

**Live readback (2026-08-17, `reports/RETELL_PROMPT_INJECTION_PLAN.md` §1 + `reports/retell-prompt-injection-evidence.md`):**

| Object | Value |
|---|---|
| `agent_id` | `agent_13eaebbdebd0cdf962680d26d7` |
| `agent_name` | `IronWake AI Receptionist` |
| `is_published` | `true` (post-publish, version 4) |
| `response_engine.type` | `conversation-flow` (not `retell-llm`) |
| `language` | `en-IN` |
| `voice_id` | `11labs-Amritanshu` |
| `webhook_url` | `https://ironwake.dev/api/webhooks/retell` |
| LLM | cascading `gpt-4.1` |
| Conversation flow | `conversation_flow_a9fa10e52c2d`, 13 nodes (1 welcome, 11 digit-press/transfer/end shims, 1 branch) |
| `global_prompt` | present (post-injection, charCount=2420) |

**Agent count: 1.** The codebase expects a single agent identified by `RETELL_AGENT_ID` env (see `lib/retell-server.mjs` line 68; `retellConfigured()` requires exactly `RETELL_API_KEY` + `RETELL_AGENT_ID`).

**Previous evidence (`reports/evidence/FINAL_PRODUCTION_EVIDENCE_BATCH2.md` line 77):**
`RETELL_AGENT_ID_VALIDATED=INVALID` — the prior `RETELL_AGENT_ID = agent_3b87b3dc7e4eb73ac0a2eb26` was not present in the workspace agent list (4 visible were generic templates). The current live agent `agent_13eaebbdebd0cdf962680d26d7` was injected post-readback.

---

## Sales prompt + knowledge base

**Sales prompt** lives on the conversation flow as `global_prompt`, NOT on the agent. Full text in `reports/retell-patch-payload.json` (charCount=2420 / ~1.05 KB). It includes:

- `[1] IDENTITY` — IronWake = founder-led agency; web, email, `en-IN`.
- `[2] FIVE PUBLISHED SYSTEMS` — all five Lite/Standard/Pro rows in INR + USD, rendered from the same source-of-truth used by `lib/pricing.mjs`.
- `[3] PORTFOLIO` — 9 demos listed (RapidPulse, DentaCare, Atelier, Aura, Bramble, Harbour, Luxe, Retech, Voltix) with explicit "Never claim these are paying clients" guard.
- `[4] CALL FLOW` — Greet → match to system → quote Lite-tier price for caller's region → offer Business Leak Audit or full CTA → booking redirects to `/book`, form to `/audit` with consent.
- `[5] HANDOFF & SCOPE` — explicit handoff for legal/tax/refund/contract/urgent/sensitive/abusive/out-of-scope/custom-quote. "No fabrication, no guaranteed outcomes."

**Assessment:** prompt is concrete, domain-grounded, and no-fabrication enforced. Welcome-node `instruction.text` is the live greeting ("Hi, this is the IronWake AI receptionist…") with 5 edge conditions routing to transfer/end nodes.

**Knowledge base:**
- `kb_config` configured on the flow (`{top_k: 4, filter_score: 0.6}`) — but **`knowledge_base_ids` is empty** (per live readback). KB endpoints that would populate it returned 500 prior to the readback (`RETELL_PROMPT_INJECTION_PLAN.md` §1 risk register); not retried.
- The `global_prompt` was chosen specifically to survive this gap — it carries the same canonical truth the website chat uses (`lib/ai-chat.mjs`'s `knowledgeBlock()`).
- Net: the prompt is the source of truth right now; KB is dormant but configured.

---

## Web-call capability

**Status: BROKEN on the client side.**

- `lib/retell-server.mjs` exports `createWebCall()` posting to `https://api.retellai.com/v2/create-web-call` (`/api/voice/session` route handler). Server side is sound and 100% unit-tested (`lib/retell-server.test.mjs` covers unconfigured, 401/403, 429, network, missing body, oversized customer ID).
- The browser launcher `app/components/VoiceSessionLauncher.js` lazy-loads the SDK via `loadRetellSdk()` (lines 47–62) using a string-concatenated `import('@retell/' + 'client-js-sdk')` to defeat the bundler.

**Critical issue:** the string `@retell/client-js-sdk` is **NOT in `package.json` and NOT in `node_modules/@retell/`**. `import()` will reject synchronously → `loadRetellSdk()` returns `null` → state forced to `UNAVAILABLE` (line 124). Even with a perfectly configured server, the browser launcher will never start a session.

Why it stays silent: the SDK load is wrapped in `try { … } catch { return null; }`. The browser is told "voice is currently unavailable" without log noise. Truthful UX, broken function.

**Server-side rate-limit + per-customer binding is wired** (`allowRequest('voice-session:${customerSupabaseUserId}')` in `app/api/voice/session/route.js`). CSP permits `connect-src https://api.retellai.com wss://*.retellai.com` and `media-src https://*.retellai.com` (`next.config.mjs`).

**Phone-call capability: NOT IMPLEMENTED.** Only `/v2/create-web-call` is called. No `create-phone-call`, no `register-phone-number`, no outbound dialer surface. `RETELL_PHONE_NUMBER_ID` is referenced only in prose handoffs (`reports/evidence/FINAL_PRODUCTION_EVIDENCE_BATCH2.md` line 78 refers to it as needed for outbound). Per `AGENCY_V2_2_UPGRADE_PACK/.../voice-agent-build/SKILL.md` line 9, "Client #1 = inbound-only" is the agreed posture, so this is **intentional**, not missing.

---

## Webhook signature verification

**Real.** `lib/notifications/retell-webhook.mjs` exports `verifyRetellSignature(rawBody, signatureHeader, secret)`:

- Header read: `X-Retell-Signature` (case-insensitive match in `route.js` line 103).
- HMAC-SHA256 over raw request body using the webhook secret.
- Base64-decoded signature compared via `timingSafeEqual`.
- `MAX_SKEW_MS = 5 * 60 * 1000` — timestamp / replay window enforced (readback at line 23).
- Returns `{ ok: false, reason: … }`; the route maps rejection to a generic 401 "Invalid webhook signature" without echoing the reason (line 107).

Wiring: `app/api/webhooks/retell/route.js` imports it via `import { verifyRetellSignature } from '@/lib/notifications/retell-webhook'` and passes the env secret `env.RETELL_WEBHOOK_API_KEY || env.RETELL_API_KEY` (line 90).

**Dead-code duplication:** `lib/retell-server.mjs` also exports a `verifyRetellSignature` (hex digest, no skew check) but it is **NOT imported by the webhook** and `route.js` does not bind to it. Tests exist for both. The hex version is unused and should be removed (saves a confusing footgun for the next reader).

---

## Languages supported

**One: `en-IN`.** The live agent is locked to `language=en-IN` and `voice_id=11labs-Amritanshu`. **No Telugu (`te`), no Hindi (`hi`) routing.** No multi-locale agent list, no language picker anywhere in `app/`, no `lib/multilang*` module.

This matches the documented scope ("Inbound-only … Client #1"). If voice coverage for India-market Hindi/Telugu callers is on the roadmap, it is **not implemented**.

---

## Idempotency + failure handling

**Idempotency is real and durable.**

- `lib/notifications/retell-webhook.mjs` lines 96–113 builds `providerEventId = ${type}:${callId}:${occurredAt}` as the stable key.
- `store.recordProviderEvent()` calls Supabase RPC `record_notification_provider_event(provider, provider_event_id, event_type, provider_message_id, occurred_at)` (`lib/notifications/supabase-store.mjs` lines 72–82). A `false` return signals duplicate — route maps to `received: true, duplicate: true, eventType` so Retell stops retrying.
- Durable table `public.voice_calls` has `unique (provider, call_id, event_type)` plus index `(call_id)` and `(occurred_at desc)` (`supabase/migrations/20260812110000_voice_calls_durable_audit.sql` lines 35–42). Re-deliveries land on the same row via upsert.
- RLS: `voice_calls_no_direct_select` / `voice_calls_no_direct_write` revoke `anon` and `authenticated`; only `service_role` and security-definer RPCs read/write.
- `safeCallUpsert()` writes the structured row (`agent_id`, `from_number` redacted downstream, `call_summary`, `user_sentiment`, `disconnection_reason`). `normalizeRetellEvent()` allowlists fields (`ALLOWED_FIELDS` set) — strips arbitrary keys before they hit Postgres.

**Failure handling — explicit & bucket-tested:**

| Bucket | `safeErrorCode` | HTTP |
|---|---|---|
| Missing env (no key / no agent) | `retell_unconfigured` | 503 |
| Retell API 401/403 | `retell_key_invalid` | 503 |
| Retell API 429 | `retell_rate_limited` | 429 |
| Retell API 5xx / network | `retell_provider_error` | 503 |
| Network unreachable (browser) | `retell_network_unreachable` | n/a (client) |
| Malformed response | `retell_malformed_response` | n/a (client) |
| Mic denied | `mic_denied` | n/a (client) |
| SDK absent | `not_supported` | n/a (client → `UNAVAILABLE`) |

Source: `lib/retell-server.test.mjs` lines 47–73 (server side) and `SAFE_LABELS` in `app/components/VoiceSessionLauncher.js` lines 32–41 (client).

Webhook itself: in-memory `allowRequest(‘retell-webhook:${identity}’, { limit: 600, windowMs: 60_000 })` rate-limit gates before verify. On storage failure the route returns 503 with `"Webhook could not be stored."` (Retell will retry).

**Self-improvement loop: NONE.** `call_analyzed` is normalized and persisted (`user_sentiment`, `call_successful`, `call_summary` are stored) — but nothing in this codebase calls back into the Retell agent to update the `global_prompt` based on call outcomes. No `lib/voice-coach.mjs`, no weekly retell-prompt-render script that reads `voice_calls` and patches the flow. The loop is **read-only on the LLM side** even after analysis.

---

## Severity-ranked issues

### Critical

1. **`@retell/client-js-sdk` is absent from `package.json`.** Browser launcher can never start a real session even with valid env. Voice widget permanently displays "Voice is currently unavailable." Server endpoint is fine; the link to the browser is severed.
   - Evidence: `package.json` has 14 deps total, none with `retell`. `node_modules/@retell/` does not exist. `app/components/VoiceSessionLauncher.js` line 47–62.

### High

2. **Dead-code `verifyRetellSignature` in `lib/retell-server.mjs`** — a different scheme (hex, no skew) exists alongside the wired one. No active call site, but unit tests cover it, so a future maintainer could swap the import and silently downgrade webhook security.
3. **No self-improvement loop.** `call_analyzed` writes `call_summary` + `user_sentiment` + `call_successful` to `voice_calls` but nothing reads them back to refine the prompt. The IronWake pricing/services truth drifts silently if the LLM ever hallucinates.
4. **Knowledge base empty.** `kb_config` configured, `knowledge_base_ids: []`. LLM lean entirely on the inline prompt. If Retell truncates the prompt or the flow grows past 1 page, KB retrieval becomes the only safety net — and it's not populated.

### Medium

5. **Single language, single voice.** No Hindi / Telugu. India-market reach ceiling.
6. **Webhook secret fallback** at `route.js` line 90: `env.RETELL_WEBHOOK_API_KEY || env.RETELL_API_KEY`. If only `RETELL_API_KEY` is present, the same secret both signs webhooks AND authorizes outbound `/v2/create-web-call` — single secret compromise = full pivot. Encourage forcing them apart (CSP / worker-secrets audit doesn't).
7. **`is_published: true` verified only by `GET /get-agent` snapshot** (`reports/retell-agent-post-publish.json`) — not asserted by an automated test. Drift detection between expected state and live agent is manual.

### Low

8. **`call_type` is captured but never consulted** in `voice_calls` table. Outbound vs web_call vs phone_call stream are indistinguishable in audit dashboard.
9. **`providerEventId` is string-concat, not crypto.** Collision risk if two webhooks share `{type, callId, occurredAt}` — fine in practice (Retell supplies ms-resolution + per-call-id uniqueness), but the key is not namespace-isolated across providers.
10. **No `publish-flow` step run** (`retell-prompt-injection-evidence.md` line 157 confirms `publish-agent` was called, `publish-flow` was NOT). The dashboard's version dropdown may show pre-injection version; not user-facing but a dashboard drift hazard.

---

## Surgical fixes (≤ 5)

### Fix 1 — Wire the Retell web-call SDK into the bundle **[Critical]** · ~25 LOC, 1 file

Add to `package.json` `dependencies`:
```json
"@retell/client-js-sdk": "^0.0.39"
```
Replace the dynamic-import block in `app/components/VoiceSessionLauncher.js` lines 47–62 with a plain `import { RetellWebClient } from '@retell/client-js-sdk';`. Keep the SDK-absent fallback only as a defensive guard, not a primary path.

```diff
- // in VoiceSessionLauncher.js
- async function loadRetellSdk() { … new Function('p', 'return import(p)') … }
- const sdk = await loadRetellSdk();
+ import { RetellWebClient } from '@retell/client-js-sdk';
+ const sdk = RetellWebClient;
```
**Diff estimate:** ~25 LOC across two files (`package.json` plus launcher), plus `npm install` and a CSP re-confirm. Should be paired with a smoke test that asserts the launcher reaches `STATES.LISTENING`.

### Fix 2 — Delete the dead verifier in `lib/retell-server.mjs` **[High]** · ~15 LOC, 1 file

Remove `verifyRetellSignature` export + its crypto path from `lib/retell-server.mjs`. Update `lib/retell-server.test.mjs` to import from `lib/notifications/retell-webhook.mjs` instead (or drop those two test cases — they test nothing live). One commit, zero functional change.

### Fix 3 — Self-improvement skeleton: a one-job weekly reader of `voice_calls` **[High]** · ~60 LOC new + 1 cron route

Add `app/api/cron/retell-prompt-refresh/route.js` that:
1. Reads the last 50 `voice_calls` rows where `event_type='call_analyzed'` and `call_successful=false OR user_sentiment IN ('Negative','Frustrated')`.
2. Renders the existing `global_prompt` (extracted from `reports/retell-patch-payload.json`'s template verbatim — do NOT hand-edit).
3. Appends a `[6] RECENT FAILURE PATTERNS` block listing de-identified themes ("caller asked for Pro-tier pricing on missed-lead-recovery — answer quoted Lite only").
4. PATCHes `global_prompt` to `conversation_flow_a9fa10e52c2d` via `lib/retell-server.mjs` (new `updateConversationFlow` export, sibling to `createWebCall`).

Skipped: a feedback UI ("was this call good?") — YAGNI; `user_sentiment` from Retell's analysis is enough for v1.

### Fix 4 — Knowledge base population via the survived endpoint **[Medium]** · ~40 LOC + 1 PATCH

The plan flagged `/create-knowledge-base-sources` as the real (non-500) endpoint. Add `attachKnowledgeSources()` in `lib/retell-server.mjs` posting 3 curated URLs (ironwake.dev/pricing, ironwake.dev/work, ironwake.dev/systems) + `lib/ai-chat.mjs`'s `knowledgeBlock()` rendered to markdown. PATCH the flow with `knowledge_base_ids` populated. Skip retrying the legacy 500 endpoints.

### Fix 5 — Pin webhook secret independently **[Medium]** · 1 line, env only

In `app/api/webhooks/retell/route.js` line 90, change:
```diff
- const webhookSecret = String(env.RETELL_WEBHOOK_API_KEY || env.RETELL_API_KEY || '').trim();
+ const webhookSecret = String(env.RETELL_WEBHOOK_API_KEY || '').trim();
```
Update `scripts/worker-secrets-audit.mjs` to FAIL (not warn) if `RETELL_WEBHOOK_API_KEY` is missing on deploy. This makes the operator set both secrets explicitly, eliminating the single-secret pivot.

---

**End of audit. No API keys logged. No writes beyond this capsule.**
