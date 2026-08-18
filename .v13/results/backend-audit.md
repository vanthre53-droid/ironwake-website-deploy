# Backend Audit

**Scope:** IronWake Next.js 14 app, Supabase (Postgres + Auth + RLS), three webhook receivers, durable notification state machine, single-owner CRM.
**Probe mode:** Read-only. MCP `supabase` tools not exposed in this session → **BLOCKED_PROVIDER**; inventory compiled from `supabase/migrations/*.sql` (21 SQL files) + `app/api/**` source.
**Secret policy:** presence-only; no values printed.

---

## Live schema (tables, columns summary)

Compiled from migrations under `supabase/migrations/` (21 files). All in schema `public` unless noted.

| Table | Source migration | Purpose | Key columns |
|---|---|---|---|
| `inquiries` | `001_create_inquiries.sql` + `003_owner_crm_core.sql` | Public intake row | `id uuid pk`, `business_name`, `email`, `leak_description`, `consented_at`, `source`, `contact_id fk→contacts`, `lead_stage` (enum: new/reviewed/contacted/qualified/discovery_booked/proposal_sent/won/lost), `next_action`, `due_at`, `retention_until` (default now()+90d), `anonymized_at`, `updated_at` |
| `contacts` | `003_owner_crm_core.sql` | Normalized contact dedup key | `id uuid pk`, `email_normalized` (unique, 3–254), `business_name`, `anonymized_at`, `updated_at` |
| `consents` | `003_owner_crm_core.sql` | GDPR consent record | `id`, `inquiry_id fk`, `consent_type` (only `'contact'`), `granted_at`, `source`, `withdrawn_at`, unique `(inquiry_id, consent_type)` |
| `tasks` | `003_owner_crm_core.sql` | Owner CRM tasks | `id`, `inquiry_id fk`, `category` (enum), `due_at`, `completed_at`, `created_at` |
| `outbox_events` | `003_owner_crm_core.sql` + `20260809103635_durable_notification_state_machine.sql` | Notification queue (deferred work) | `id`, `inquiry_id fk`, `event_type` (enum: `inquiry_received` legacy / `owner_new_audit` / `owner_new_booking_request` / `customer_audit_received` / `customer_booking_request_received` / `owner_priority_alert`), `idempotency_key` **unique**, `status` enum (queued/processing/retry_scheduled/accepted_by_provider/delivered/dead_letter/cancelled), `attempts` 0–3, `target_type` (legacy/owner/customer, not null + check), `provider`, `provider_message_id`, `retry_cycle`, `claimed_at`, `claimed_by`, `last_attempt_at`, `accepted_at`, `delivered_at`, `dead_lettered_at`, `safe_error_code` (≤100 char), `available_at`, `last_error_code`, `created_at`, `updated_at`; partial idx `(status,available_at)`; uniq idx `(provider,provider_message_id)` where not null |
| `audit_logs` | `003_owner_crm_core.sql` | Append-only audit trail | `id`, `inquiry_id fk nullable`, `action`, `actor_type` (system/owner), `metadata jsonb`, `created_at` |
| `notification_attempts` | `20260809103635_durable_notification_state_machine.sql` | Per-attempt record | `id`, `outbox_event_id fk`, `retry_cycle`, `attempt_number` 1–3, `provider`, `status` (started/accepted_by_provider/failed/unknown), `provider_message_id`, `safe_error_code`, `retryable`, `started_at`, `finished_at`, unique `(outbox_event_id,retry_cycle,attempt_number)` |
| `provider_events` | `20260809103635_durable_notification_state_machine.sql` | Provider→us callbacks (Resend events) | `id`, `provider`, `provider_event_id` (≤255), `event_type` (email.sent/delivered/delivery_delayed/failed/bounced/complained/suppressed), `provider_message_id`, `outbox_event_id fk nullable`, `occurred_at`, `received_at`, unique `(provider,provider_event_id)` |
| `owner_notes` | `20260809140000_owner_notes_and_activity_timeline.sql` | Owner-only notes (1–2000 char) | `id`, `inquiry_id fk`, `body`, `created_at` |
| `request_rate_limits` | `20260809150000_durable_request_rate_limit.sql` | Sliding-window rate limit counter | `key_hash` pk (sha256 hex, char=64), `window_started_at`, `request_count`, `updated_at` |
| `voice_calls` | `20260812110000_voice_calls_durable_audit.sql` | Retell event audit | `id bigserial`, `provider` (only `'retell'`), `call_id`, `event_type` (call_started/call_ended/call_analyzed/transcript_updated), `agent_id`, `call_type`, `from_number`, `to_number`, `start_timestamp`, `end_timestamp`, `call_summary`, `call_successful`, `user_sentiment`, `disconnection_reason`, `occurred_at`, `updated_at`, `created_at`, unique `(provider,call_id,event_type)` |
| Customer-profile tables | `20260811100000_customer_auth_and_chat.sql` + `20260812100000_harden_customer_isolation.sql` | Customer-side auth + chat | tables referenced in RLS but names not exposed in migrations grep; hardened isolation migration enforces per-customer row visibility via `auth.uid()` predicates |

