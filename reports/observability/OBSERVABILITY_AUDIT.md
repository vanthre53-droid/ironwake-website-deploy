# Observability Audit — IronWake

**Audit date:** 2026-08-20
**Scope:** `/mnt/c/Users/vanth/Downloads/ironwake`
**Mode:** Read-only inspection (no source files were modified).
**Auditor:** Subagent task `observability_audit`

---

## 1. Executive Summary

IronWake ships a **thin, Sentry-only observability stack** with **no request-ID / correlation layer, no structured logger, no metrics emitter, and no public health endpoint**. Logging is done with raw `console.error` calls inside a handful of API routes. The only durable retry telemetry lives in the **Supabase notification state machine** (`outbox_events` / `notification_attempts` / `provider_events`) — the code itself does not retry or backoff; the DB does.

The codebase is intentionally small (one Next.js app, ~10 API routes, ~5 webhook surfaces). The blast radius of "no request IDs" is therefore limited, but every webhook handler and every owner action is currently opaque: when Meta retries a delivery or a Resend event hits a 401, there is no single ID you can grep across the request, the durable store, and Sentry.

**Verdict:** **MISSING** for correlation/structured-logging/PII-redaction/metrics; **PARTIAL** for retry tracking (only notification outbox); **PRESENT** for provider-state probing (owner-dashboard only).

---

## 2. Inventory of What Exists

### 2.1 Observability-adjacent files (read)

| Path | Purpose |
| --- | --- |
| `sentry.server.config.js` | Sentry server-side init (traces sample rate 0, no beforeSend hook). |
| `sentry.edge.config.js` | Sentry edge init (same shape). |
| `instrumentation.js` | Loads `sentry.server.config` + `sentry.edge.config` via Next.js `register()`. |
| `middleware.js` | Next.js root middleware — auth/admin gate only, **does not inject request IDs or correlation headers**. |
| `lib/request-rate-limit.mjs` | Per-IP identity hashing; used by webhooks. Not an observability file. |
| `lib/provider-state.mjs` | Read-only probes for Retell / Meta / Supabase / Cloudflare. Called from `/api/owner/provider-state`. |
| `lib/notifications/supabase-store.mjs` | Durable outbox + retry-cycle plumbing (RPC `claim_notification_events`, `finish_notification_attempt`, `record_notification_provider_event`). |
| `lib/notifications/worker.mjs` | Cron-driven worker loop, claims events, calls adapter, finishes attempts. |
| `lib/notifications/whatsapp-adapter.mjs` | `retryableProviderError()` returns `true` for 408 / 429 / 5xx — drives retry classification. |
| `lib/notifications/resend-adapter.mjs` | Same shape as WhatsApp adapter (not read in this audit but verified via grep). |
| `lib/sentry-dsn.mjs` | DSN + env resolver for Sentry init. |

### 2.2 API surfaces (read)

| Path | Method(s) | Auth | Notes |
| --- | --- | --- | --- |
| `app/api/audit/route.js` | POST | Rate-limit per IP | Visitor intake; mutates `inquiries`, `audit_logs`. |
| `app/api/chat/route.js` | POST | Origin allowlist + optional HMAC | AI chat reply. |
| `app/api/cron/notifications/route.js` | POST | `Authorization: Bearer CRON_SECRET` | Drains the notification outbox. |
| `app/api/owner/export/route.js` | POST | AAL2 + owner email | PII export. |
| `app/api/owner/notification-readiness/route.js` | POST | AAL2 + owner email | Reads notification config. |
| `app/api/owner/provider-state/route.js` | POST | AAL2 + owner email | Calls `probeAll()` from `lib/provider-state.mjs`. |
| `app/api/owner/whoami/route.js` | POST | AAL2 + owner email | Identity probe. |
| `app/api/voice/session/route.js` | POST | Origin + HMAC + Referer | Issues Retell web-call token. |
| `app/api/webhooks/meta/whatsapp/route.js` | GET / POST | Meta HMAC | Inbound WhatsApp webhook (only acks + dedup). |
| `app/api/webhooks/resend/route.js` | POST | Resend signature | Email delivery events. |
| `app/api/webhooks/retell/route.js` | POST | Retell signature | Voice call events. |
| `app/api/whatsapp/start/route.js` | POST | Idempotency-Key + IP rate-limit | Visitor-initiated WhatsApp template send. |
| `app/meta/data-deletion/route.js` | POST | Meta signed_request | Records Meta deletion request. |

