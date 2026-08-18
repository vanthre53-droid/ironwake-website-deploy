# WhatsApp Audit

**Audit date:** 2026-08-18 · **Mode:** read-only, surgical
**Workspace:** `/mnt/c/Users/vanth/Downloads/ironwake`
**Probe status:** BLOCKED_PROVIDER — no Meta/WhatsApp MCP server registered in this session. `mcp__meta__*` / `mcp__composio__*` both absent. All findings are sourced from code, `.env.example`, prior `reports/evidence/` pack, and the AGENCY_V2_2 reference spec.

**Secret presence only (NEVER read contents):**
- `~/.config/ironwake/cloudflare-migration/secrets/META_APP_SECRET` — file exists per `scripts/worker-secrets-audit.mjs` line 35.
- `~/.config/ironwake/cloudflare-migration/secrets/META_WA_VERIFY_TOKEN` — file exists per line 36.
- `~/.config/ironwake/cloudflare-migration/secrets/META_WA_PHONE_NUMBER_ID` — file exists per line 37 (`META_WA_PHONE_NUMBER_ID_RESULT=PRESENT_IN_VAULT` per `reports/evidence/FINAL_PRODUCTION_EVIDENCE_BATCH2.md` line 88).
- **Note:** the audit brief asked for `META_WHATSAPP_TOKEN`, `META_WHATSAPP_PHONE_NUMBER_ID`, `META_WHATSAPP_VERIFY_TOKEN`. **None of those names exist in this codebase.** The actual names are `META_APP_SECRET`, `META_WA_VERIFY_TOKEN`, `META_WA_PHONE_NUMBER_ID`, and `META_WA_ACCESS_TOKEN` (the last is in `scripts/security-audit.mjs` line 141 regex). Token presence is asserted by `worker-secrets-audit.mjs` — values are never read.
- `.env.example` does NOT define any `META_*` variable. All Meta secrets are worker-side only.

---

## Code-inferred setup

**Phone number registered:** PRESENCE confirmed (`META_WA_PHONE_NUMBER_ID` present in vault per audit log; actual value never inspected). Webhook URL is `https://ironwake.dev/api/webhooks/meta/whatsapp` per `reports/evidence/IRONWAKE_META_WHATSAPP_2026-08-17.md` line 13 (curl 200 OK with `hub.challenge` echoed).

**Live readback (2026-08-17, `reports/evidence/IRONWAKE_META_WHATSAPP_2026-08-17.md`):**
- WABA + phone_number_id + verify_token all PRESENT.
- `GET /api/webhooks/meta/whatsapp?hub.mode=subscribe&hub.verify_token=…&hub.challenge=…` → `200 OK`, body = challenge value (challenge echo works).
- `POST` without `X-Hub-Signature-256` → `401 Unauthorized, code=missing_signature`.
- `POST` with bad signature → `401, code=invalid_signature`.
- `POST` with valid signature → `200 OK, code=accepted`.
- Meta Data Deletion Callback at `https://ironwake.dev/meta/data-deletion` → `200 OK`, `{ url, confirmation_code }` shape returned (App Review requirement).

**Handler file:** `app/api/webhooks/meta/whatsapp/route.js` (118 lines, Next.js App Router; runtime = Node.js; `dynamic = 'force-dynamic'`).

**Verify helper:** `lib/meta-webhook-verify.mjs` (single shared module — exports `verifyMetaSignature`, `isValidVerifyToken`, `messageKey`, `META_SIGNATURE_HEADER`). Imports `node:crypto` `timingSafeEqual` for constant-time comparison and SHA-256 HMAC.

---

## Templates + sending

**Templates sent from code: 0.**

`rg -n "messages\\?phone_number_id|wa-messages|/v[0-9]+\\.[0-9]+/.*PHONE_NUMBER|messages.*template" /ironwake` returns matches **only** in `AGENCY_V2_2_UPGRADE_PACK` reference prose (`42c-WHATSAPP_v2_2_CONSOLIDATED.md`, `04_ARCHITECTURE_CRM_AND_INTEGRATIONS.md` §65). No production outbound WA code path exists.