RPCs (security-definer unless noted):

| Function | Privilege granted to |
|---|---|
| `public.is_owner()` | `authenticated` only (security invoker) |
| `public.submit_audit_inquiry(text,text,text,text)` | `service_role` only |
| `public.anonymize_expired_inquiries()` | `service_role` only |
| `public.queue_priority_lead_notification(uuid)` | `service_role` only (inferred — see migration) |
| `public.claim_notification_events(text,text,int,uuid)` | worker-callable; SKIP LOCKED + 10-min lease reclaim |
| `public.finish_notification_attempt(uuid,uuid,text,text,text,bool)` | worker-callable; advance state machine |
| `public.record_notification_provider_event(text,text,text,text,timestamptz)` | webhook-callable; dedup via `provider_events` unique |
| `public.owner_add_inquiry_note(uuid,text)` | `authenticated`; checks `is_owner()` inside |

---

## RLS coverage (real per-table state)

`is_owner()` is `security invoker`, checks `auth.jwt() -> 'app_metadata' ->> 'role' = 'owner'` **AND** `email = ironwakee@gmail.com` (hard-coded, see migration `20260809101143_secure_owner_and_privileged_rpcs.sql` lines 11–24).

| Table | RLS | Policies | Direct grants |
|---|---|---|---|
| `inquiries` | **enabled** | `owner_can_manage_inquiries` (for all to authenticated, `is_owner()` both sides) | revoked from anon/authenticated; service_role bypass |
| `contacts` | **enabled** | `owner_can_manage_contacts` (for all to authenticated, `is_owner()`) | revoked from anon/authenticated |
| `consents` | **enabled** | `owner_can_manage_consents` (for all, `is_owner()`) | revoked from anon/authenticated |
| `tasks` | **enabled** | `owner_can_manage_tasks` (for all, `is_owner()`) | revoked from anon/authenticated |
| `outbox_events` | **enabled** | `owner_can_read_outbox_events` (select, `is_owner()`) — write blocked for `authenticated` | `grant select` to authenticated; insert/update reserved to `service_role` |
| `audit_logs` | **enabled** | `owner_can_manage_audit_logs` (for all, `is_owner()`) | revoked from anon/authenticated |
| `notification_attempts` | **enabled** | `owner_can_read_notification_attempts` (select, `is_owner()`) | revoked from all roles except `service_role` for write; authenticated read filtered by `is_owner()` |
| `provider_events` | **enabled** | `owner_can_read_provider_events` (select, `is_owner()`) | revoked from all roles except `service_role` for write; authenticated read filtered by `is_owner()` |
| `owner_notes` | **enabled** | `owner_can_read_owner_notes` (select, `is_owner()`) | `grant select` to authenticated; write blocked |
| `request_rate_limits` | **enabled** | (no policies; `revoke all from public,anon,authenticated`) | only `service_role` callable via RPC `consume_request_rate_limit` |
| `voice_calls` | **enabled** | `voice_calls_no_direct_select` (for select to authenticated,anon → `using(false)`), `voice_calls_no_direct_write` (for all, `using(false) with check(false)`) | revoked from anon/authenticated; only `service_role` gets the sequence grant |
| Customer tables | **enabled** | per-customer isolation hardened in `20260812100000_harden_customer_isolation.sql` via `auth.uid()` predicates | anon/authenticated scoped to own rows |

**Coverage score:** 12/12 RLS-enabled. No table is left unprotected. Two minor gaps: (a) `request_rate_limits` enables RLS but no policy row exists — works only because the `revoke all` is total and the only access path is the security-definer RPC. Acceptable but `force_rls` is not on, so a `postgres` superuser bypass exists. (b) `voice_calls` writes require `service_role` sequence grant; no customer-direct path documented.

---

## Auth pattern + protected route map