No `app/api/health*`, `app/api/ready*`, `app/api/metrics*`, `app/api/status*` route exists.

---

## 3. Per-Criterion Findings

### 3.1 REQUEST_ID — **MISSING**

There is **no request-ID / correlation-ID generator or middleware** anywhere in the project.

- `middleware.js` runs `stack-auth-handler` + a bot blocklist; it does **not** read or inject `X-Request-Id`, does not call `crypto.randomUUID()`, and does not propagate anything via `request.headers` or response headers.
- A grep for `requestId|x-request-id|correlation|observab|metrics` across `*.js` / `*.mjs` returns **zero hits in any API route file**.
- The Sentry init uses `tracesSampleRate: 0` so even Sentry-internal trace IDs are dropped.
- `lib/notifications/supabase-store.mjs` does generate `idempotencyKey` values for outbox events — these are *not* request IDs, they are per-event dedup tokens.
- `lib/notifications/worker.mjs` line 21 generates `workerId = "ironwake-notification-<uuid>"` — this is a per-invocation worker ID, surfaced in the durable store, but **not echoed back to the HTTP request that queued the work**.

**Where it should be added (every API route):**

A single helper + middleware pair would cover all surfaces. The cleanest insertion points:

1. **`/middleware.js`** — add a `requestId` generator at the top of `middleware()`, set `request.headers.set('x-request-id', id)`, and **return `NextResponse.next({ headers: { 'x-request-id': id } })`** so the header is echoed on the response. The function is called on every matched request, which in this app is `/admin/*` and `/owner/*` (see `matcher`). **This will NOT cover the API routes because `middleware.js` is restricted by `matcher` to admin paths only.**
2. **Therefore the only correct place to guarantee coverage on every API route is inside each route handler**, before the first response. Recommended file: create `lib/observability/request-id.mjs` exporting `withRequestId(request, handler)` (or a higher-order wrapper). Exact insertion lines per route:

| Route file | Line | What to add |
| --- | --- | --- |
| `app/api/audit/route.js` | `~24` (first line of `POST`) | `const requestId = newRequestId();` then include `requestId` in every `console.error` payload and in response headers. |
| `app/api/chat/route.js` | first line of `POST` | same |
| `app/api/cron/notifications/route.js` | first line of `POST` (currently line 17) | same |
| `app/api/owner/export/route.js` | first line of `POST` (currently line 31) | same |
| `app/api/owner/notification-readiness/route.js` | first line of `POST` (currently line 19) | same |
| `app/api/owner/provider-state/route.js` | first line of `POST` | same |
| `app/api/owner/whoami/route.js` | first line of `POST` (currently line 32) | same |
| `app/api/voice/session/route.js` | first line of `POST` | same |
| `app/api/webhooks/meta/whatsapp/route.js` | first line of `POST` (currently line 36) AND first line of `GET` (line 22) | same; also include `requestId` in the `recordOptOut` and `checkDedup` payloads |
| `app/api/webhooks/resend/route.js` | first line of `handleResendWebhook` (currently line 17) | same |
| `app/api/webhooks/retell/route.js` | first line of `POST` | same |
| `app/api/whatsapp/start/route.js` | first line of `POST` (currently line 117) | same — also include in `setCachedIdempotent` payload so retries surface the same ID |
| `app/meta/data-deletion/route.js` | first line of `POST` (currently line 28) | same; include in `recordDeletionRequest` payload |

**Recommendation:** Create `lib/observability/request-id.mjs` exporting `newRequestId()` and a `withRequestHeaders(headers)` helper, then have a single `route.js` wrapper or a build-time codemod. Do **not** rely solely on `middleware.js` — its `matcher` only covers admin paths.

### 3.2 STRUCTURED_LOGGING — **MISSING**

IronWake has no structured logger. Logging is done with raw `console.error` calls inside API routes:

- `app/api/audit/route.js` lines 46, 65, 83, 107, 118, 133 — six `console.error('[audit] ...', {...})` calls with ad-hoc key/value payloads. No level, no timestamp, no request ID, no service name, no JSON envelope.
- `app/api/webhooks/meta/whatsapp/route.js` — no logging at all (silent failures on lines 113–118 and 137–138).
- `app/api/webhooks/resend/route.js` — no logging at all.
- `app/api/webhooks/retell/route.js` — no logging at all (read verified).
- `app/api/whatsapp/start/route.js` — no logging at all.
- `lib/provider-state.mjs` — no logging.
- `lib/notifications/worker.mjs` — no logging.

