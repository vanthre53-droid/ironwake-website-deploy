# P2 Schema and RLS Evidence

Status: `PARTIAL — CRM DURABILITY AND NOTIFICATION STATE VERIFIED; PROVIDER EXECUTION AND OWNER MFA REMAIN PENDING`

## Applied migrations

- The CRM foundation migrations remain live through `20260809101715_secure_owner_and_privileged_rpcs`.
- `20260809104514_durable_notification_state_machine` is live on Supabase project `ipcpthmmcdtshbbsirwj`.
- The notification migration was scaffolded with the pinned official Supabase CLI, reviewed, covered by migration-content tests, and applied only after the focused and full suites passed.

## Verified CRM preservation

- Core counts are unchanged: 38 inquiries, 29 contacts, 36 consents, 36 tasks, 36 outbox events, and 44 audit logs.
- No inquiry, contact, consent, task, or audit row was deleted or anonymized.
- The 36 pre-existing undifferentiated `inquiry_received` events are now `cancelled`, target `legacy`, with safe code `legacy_event_not_addressable`. They are not eligible for worker claims or owner replay.
- No new inquiry or synthetic customer record was created for this schema task.

## Verified notification state

- `outbox_events` now distinguishes owner audit, owner booking-request, customer audit acknowledgement, customer booking-request acknowledgement, and owner priority-alert intents.
- Target, provider/message, retry-cycle, claim, attempt, acceptance, delivery, dead-letter, and safe-error fields are live with constraints.
- Private `notification_attempts` and `provider_events` tables are live, RLS-enabled, and empty. No provider acceptance or delivery is implied.
- The intake RPC definition atomically queues one owner and one customer event for future inquiries. The worker-facing functions support leased `FOR UPDATE SKIP LOCKED` claims, at most three attempts, 5-minute then 30-minute retry scheduling, dead-letter state, provider-event deduplication, and acceptance distinct from delivery.
- The owner-retry path rejects legacy events and internally enforces the canonical role-plus-designated-email `is_owner()` predicate.

## Verified RLS, grants, and function access

- `outbox_events`, `notification_attempts`, and `provider_events` all have RLS enabled and one authenticated owner-select policy.
- `anon` has no table access. `authenticated` has select only and no insert/update/delete grants. `service_role` has the required table mutation access.
- `submit_audit_inquiry`, `queue_priority_lead_notification`, `claim_notification_events`, `finish_notification_attempt`, and `record_notification_provider_event` deny `anon` and `authenticated` execution and permit `service_role` only.
- `owner_retry_notification` permits `authenticated`, denies `anon`, and uses an invoker wrapper plus an internal definer function with a second owner check. The internal function is outside the exposed public schema.
- Explicit grants were included because the 2026 Supabase Data API change no longer auto-exposes newly created `public` tables.

## Advisor and test readback

- Supabase security advisor: only the pre-existing leaked-password-protection warning remains; the migration introduced no new RLS or definer warning.
- Supabase performance advisor: the earlier missing `outbox_events.inquiry_id` index warning cleared. Existing `audit_logs` and `tasks` foreign-key index notices remain; new indexes are reported unused because the new tables contain zero rows.
- Focused notification migration tests: 10/10 passed.
- Full normal suite: 112/112 passed.
- `git diff --check` passed before the live apply.

## Boundary

No email adapter, provider secret, provider account, send, signed webhook endpoint, schedule deployment, DNS change, or production deployment was created in this task. Delivery remains `NOT_RUN` until the separately gated provider and deployment proof task.