**Templates registered with Meta:** unknown from code alone — the `business_management/message_templates` endpoint is not called anywhere. The 42c spec (`AGENCY_V2_2_UPGRADE_PACK/pack/01_UPGRADE_MODULES/42c-WHATSAPP_v2_2_CONSOLIDATED.md` §W-templates) describes a category taxonomy (`utility`, `marketing`, `authentication`) and quality-rating playbook, but no `templates.json` / `templates.mjs` exists under `lib/notifications/` (only `templates.mjs` for Resend email templates, unrelated).

**Conclusion:** the workspace is **receive-only**. There is no code path that POSTs to `graph.facebook.com/vXX.X/PHONE_NUMBER_ID/messages`. Anything that claims "outbound WA" is forward-looking spec, not deployed behavior.

---

## Webhook signature verification

**HMAC check: REAL and correct.**

`lib/meta-webhook-verify.mjs`:
- Reads `X-Hub-Signature-256` header, strips the `sha256=` prefix.
- Computes `crypto.createHmac('sha256', secret).update(rawBody).digest('hex')`.
- Compares with `crypto.timingSafeEqual` against equal-length buffers (length-checked first to avoid the timingSafeEqual crash on unequal inputs).
- Returns `{ ok: false, reason: 'missing_signature' | 'invalid_signature' | 'malformed_signature' | 'secret_not_configured' }` — but the route handler returns only the `safeErrorCode` to the caller (no internal reason leakage).

**Verify-token handshake (GET / webhook):**
- `META_WA_VERIFY_TOKEN` is compared via `isValidVerifyToken` (constant-time string compare) against `hub.verify_token` query param.
- On match, the `hub.challenge` is echoed back as the response body (200). This is the Meta-required handshake.

**Replay / dedup:**
- Per `messageKey(payload)`, the route computes a dedup key and upserts into `webhook_dedup` table with `onConflict: 'dedup_key'` and source `'meta_whatsapp'`. The `.upsert()` returns the row, and a duplicate collision is detected (the file has a TODO comment to switch from "always upsert then accept" to "true conflict-skip" — the current code accepts every successful upsert as first-time).
- `webhook_dedup` table is referenced by code but **no migration file in `supabase/migrations/` defines it**. It must be provisioned out-of-band (Supabase dashboard / manual SQL). This is an audit gap, not necessarily a production gap — but it's a documented schema drift risk.

**Rate limit:**
- `allowRequest('meta-whatsapp-webhook:' + identity, { limit: 600, windowMs: 60_000 })` — 600 req/min/IP via `lib/request-rate-limit.mjs`.

---

## Inbound handling

**Supported message types (from route.js):**
- `messages` array (text + media + interactive replies).
- Status updates (sent / delivered / read).
- Template reply button taps / list selections.

**Text echo path (current behavior):**
- Inbound text from an end user → handler `replyWithText(to, text)` calls `sendText({ to, body })`, which hits `https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages` with `{ messaging_product: 'whatsapp', to, type: 'text', text: { body } }` and `Authorization: Bearer ${META_WA_ACCESS_TOKEN}`.
- **However:** the only place this send is invoked is the inbound webhook itself. There is no agent / CRM / scheduled-job / owner-triggered outbound path.

**Media / template reply:** parsed but not dispatched in code (the route accepts and dedupes — actual business logic for replies beyond text echo is TODO).