**Format today:** ad-hoc `console.error('[tag] message', { ...safeKeys })`. Not JSON, not parsed, not shipped anywhere except stdout → hosting-platform logs.

**Where it should be added:** create `lib/observability/logger.mjs` exporting a Pino-style or hand-rolled JSON logger (`{ ts, level, service, request_id, msg, ...ctx }`). Replace every `console.error` in the six files above with `log.error('audit.missing_env', { requestId, hasUrl, hasServiceKey })`.

### 3.3 CORRELATION_HEADERS — **MISSING**

There is no header-based correlation. Verified absences:

- No route reads `x-request-id`, `x-correlation-id`, `traceparent`, `tracestate`, or `fly-replay` from the request.
- No route writes `x-request-id`, `traceparent`, or any correlation header on the response.
- `app/api/cron/notifications/route.js` reads `authorization` and never echoes it back.
- `app/api/owner/export/route.js` writes `vary: authorization` and `cache-control: private` but no correlation header.
- The Meta / Resend / Retell webhook handlers do not propagate the `x-request-id` Meta/Resend/Retell sometimes send us (which would be free correlation).

**Where it should be added:** same locations as §3.1 — read inbound `x-request-id` (or `x-correlation-id`) and echo it on the response; if missing, generate a new one.

### 3.4 PROVIDER_HEALTH_ENDPOINT — **PARTIAL**

A **public** provider health endpoint does **not** exist. A **private (owner-auth)** probe surface does exist:

- `lib/provider-state.mjs` lines 355–370 — `probeAll()` runs `probeRetell` / `probeMeta` / `probeSupabase` / `probeCloudflare` in parallel.
- `app/api/owner/provider-state/route.js` — POST handler that wraps `probeAll()` and returns `{ retell, meta, supabase, cloudflare, lastProbed }` to the owner dashboard after AAL2 + email check.

The probes themselves are sound: read-only, timeout-bounded (`DEFAULT_TIMEOUT_MS = 4_000`), token-redacting (`redactError` line 43, `redactUrl` line 293).

**Missing pieces:**

- No public `/api/health` (or `/api/readyz` / `/api/livez`) for uptime monitors. Owner dashboard requires AAL2 so external ping services (Better Uptime, Statuspage, etc.) cannot reach it.
- No Kubernetes-style readiness vs liveness split.
- The probe verdict vocabulary (`VERIFIED` / `NOT_CONFIGURED` / `UNREACHABLE`) is duplicated in code rather than shared.

**Where to add:** create `app/api/health/route.js` (public, returns `200 {status: 'ok'}` if the process is alive) and `app/api/ready/route.js` (calls `probeAll()` with **no secrets in the response** — the existing `lib/provider-state.mjs` already redacts, so reuse it).

### 3.5 METRICS — **MISSING**

No metrics endpoint, no Prometheus exporter, no StatsD/OTel collector, no counters, no histograms.

- No `/api/metrics`, no `/metrics`.
- No `lib/metrics*` file.
- `instrumentation.js` calls Sentry init but `tracesSampleRate: 0` so Sentry's own metrics are dropped too.
- The only "metric-shaped" data is the **return values** of `runNotificationWorker` (`lib/notifications/worker.mjs` lines 40–88) which counts `claimed`, `accepted`, `retryScheduled`, `deadLettered`, `failedToFinish`. These are returned but never persisted, logged, or shipped anywhere.

**Where to add:** create `lib/observability/metrics.mjs` with at minimum `mutation_attempt_total{mutation,outcome}` and `provider_request_duration_ms{provider,outcome}` counters. Expose at `/api/metrics` for a scraper, or push to StatsD / OTLP.

### 3.6 RETRY_TRACKING — **PARTIAL** (notification outbox only)

Retry tracking **exists** for outbound notifications (email + WhatsApp), implemented as a **durable Postgres state machine** — not in app code:

- `supabase/migrations/20260809170000_targeted_notification_claim.sql` lines 19–20, 44–98 — `retry_cycle` and `attempt_number` columns on `outbox_events` / `notification_attempts`, and the `claim_notification_events` / `finish_notification_attempt` RPCs.
- `lib/notifications/supabase-store.mjs` lines 51–62 — `finish({ outcome, retryable, ... })` writes the attempt result back via RPC.
- `lib/notifications/whatsapp-adapter.mjs` lines 26–29 — `retryableProviderError()` returns `true` for 408 / 429 / 5xx.
- `lib/notifications/worker.mjs` lines 71–86 — counts `accepted`, `retryScheduled`, `deadLettered`, `failedToFinish` in the return value, but **does not log them or persist them anywhere besides the per-attempt row**.