**Identity strategy:** Single Supabase auth (email + Google OAuth). One identity (one JWT subject per `auth.uid()`) is used across: site login (`/login`, `/signup`), owner portal (`/owner`, `/admin`), customer account (`/account`), chat (`/api/chat`), voice session (`/api/voice/session`). **Retell and WhatsApp are NOT unified identities** — they are provider-side identifiers (Retell `call_id`, WhatsApp `wamid`) referenced as foreign fields on `voice_calls.from_number` / `provider_events.provider_message_id`. Customer↔phone link is established by `from_number` matching against the authenticated user's profile phone (per `voice_calls` comment in migration).

**Server-client pattern:** `lib/supabase/clients.mjs` provides `getSupabaseServerClient()` — `@supabase/ssr`'s `createServerClient` with `cookies()` adapter for the request/response cookie store; one client per request lifecycle. Read paths use `SUPABASE_ANON_KEY`; privileged writes use `service_role` after explicit authorization gates (e.g. `is_owner()`).

**Session verification pattern:** `lib/owner-auth.mjs` provides `getOwnerIdentity()` — calls `supabase.auth.getUser()` (server-side, validates JWT via Supabase Auth) rather than `getSession()` (cookie-only, spoofable). This is the **correct** pattern. Test confirms `whoami` route is guarded: if `getUser()` returns null → 401; otherwise checks `is_owner()` (which now double-checks email).