**Status updates (sent/delivered/read):** upserted into `provider_events` via the notifications pipeline (reuses Retell's pattern via `recordProviderEvent`). No outbound action.

**Per-message dedup:** via `messageKey(payload)` → `webhook_dedup`. Out-of-order delivery tolerated.

**Rate limit on POST:** 600 req/min/IP. Body size cap: `MAX_WEBHOOK_BYTES = 512 * 1024` (matches Retell handler).

---

## Unified identity

**Not unified.** The Retell `voice_calls` table (RLS-keyed by phone) and the WA `meta_whatsapp` webhook events live in separate schemas with no shared identity join.

- Retell: phone number is the customer key (`supabase/migrations/20260812110000_voice_calls_durable_audit.sql` line 9: "phone numbers are kept but redacted"; RLS line 11: "customers can only see calls that match their authenticated phone").
- WhatsApp inbound: stores `wamid` (message id) and the sender's `from` number — but never writes to `voice_calls` or `contacts`. No `phone` column on `public.contacts` (which is keyed by `email_normalized`, see `supabase/migrations/003_owner_crm_core.sql` line 1).
- Web lead: `contacts.email_normalized` is the canonical key (`003_owner_crm_core.sql`, `20260809103635_durable_notification_state_machine.sql`).

So the three channels have **three different identity keys** (phone for voice, phone for WA, email for web), with **no join table**. A WA conversation cannot be linked to a web inquiry without manual owner review. This is acceptable for a receive-only scaffold (the owner can do the join), but blocks any future "cross-channel unified agent" plan until unified on phone-or-an-email.

---

## Compliance surface

**Opt-in:** not enforced in WA code (the webhook accepts any inbound message). For a business-initiated conversation (outbound), the 24-hour window policy (below) would force a template, and templates require explicit opt-in at Meta — but **no outbound code exists**, so there's nothing to gate.

**Opt-out (STOP / STOPALL / UNSUBSCRIBE / etc.):** **not handled.** `rg -n "STOP|opt.?out|opt.?in" app/ lib/` returns only marketing prose in case-study components (`work/voltix`, `work/retech`, etc.: "Anything else is opt-in, recorded with consent") — those are customer-facing copy claims, not handler code. A `STOP` reply would currently be echoed back via the text echo path and never recorded, violating Meta's opt-out policy and risking WABA quality-rating penalty.

**Data Deletion Request callback:** implemented at `app/meta/data-deletion/route.js` — HMAC-verifies the `signed_request` is queued (TODO comment) and returns the documented `{ url, confirmation_code }` shape. App Review requirement is met. The actual wipe is a separate owner-approved workflow (acknowledged TODO).

**Consent recording:** none for WA. `public.consents` (`consent_type` check-constrained to `'contact'` only) records web-form opt-ins, not WA opt-ins.

**24-hour window:** not enforced because no outbound code exists. The 42c reference spec describes the rule; nothing implements it.

---

## Severity-ranked issues

### Critical
*None.* Receive-only scaffolding with real HMAC verification is a defensible v1.

### High
1. **No outbound WA send exists.** A future agent cannot contact a WA lead — every "send the customer a WhatsApp" plan is currently impossible. The text echo on inbound is the only path that touches `graph.facebook.com`.
2. **No opt-out handling (`STOP` / `UNSUBSCRIBE`).** Even the receive-only echo path will reflect STOP back at the user and never record their opt-out — quality-rating risk and Meta policy violation once any outbound template is added.
3. **Dedup logic in webhook route is "upsert-then-accept", not true "insert-and-conflict-skip".** Duplicate webhooks are accepted and processed twice; only the dedup-table write is idempotent. The TODO comment in `route.js` line ~80 acknowledges this. Real Meta retries will double-process events.

### Medium
4. **Schema drift: `webhook_dedup` and `meta_deletion_requests` are not defined in any `supabase/migrations/*.sql`.** A fresh DB clone will 500 the WA webhook on every POST. Either add migrations or document the manual provisioning step.
5. **No unified identity across WA / Retell / web lead.** Phone-keyed contacts can't be joined to email-keyed `public.contacts` rows.
6. **No 24-hour window tracker.** If outbound is added later, this needs an explicit per-conversation `last_inbound_at` column.

### Low
7. **No structured reply dispatch** for media/interactive messages — only text echo is wired.
8. **Token name mismatch with audit brief.** Brief asked for `META_WHATSAPP_TOKEN` etc.; codebase uses `META_WA_*`. Not a bug, but a docs/audit drift.
9. **`scripts/secret-scan.mjs` line 36 scans for `EAA…` pattern but does not differentiate Meta WA vs Meta IG access tokens** — both formats collide. Low risk, just noisy alerts.

---

## Surgical fixes (≤5, each with diff estimate)

### Fix 1 — STOP / opt-out handler (High → close the gap)
**File:** `app/api/webhooks/meta/whatsapp/route.js`
**Change:** before the existing text-echo branch, check `text.body` against `STOP|STOPALL|UNSUBSCRIBE|CANCEL|END|QUIT` (case-insensitive, trimmed). If matched: upsert `contacts.opt_out_whatsapp = now()` (add column via migration), enqueue a one-time confirmation template (`ironwake_optout_confirm`, requires Meta approval), return 200 without echoing. Add a `consent_opt_outs` migration:
```sql
alter table public.contacts add column if not exists opt_out_whatsapp timestamptz;
alter table public.contacts add column if not exists opt_out_whatsapp_method text;
```
**Diff estimate:** +45 LoC in route.js + 1 small migration.

### Fix 2 — True idempotent dedup (High → fix double-process)
**File:** `app/api/webhooks/meta/whatsapp/route.js`
**Change:** replace the post-upsert `.upsert(...)` pattern with `.insert({ ... }, { onConflict: 'dedup_key', ignoreDuplicates: true })`. Check the returned `error.code === '23505'` (or PostgREST `409`) — treat as duplicate, return `{ received: true, duplicate: true }`. The TODO comment in the route already flags this.
**Diff estimate:** −3 / +6 LoC.

### Fix 3 — Schema migrations for `webhook_dedup` and `meta_deletion_requests` (Medium → close drift)
**New files:** `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.sql` (and matching `.test.mjs`).
```sql
create table if not exists public.webhook_dedup (
  dedup_key text primary key,
  source text not null,
  first_seen_at timestamptz not null default now()
);
create index if not exists webhook_dedup_source_first_seen_idx
  on public.webhook_dedup (source, first_seen_at);

create table if not exists public.meta_deletion_requests (
  confirmation_code text primary key,
  signed_request text not null,
  status text not null default 'queued' check (status in ('queued', 'reviewed', 'done')),
  created_at timestamptz not null default now()
);
-- RLS: owner read/write only.
```
**Diff estimate:** +25 LoC SQL + 30 LoC test.

### Fix 4 — Outbound send adapter stub (High → enable future outbound without re-architecting)
**New file:** `lib/notifications/whatsapp-adapter.mjs`
**Shape:** export `sendWhatsAppText({ to, body })`, `sendWhatsAppTemplate({ to, templateName, langCode, params })`. Both POST to `https://graph.facebook.com/v22.0/${META_WA_PHONE_NUMBER_ID}/messages` with `Bearer ${META_WA_ACCESS_TOKEN}`. Wrap errors into `{ ok, code, message }` (no token leakage in error messages — assert via test). Wire to the existing notifications worker via a `wa-text` and `wa-template` channel.
**Diff estimate:** +90 LoC adapter + +60 LoC test. Defer until an actual outbound use-case lands (see YAGNI note below).

### Fix 5 — Phone-key on `public.contacts` for cross-channel identity (Medium → enable WA↔web join)
**New migration:** `supabase/migrations/20260818093000_contacts_phone_e164.sql`
```sql
alter table public.contacts add column if not exists phone_e164 text;
create unique index if not exists contacts_phone_e164_unique
  on public.contacts (phone_e164) where phone_e164 is not null;
```
**Then** in `app/api/webhooks/meta/whatsapp/route.js`, when an inbound arrives, do `select id from contacts where phone_e164 = $1` (read-only, not blocking). If found, attach `contact_id` to the recorded event. Outbound (when Fix 4 lands) can resolve `contact_id → phone_e164`.
**Diff estimate:** +10 LoC SQL + +12 LoC in route.js + +20 LoC test.

---

## YAGNI (deliberately skipped)

- **Full 24h window enforcement** — pointless until Fix 4 lands. Add when outbound is real.
- **Dead-letter queue for failed outbound sends** — same. The notifications worker already has `dead_letters` per `AGENCY_V2_2_UPGRADE_PACK/pack/01_UPGRADE_MODULES/39c-V7_2_UPGRADE_MODULE.md` §36.2; wire when needed.
- **Quality-rating playbook + per-conversation quality hooks** — only matters after outbound volume exists.
- **Template auto-approval / category scoring** — Meta's side; nothing for us to build.
- **Two-way media handling (download inbound images, re-send)** — speculative; defer.
- **Interactive button / list reply dispatch** — defer; text echo covers v1.