**Gaps:**

- No retry tracking on the **inbound webhook** side (Meta, Resend, Retell): we dedup but do not count retries.
- No retry tracking on the **audit intake** RPC (`submit_audit_inquiry`): if the RPC throws, the route returns 502 with no metric.
- No retry tracking on the **Retell session token** endpoint (`app/api/voice/session/route.js`): no backoff on Retell 429s.
- No retry tracking on the **WhatsApp start** endpoint (`app/api/whatsapp/start/route.js`): idempotency is honored but no retry counter.

**Where to add:** wrap each adapter / fetch call in a `withRetry({ maxAttempts: 3, baseMs: 250, maxMs: 4000, jitter: 'full' })` helper in `lib/observability/retry.mjs`, and emit a `mutation_retry_total{mutation,attempt}` counter on every retry.

### 3.7 PII_REDACTION — **PARTIAL**

PII redaction is **partial and inconsistent**. The existing code redacts in narrow, defensive places but never as a first-class log shim:

- `lib/provider-state.mjs` line 43–51 — `redactError()` strips `Bearer <token>` and long alphanumeric substrings from error messages. **Good**, but only applied inside probes.
- `lib/provider-state.mjs` line 293–300 — `redactUrl()` strips path/query from Supabase URLs. **Good**.
- `lib/notifications/whatsapp-adapter.mjs` lines 73, 78, 79, 80, 83, 90, 92, 141–148, 153 — strips `Authorization` header from logged fetches (no fetch logger actually runs today, but the adapter never logs the body), truncates `text` to 4096 chars (line 62) and template variables to 256 chars (line 118). **Good defence-in-depth.**
- `lib/notifications/resend-adapter.mjs` (not read in detail; verified to exist) — same shape.
- `lib/meta-webhook-verify.mjs` (used by `app/api/webhooks/meta/whatsapp/route.js`) — stores only the `wamid` / opt-out keyword; no message bodies persist.

**Gaps:**

- `app/api/audit/route.js` logs `parsed.data` shape by reference nowhere, but it persists the raw `email` and `leak_description` into `inquiries`. If anyone adds `console.error('audit.inquiry', parsed.data)` later, the email leaks.
- `app/api/chat/route.js` (not read in detail) is the highest-risk surface: visitor-supplied free text flows through an LLM. There is no central redaction layer on what gets logged.
- `app/api/whatsapp/start/route.js` line 175–180 — `to: phone` and the phone itself are passed to Meta but never logged (good), yet the in-memory `idempotencyCache` (line 32) holds the response which includes `to: phone.replace(/^\+/, '')` — a real visitor phone number sitting in process memory with no TTL rotation.
- The `recordOptOut({ from, keyword })` call in `app/api/webhooks/meta/whatsapp/route.js` line 102 inserts raw `wa_from` and `keyword` into `meta_opt_outs`. That is intentional PII storage; no redaction needed there, but no retention policy is enforced anywhere.

**Where to add:** central `lib/observability/redact.mjs` exporting `redactPii(value)` that strips emails, E.164 phones, IBANs, and JWTs. Apply inside the new logger's `beforeWrite` hook so all log output is redacted by default.

---

## 4. Five Most Critical Mutations to Track

The five mutations that **must** be observable end-to-end (request → DB row → provider ack → Sentry event):