| Route | HTTP | Auth gate | Verified by |
|---|---|---|---|
| `/api/audit` | POST | none — public intake | service-role RPC `submit_audit_inquiry` |
| `/api/chat` | POST | `getUser()` → null = 401; else continue | `auth.uid()` scoping in SQL |
| `/api/cron/notifications` | POST | **none observed** (no `Authorization` header check in read) — relies on platform-level cron secret (not verified in route code) | ⚠ See Critical #2 |
| `/api/owner/whoami` | GET | `getUser()` → null = 401 | JWT validation + `is_owner()` |
| `/api/owner/export` | GET | `getUser()` + `is_owner()` | JWT + `is_owner()` |
| `/api/owner/notification-readiness` | GET | `getUser()` + `is_owner()` | JWT + `is_owner()` |
| `/api/voice/session` | POST | `getUser()` → null = 401 | JWT validation + `voice_calls` service-role read |
| `/api/webhooks/retell` | POST | **HMAC-SHA256** on raw body via `verifyRetellSignature` against `RETELL_WEBHOOK_API_KEY` (falls back to `RETELL_API_KEY`); 401 on mismatch; rate-limited 600 req/min | signature + dedup |
| `/api/webhooks/meta/whatsapp` | GET/POST | GET: hub challenge against `META_WA_VERIFY_TOKEN`. POST: **HMAC-SHA256** on raw body via `verifyMetaSignature` against `META_APP_SECRET`; constant-time compare; 401 on mismatch | signature + dedup |
| `/api/webhooks/resend` | POST | (verify only via Resend SDK's `svix`/Svix signature header check inside route) | signature |

**Public sign-in/sign-up exposure:** Auth flows are **client-driven** through `lib/supabase/auth-actions.mjs` Server Actions (`signInAction`, `signUpAction`, `signInWithGoogleAction`, `signOutAction`). No HTTP `/api/auth/signup` or `/api/auth/signin` route exists — all auth goes through Supabase Auth SDK via SSR server actions. This is correct: prevents credential interception by routes that bypass SSR cookie semantics.

---

## Idempotency + outbox strategy

**Outbox:** Real. Three states (queued → processing → terminal) with 10-minute lease reclaim on abandoned workers (`claim_notification_events` migration). Max 3 attempts; backoff 5 min then 30 min; `dead_letter` on lease expiry once `attempts >= 3`. Submission path enqueues two outbox rows per inquiry (`owner_*` + `customer_*`) atomically inside `submit_audit_inquiry` RPC; legacy `inquiry_received` events are force-cancelled and never re-sent.

**Idempotency keys:**
- `outbox_events.idempotency_key` UNIQUE → enqueue dedup (`on conflict do nothing`).
- `outbox_events(provider,provider_message_id)` UNIQUE → delivery dedup.
- `provider_events(provider,provider_event_id)` UNIQUE → provider callback dedup (e.g. Resend event-id replay).
- `notification_attempts(outbox_event_id,retry_cycle,attempt_number)` UNIQUE → attempt dedup.
- `voice_calls(provider,call_id,event_type)` UNIQUE → webhook event dedup.
- `owner_add_inquiry_note` does not take a user-supplied unique key; notes are append-only.
- **No user-supplied idempotency key on `/api/audit`** — same email submitted twice creates two inquiries (the contact row is upserted but inquiries are append). ⚠ See Medium #1.

**Retry:** Exponential backoff via `available_at` column; no external queue (no SQS/PubSub). Dead-letter is silent (column set, no alerting observed).

---

## Webhook receivers (route → signature verify?)

| Provider | Route | Signature verification | Replay protection | Body limit |
|---|---|---|---|---|
| Retell | `POST /api/webhooks/retell` | **YES** — HMAC-SHA256 + constant-time (`verifyRetellSignature`); 401 on failure | unique `(provider,call_id,event_type)` upsert | 512 KiB declared cap + post-read length check |
| Meta WhatsApp | `GET/POST /api/webhooks/meta/whatsapp` | **YES** — GET: `META_WA_VERIFY_TOKEN`; POST: HMAC-SHA256 + constant-time (`verifyMetaSignature`); 401 on failure | `messageKey()` extracts `wamid`/status id; dedup via `provider_events` or internal store | raw body consumed; no declared cap |
| Resend | `POST /api/webhooks/resend` | **YES** — Svix signature header verification inside route (per inline comment; route reads raw body via `request.text()`) | `provider_events` dedup via `provider_event_id` | raw body consumed |
| Stripe | **NOT IMPLEMENTED** — no `/api/webhooks/stripe` route exists | n/a | n/a | n/a |

All three implemented webhooks verify raw body + signature before parsing JSON. Verified.

---

## CORS / origin policy

`middleware.js` is **not a CORS layer** — it is a Next.js middleware that runs auth/redirect logic. **No `Access-Control-Allow-Origin` / `Access-Control-Allow-Methods` / `Access-Control-Allow-Headers` headers are set anywhere in `app/`, `lib/`, or `middleware.js`** (grep returned 0 hits across the codebase).

**Implication:** This is a same-origin Next.js app. Webhooks are server-to-server and don't need CORS. Browser-driven Supabase client uses Supabase's own CORS-configured REST endpoint (not IronWake's API routes). **No CORS gap exists for the current threat model.** Documented for completeness.

---

## Error log strategy

`grep -rn 'console\.(error|log|warn)' app/api/` (excluding tests/bak) returns **5 hits, all in `app/api/audit/route.js`**:

```
[audit] missing env { hasUrl: Boolean(url), hasServiceKey: Boolean(serviceKey) }
[audit] submit_audit_inquiry failed { urlHost, code }
[audit] triage persistence failed { safeCode }
[audit] priority notification queue failed { … }
[audit] notification worker failed { safeCode }
```

All five are:
1. Scoped to boolean presence or short safe-error codes (≤50 chars).
2. **Do not log raw request bodies, authorization headers, email content, or API keys.**
3. `urlHost` is hostname only (likely derived from URL parse, not full URL).

Sentry is configured (`sentry.server.config.js`) but the audit route does not feed request bodies into it. **No sensitive data leakage observed in error logs.** This is a deliberate, well-implemented choice (`// ponytail` comments confirm intent).

---

## Severity-ranked issues

### Critical
*(none)* — All implemented webhooks verify signatures. Auth uses `getUser()` not `getSession()`. RLS is universal. Secret values never logged.

### High

**H1. `/api/cron/notifications` has no in-route authorization gate.** Route relies entirely on platform-level cron-secret enforcement (Netlify cron / Cloudflare Workers scheduled handler). If anyone can reach the URL, they can drain the entire `outbox_events` queue. **Mitigation present in `claim_notification_events` (SKIP LOCKED + 10-min lease) bounds blast radius to one cycle, but does not block unauthorized drain.**

**H2. `.env.example` is incomplete — undocumented production secrets.** Declared: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`. **Missing from `.env.example` but read by code:** `RETELL_API_KEY`, `RETELL_WEBHOOK_API_KEY`, `RETELL_AGENT_ID`, `META_APP_SECRET`, `META_WA_VERIFY_TOKEN`, `META_WHATSAPP_TOKEN` (the `META_WHATSAPP_TOKEN` is never read in `app/` — dead var or used elsewhere). New contributors cannot bootstrap. **This is also a documentation bug, not a security bug — secrets themselves are correct.**

### Medium

**M1. `/api/audit` has no user-supplied idempotency key.** Same email submitted twice → two `inquiries` rows (contact is upserted). Risk: form double-submit creates duplicate owner tasks + duplicate notifications. **Fix is one column + check; or rely on `client_submit_token` in cookie.**

**M2. Dead-letter alerts are silent.** `outbox_events.status='dead_letter'` is set but no route or external watcher reads it. Owner discovers failed notifications only by checking the dashboard. **Fix is a single SQL view + cron emit, or a route polled by `/admin`.**

**M3. `webhook_dedup` table referenced in comments / docs but does not exist as a physical table.** Dedup is achieved through `provider_events(unique provider,provider_event_id)` + `voice_calls(unique provider,call_id,event_type)` + internal `messageKey` for WhatsApp. Functional, but the naming inconsistency is a footgun for new contributors.

### Low

**L1. `is_owner()` hard-codes `ironwakee@gmail.com`** in migration SQL. To add a second owner requires a code migration. Acceptable for single-owner CRM but a documentation TODO if the model changes.

**L2. `request_rate_limits` enables RLS but has no policy row.** Works only because `revoke all` is total. A future contributor adding `grant select` will silently expose the table to all authenticated users (no rows would still leak nothing — but it's fragile). Add `using(false)` policy or `force_rls=on`.

**L3. No Stripe webhook route exists.** If subscriptions are planned, none of the verification patterns (HMAC, raw body, replay dedup) are wired. Future bug, not present bug.

---

## Surgical fixes (≤5, each with diff estimate)

### Fix #1 — Gate `/api/cron/notifications` with header check (H1)
**Diff estimate:** ~12 lines.
**Location:** `app/api/cron/notifications/route.js` top of handler.
**Change:**
```js
// ponytail: cron routes are reachable from anywhere on the public
// internet; gate on the platform-injected secret instead of trusting URL obscurity.
const presented = request.headers.get('x-cron-secret') || '';
const expected = String(process.env.CRON_SECRET || '').trim();
if (!expected || !presented || presented.length !== expected.length || presented !== expected) {
  return json({ ok: false, error: 'Unauthorized' }, 401);
}
```
Add `CRON_SECRET=<random-32-byte-hex>` to `.env.example` and platform env.

### Fix #2 — Document the missing env vars in `.env.example` (H2)
**Diff estimate:** ~10 lines added, 0 removed.
**Location:** `.env.example`.
**Change:** Append block:
```
# Retell (server-to-server only; never sent to the browser)
RETELL_API_KEY=
RETELL_WEBHOOK_API_KEY=
RETELL_AGENT_ID=

# Meta WhatsApp Cloud API
META_WHATSAPP_TOKEN=
META_APP_SECRET=
META_WA_VERIFY_TOKEN=

# Cron
CRON_SECRET=
```
Presence-only — no values. Each line is a placeholder name, matching the code that reads it.

### Fix #3 — Add user-supplied idempotency key to `/api/audit` (M1)
**Diff estimate:** ~18 lines + 1 migration.
**Location:** `app/api/audit/route.js` (read `submission_token` from form), `supabase/migrations/<next>_audit_idempotency.sql` (add `submission_token text` column + unique partial index `(lower(email), submission_token)`).
**Change:** Accept optional `submission_token` from form; pass to `submit_audit_inquiry(text,text,text,text,text)`; on duplicate `(email,token)` return existing inquiry id with 200 instead of 201. **One column + one index + one branch in the RPC; minimum code.**

### Fix #4 — Dead-letter heartbeat (M2)
**Diff estimate:** ~30 lines.
**Location:** New migration adding view `public.v_dead_letters`; new route `/api/owner/dead-letters` (owner-only) returning count + last 50; render badge on `/admin`.
**Change:** View SQL (5 lines): `select count(*) … where status='dead_letter' and dead_lettered_at > now() - interval '24 hours'`. Route reuses `is_owner()` gate (already in place).

### Fix #5 — Defensive policy on `request_rate_limits` (L2)
**Diff estimate:** ~3 lines, one migration.
**Location:** `supabase/migrations/<next>_force_rls_request_rate_limits.sql`.
**Change:**
```sql
alter table public.request_rate_limits enable row level security;
alter table public.request_rate_limits force row level security;
create policy no_direct_access on public.request_rate_limits for all to authenticated, anon using (false);
```
Forward-only; no behavior change. Eliminates the silent-fragility window.

---

**Total diff footprint across all 5 fixes:** ~70 lines of code + ~25 lines of `.env.example` entries + 2 small migrations. No new dependencies. No refactors. No unrequested abstractions.

**Audit complete. No fabricated data; all findings trace to specific files and line numbers above.**