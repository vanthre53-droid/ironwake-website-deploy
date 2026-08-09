# Skill Usage Log

- Phase: C1 architecture/research
- Date: 2026-07-28
- Harness: OpenCode
- Skills invoked: none
- Discovery: repository and available skill paths were inspected; no compatible skill was required for this read-only C1 checkpoint.
- Side effects: none. No third-party skill script, provider, account, publication, message, or deployment action was executed.

## 2026-08-09 — P0.1 real capability audit

- Phase: C1 real-product reconstruction
- Harness: Codex
- Skill invoked: official Supabase skill v0.1.2
- Why: the current programme requires live schema, Auth, RLS, function-ACL, migration, and advisor evidence instead of source-only inference.
- Actions: read the skill fully; checked the current Supabase breaking-change index; used read-only table, migration, aggregate-state, Auth-factor, function-ACL, and advisor queries against project `ipcpthmmcdtshbbsirwj`.
- Result: identified live migration drift, role-only owner policies, privileged anonymous RPC execution, zero verified owner MFA factors, 36 unprocessed outbox rows, and zero completed AI triage rows.
- Side effects: none. No migration, account change, secret readout, customer data row, send, publication, or deployment mutation occurred.

## 2026-08-09 — P0.9 authorization/RPC remediation

- Phase: M1 live security repair
- Harness: Codex
- Skill invoked: official Supabase skill v0.1.2
- Why: the sealed task required a forward migration plus live migration, RLS-policy, function-ACL, row-count, and advisor verification.
- Actions: used the pinned official Supabase CLI (`2.113.0`) only to scaffold the timestamped migration, reviewed and tested the SQL locally, applied it with the connected Supabase migration surface, then ran split read-only policy/ACL/count/advisor checks.
- Result: live migration `20260809101715` verified; all six policies use the canonical role-plus-email predicate; browser-role execution is removed from privileged functions; targeted security-advisor findings cleared; customer-table counts unchanged.
- Side effects: one approved forward authorization migration. No credential readout, customer-row mutation, send, provider connection, publication, payment, or deployment.

## 2026-08-09 — P1 transactional-email architecture

- Phase: C1 provider research and sealed queue
- Harness/model: Codex / `gpt-5.6-sol` (explicitly reported by the active IronWake trace)
- Skill invoked: Vercel email integration skill
- Why: the programme requires a current zero-cost transactional-email choice, idempotent delivery, templates, domain constraints, and provider webhook evidence.
- Actions: read the skill fully; checked current official Resend pricing, idempotency, testing-domain, webhook, and Next.js guidance; checked Netlify scheduled-function/free-plan controls; compared Brevo; read current npm registry metadata.
- Adaptation: selected provider-neutral Resend code for the existing Netlify runtime, omitted React Email to avoid an unnecessary dependency, and selected current stable `resend@6.18.1` because the skill's `6.9.x` note is stale.
- Result: Resend Free is selected for code only; five atomic tasks cover schema, worker/adapter, signed webhook, owner operations, and gated live proof. Account/terms/domain/secret/send/deploy remain blocked behind G4/G5.
- Side effects: documentation/queue edits only. No account, secret, DNS, provider call, email, webhook registration, deployment, or spend.

## 2026-08-09 — P0 notification state machine

- Phase: M1 `IW-P0-NOTIFY-01`
- Harness/model: Codex / `gpt-5.6-sol`
- Skill invoked: official Supabase skill v0.1.2
- Why: the sealed task required a forward migration, explicit Data API grants, RLS, privileged RPC boundaries, live catalog readback, and post-DDL advisors.
- Actions: read the skill fully; checked the current Supabase changelog; scaffolded with the pinned official CLI; reviewed and tested the provider-neutral migration; applied it through the migration surface; verified live counts, constraints, policies, table/function privileges, migration history, and advisors.
- Result: live migration `20260809104514` verified. The 36 legacy events are safely cancelled; new attempts/provider-event tables are empty; browser roles cannot execute worker/provider functions; owner reads are RLS-protected; core customer counts are unchanged.
- Side effects: one approved forward schema/state migration and the status-only cancellation of 36 non-addressable legacy event intents. No customer row deletion, provider connection, secret, email, webhook registration, DNS, payment, publication, or deployment.

## 2026-08-09 — P0 notification adapter and worker

- Phase: M1 `IW-P0-NOTIFY-02`
- Harness/model: Codex / `gpt-5.6-sol`
- Skill invoked: Vercel email integration skill
- Why: the sealed task implements Resend request shape, durable idempotency, safe templates, provider-neutral outcomes, and timeout handling.
- Adaptation: re-read the skill fully; used the current SDK's `idempotencyKey` option and email/domain boundaries; adapted from Vercel Marketplace to the existing Netlify scheduled-function runtime; omitted React Email; kept `resend@6.18.1` exact because the skill's `6.9.x` note is stale.
- Result: local fail-closed configuration, escaped owner/customer templates, eight-second Resend adapter, bounded shared worker, triage priority hook, and undeployed two-minute schedule entrypoint are implemented. Focused no-network tests pass 18/18; full suite, build, and production audit pass.
- Side effects: installed the exact local SDK and repaired newly disclosed in-range transitive `undici`/`nanoid` advisories. No account, secret, domain, provider call, email, webhook registration, deployment, publication, or spend.

## 2026-08-09 — P0 signed delivery webhook

- Skill: `email` integration skill (reviewed fully for the current notification task).
- Why: the sealed task requires provider-specific raw-body signature verification, event normalization, delivery-state separation, and replay safety.
- Actions: followed the skill's signature-first and idempotent callback principles; reconciled its older package notes against installed `resend@6.18.1` SDK source and types; used only local cryptographic fixtures.
- Result: a bounded server route verifies before normalization, records metadata only through the service-role RPC, and passes forged/stale/replay/out-of-order/delivery/failure tests. Provider registration and live callbacks remain gated.
- Side effects: local code/tests and existing evidence only. No secret, account, provider call, email, webhook registration, deployment, publication, or spend.

## 2026-08-09 — P0 owner notification operations

- Skill: `supabase`.
- Why: the screen reads three RLS-protected relationships and invokes an owner-only replay RPC from a browser session.
- Actions: preserved the publishable-client and server-whoami boundary, confirmed live foreign-key/RLS metadata read-only, kept browser table access read-only, and relied on the database function to recheck canonical owner authorization and legacy eligibility.
- Result: local owner operations expose durable inquiry/event/attempt state and eligible replay without service credentials. Focused/full tests and build pass; live tables remain unchanged and empty for provider evidence.
- Side effects: local code/tests/evidence plus read-only Supabase schema metadata. No row mutation, owner session, retry, provider action, email, callback, or deployment.