| # | Mutation | Route / Module | File:line where tracking should be added | Why it is critical |
| --- | --- | --- | --- | --- |
| 1 | **Audit submission** (`submit_audit_inquiry` RPC) | `POST /api/audit` | `app/api/audit/route.js:55` (just before the `supabase.rpc('submit_audit_inquiry', …)` call). Emit `mutation_attempt_total{mutation="audit_submit"}`; emit `mutation_success_total{mutation="audit_submit"}` after the RPC returns; on `error`, emit `mutation_failure_total{mutation="audit_submit", code=...}`. | Only inbound visitor mutation. Single point of failure for the funnel. |
| 2 | **Booking submission** *(== audit submission in this codebase)* | `POST /api/audit` | Same as #1 — there is **no separate booking route** in this app. The booking state machine is documented at `app/systems/booking-control/BookingControlSystem.js` and `supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs`, but it is enforced inside the same RPC. If a future split creates `app/api/booking/route.js`, that file's POST handler is the insertion point. | The "booking submission" the brief names is the audit intake — they are the same surface today. |
| 3 | **Chat message** (visitor → AI → reply) | `POST /api/chat` | First line of `POST` in `app/api/chat/route.js` (after origin/HMAC guards). Emit `mutation_attempt_total{mutation="chat_reply"}` and a `provider_request_duration_ms{provider="openai_anthropic", outcome="ok\|error"}` around the LLM call (currently the call lives inside the route handler — `lib/ai-chat.mjs` is the helper). | Free-text visitor input is the highest-PII surface; needs request IDs for prompt-injection forensics. |
| 4 | **Retell call event** (inbound webhook) | `POST /api/webhooks/retell` | First line of `POST` in `app/api/webhooks/retell/route.js` — emit `mutation_attempt_total{mutation="retell_webhook"}` and a counter split on Retell's `event` field (`call_started`, `call_ended`, `call_analyzed`). | Provider-driven, retries heavily, currently silent. |
| 5 | **WhatsApp message** (inbound Meta webhook **or** outbound `/api/whatsapp/start`) | Two insertion points: <br>• `app/api/webhooks/meta/whatsapp/route.js:36` (inbound) <br>• `app/api/whatsapp/start/route.js:117` (outbound) | Emit `mutation_attempt_total{mutation="whatsapp_inbound", outcome="ok\|duplicate\|opted_out"}` and `mutation_attempt_total{mutation="whatsapp_outbound", outcome="accepted\|rate_limited\|provider_unreachable\|meta_error"}`. | Cost-bearing, retries for hours, no current telemetry. |

(If "booking submission" must be a distinct row when the booking route is split out, the entry point becomes `app/api/booking/route.js`'s POST handler at its first line.)

---

## 5. Where to Place New Code (Insertion Map)

Suggested file plan — **no code is written in this audit, only listed here for the follow-up build task.**

- `lib/observability/request-id.mjs` — `newRequestId()`, `getRequestId(request)`, `withCorrelationHeaders(response, requestId)`.
- `lib/observability/logger.mjs` — JSON logger with `info/warn/error` levels, auto-injects `requestId` from `async_hooks` context.
- `lib/observability/metrics.mjs` — in-memory counters + `/api/metrics` exporter (Prometheus text format).
- `lib/observability/redact.mjs` — `redactPii(value)` for emails, phones, tokens, JWTs.
- `lib/observability/retry.mjs` — `withRetry({ fn, maxAttempts, baseMs, maxMs, jitter })`.
- `app/api/health/route.js` — public `200 {status:'ok'}` liveness.
- `app/api/ready/route.js` — public readiness via `probeAll()` from `lib/provider-state.mjs` (already safe to expose).
- `app/api/metrics/route.js` — protected metrics export (or public if the data is non-sensitive).
- Update `middleware.js` to inject `x-request-id` on responses for the admin matcher scope (does NOT cover API routes — API routes must self-instrument as per §3.1).
- Update `instrumentation.js` to load the new modules on boot and seed `AsyncLocalStorage` with `requestId` so adapters can read it without threading it through every function.

---

## 6. Risk if Nothing Is Done

1. **Sentry cannot correlate** an inbound webhook failure to the originating HTTP request — `tracesSampleRate: 0` and no `requestId` linkage.
2. **Meta webhook duplicates** (Meta retries the same `wamid` for hours) are dedup'd by Postgres unique index but produce **zero telemetry** when they fire; you only see them by accident when storage fails.
3. **Retell call events** that fail signature verification return 401 with no log — incident response is blind.
4. **Visitor chat PII** flows into the LLM provider with no request-ID envelope — a prompt-injection incident has no audit trail to the originating request.
5. **Notification retry storms** are invisible to operators; the only signal is "the dead_letter row appeared in `outbox_events`."

---

## 7. Audit Verdict

**AUDIT_RESULT = PARTIAL**

Rationale:

- **Provider probing** is present (owner-only).
- **Retry tracking** is partial (outbox only).
- **PII redaction** is partial (defensive at fetch boundaries, no log-level shim).
- **Request IDs, structured logging, correlation headers, public health endpoint, metrics** are **missing**.
- **No code was modified** during this audit — the report is the deliverable.

The follow-up implementation task should be a **separate, scoped build** that adds `lib/observability/*`, the three new routes, and the 13 route-handler insertion points listed in §3.1.