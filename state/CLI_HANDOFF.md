# CLI Handoff

## Current handoff — 2026-08-09 Codex public capability-claim correction

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Local public copy no longer presents an AI Receptionist, provider delivery, named assignment, escalation, or end-to-end owner operations as live where those capabilities lack evidence.
- The AI Receptionist page now describes future provider/handoff requirements; the corner helper is explicitly a deterministic guide. Missed Lead Recovery distinguishes live durable intake from unconfigured provider delivery and unfinished assignment/escalation.
- Verification: targeted claim scan, full suite 137/137, production build, audit 0, and diff check pass.
- Implementation commit: `acfd046` (`fix: qualify unsupported public workflow claims`).
- Required role: M1. Implement owner notes and an auditable activity timeline next. G5 still gates deployment; do not use an exposed Netlify token.

## Current handoff — 2026-08-09 Codex booking and follow-up checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Live schema: forward migrations add `inquiries.booking_status` and an index, backfill four legacy booking rows to `REQUEST_RECEIVED`, backfill open-task due/next-action state for 37 inquiries, and add `owner_complete_task(uuid)`.
- Local implementation: `/book` explicitly says `BOOKING REQUEST RECEIVED` and never confirms an appointment; `/owner` exposes source, booking status, request summary, triage, linked open task, and owner-RPC completion.
- Security/readback: `owner_complete_task` is `SECURITY INVOKER`, rechecks `is_owner()`, is denied to `anon`, and is executable only by `authenticated`; no private task write exists in browser source.
- Verification: focused tests 10/10; full suite 137/137; builds; production audit 0; migration/count/function-ACL readback. The first migration SQL was rejected before execution because of an invalid lateral reference, then corrected and applied.
- Implementation commit: `0713b78` (`feat: add request-only booking and follow-up operations`).
- Required role: M1. Audit public AI/provider claims next. MiniMax repair and the new local UI still need named G5 deployment approval before live application E2E can be claimed. Do not use any exposed Netlify token.

## Current handoff — 2026-08-09 Codex MiniMax P0.4 checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Local repair: MiniMax M3 OpenAI-compatible request with documented `reasoning_split`, a bounded response, strict JSON prompt, safe classifications for timeout/rejection/auth/rate-limit/5xx/network/invalid-output, observable triage-storage failure, durable safe provider/error/attempt fields, and private owner triage visibility.
- Live database: reviewed forward migration `20260809124000_durable_ai_triage_attempts` is applied. The three new metadata columns are present. The one authorized synthetic production inquiry persisted with `triage_status = provider_error` and `triage_model = MiniMax-M3`; no model success can be claimed.
- Verification: focused tests 7/7; full suite 135/135; production build; `npm audit --omit=dev` 0; diff and credential-pattern scans; official MiniMax API documentation readback; live schema readback. Browser interaction verification is `NOT_RUN` because the configured agent-browser CLI is unavailable.
- Required role: M1. The current Netlify deployment remains commit `daafc01`, predating repair commit `3faadd3`. Require named G5 approval before deploying that exact checkpoint and rerunning the authorized synthetic MiniMax inquiry. Do not use any exposed Netlify token.

## Current handoff — 2026-08-09 Codex owner notification-operations checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Local implementation commit: `542f15b`; live notification database state remains 36 cancelled legacy events and zero attempts/provider events.
- Implemented locally: server-verified owner session boundary, owner-RLS inquiry/outbox/attempt relationship reads, saved-lead and notification state details, accepted-versus-delivered evidence, safe failures, and eligible non-legacy replay through the owner RPC only.
- Verification: focused tests 8/8; full suite 133/133; Next.js build 39 routes; compiled private-page noindex; production audit 0; state/diff/direct-write/secret/client-bundle checks; live FK/RLS/row-count metadata.
- Required role: M1. Resend live proof is G4/G5 blocked, so execute the user-defined P0.4 AI provider-reality unit next without using unknown credentials or calling an unapproved provider.
- Boundary: no live owner session/retry, provider account/key/domain, signing secret, API call, email, webhook registration/callback, schedule deployment, or deployment occurred. Every exposed Netlify token remains compromised and must be revoked; none will be used.

## Current handoff — 2026-08-09 Codex signed-webhook checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Local implementation commit: `2e6b46e`; live database state remains at migration `20260809104514` with zero attempts/provider events.
- Implemented locally: bounded raw-body Resend signature verification before normalization, sealed delivery-event mapping, metadata-only service-role RPC recording, durable replay dedupe, and safe failure responses.
- Verification: focused no-network tests 25/25; full suite 129/129; Next.js build 39 routes including `/api/webhooks/resend`; production dependency audit 0; state/diff/secret/client-bundle/unsigned-parse/log checks.
- Required role: M1. Execute only `IW-P0-NOTIFY-04` next: server-authorized owner notification state/attempt visibility and restricted non-legacy replay.
- Boundary: no provider account/key/domain, signing secret, API call, email, webhook registration, callback, schedule deployment, or deployment occurred. Every exposed Netlify token remains compromised and must be revoked; none will be used.

## Current handoff — 2026-08-09 Codex notification-worker checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Local implementation commit: `42c5754`; live database state remains at migration `20260809104514` with zero attempts/provider events.
- Implemented locally: exact `resend@6.18.1`, fail-closed server-only config, escaped owner/customer audit/booking/priority templates, eight-second provider-neutral adapter, max-ten claim/send/finish worker, high/urgent/needs-human priority hook, and an undeployed two-minute Netlify schedule entrypoint.
- Verification: focused no-network tests 18/18; full suite 129/129; Next.js build 39 routes; production dependency audit 0; state/pack/diff checks; exposed-token scan; client-secret-name scan; React Email absent.
- Required role: M1. Execute only `IW-P0-NOTIFY-03` next: local raw-body signed Resend webhook with safe fixture tests.
- Boundary: no provider account/key/domain, API call, email, webhook registration, schedule, or deployment occurred. Every exposed Netlify token remains compromised and must be revoked; none will be used.

## Current handoff — 2026-08-09 Codex notification-state checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Implementation commit: `354c9cb`; live Supabase migration: `20260809104514_durable_notification_state_machine`.
- Verified database state: 38 inquiries, 29 contacts, 36 consents, 36 tasks, 36 outbox events, and 44 audit logs remain. All 36 legacy outbox events are cancelled/non-addressable; `notification_attempts` and `provider_events` are empty.
- Verified controls: all three notification tables have RLS; anonymous access is denied; authenticated access is owner-policy read-only; worker/provider functions are service-role-only; owner retry rechecks the canonical single-owner predicate and rejects legacy events.
- Verification: focused tests 10/10, full suite 112/112, live migration/constraints/policies/grants/function ACL/count readback, security/performance advisors, state/pack validators, diff check, and secret-pattern scan passed.
- Required role: M1. Execute only `IW-P0-NOTIFY-02` next: local fail-closed email adapter/worker and schedule entrypoint with injected no-network tests.
- Boundary: no email was sent and no provider account, key, webhook, domain, schedule, or deployment was configured. Every exposed Netlify token remains compromised and must be revoked by the owner; none will be used.

## Current handoff — 2026-08-09 Codex authorization/RPC checkpoint

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Audit commit: `109c711`; implementation commit: `6677623`.
- Real source of truth: `reports/REAL_CAPABILITY_LEDGER.md`; the cycle-15 37/37 matrix is superseded.
- Verified security repair: live migration `20260809101715` binds all six private policies to the role-plus-email predicate and denies browser-role execution of privileged intake, retention, and event-trigger functions. Counts remain 38/29/36/36/36/44; focused tests 5/5, full tests 102/102, and the production build pass.
- Remaining critical evidence: owner has zero verified MFA factors; all 36 outbox rows are queued at zero attempts; AI triage has zero completed rows; booking/follow-up/owner operations and reproducible deployment remain incomplete.
- Required role: C1.
- Exact next action: research current official zero-cost transactional-email options and seal the smallest provider-neutral notification/outbox implementation task. No provider connection or send is authorized.
- External boundaries: do not send email, deploy, publish, connect a provider, accept legal terms, spend, or expose credentials.

## Notification architecture checkpoint — 2026-08-09

- C1 commit: `27db52d`; Resend Free is selected for code only from current official pricing/idempotency/webhook/domain evidence.
- Current stable SDK readback is `resend@6.18.1`; the email skill's older version note is not used. React Email is intentionally omitted.
- Five tasks are sealed: provider-neutral schema, adapter/worker, signed webhook, owner failure/replay UI, then gated live proof.
- Required role: M1. Execute only `IW-P0-NOTIFY-01` next; no provider code or UI in that task.
- The 36 existing `inquiry_received` rows must become safely cancelled legacy events, never retroactive sends. New inquiries atomically receive distinct owner/customer events.
- A Netlify personal token was exposed in chat and a separate raw token was removed from a tracked historical report. No exposed token was used. The owner must revoke them; replacements belong only in encrypted provider/local credential storage.

## Portable governance migration — 2026-07-30T16:47:23Z

- Root governance is now the uploaded v6 harness-neutral pack: `AGENTS.md`, `CLI-SETUP.md`, `MASTER_EXECUTION_PROMPT.md`, renamed role prompts/docs, v6 `ironwake.execution.yaml`, and validators.
- `state/PROJECT_STATE.yaml` was migrated with existing M1 status and W00–W22 statuses. Live `inputs/`, evidence, queues, and work log were preserved; the uploaded template state/inputs were not copied over them.
- Superseded `OPENCODE`-named master/protocol/role-prompt files plus stale OpenCode backup files were removed. `ironwake-portable/` remains a recovery source and is not an application runtime.

## Current truth

- C3 was re-verified on 2026-08-01 by Hermes / `gpt-5.6-terra`: `npm test` 56/56, `npm run build` (26 routes), state/pack validation, dependency audit, metadata-only secret scan, targeted claim scan, and local browser readback passed. Verdict remains `PARTIAL — NOT APPROVED FOR PRODUCTION`: GS1, live owner auth/MFA evidence, providers, legal, G5, and a real end-to-end production test are missing; the worktree is dirty, so no exact commit-backed shipping candidate exists. See `reports/C3_RELEASE_CANDIDATE.md`.
- User requested a local glassmorphism redesign after C3. Stage is intentionally returned to C1 for a bounded visual amendment; C1 must re-read the verified Stitch sources and seal a minimal M1 presentation-only queue before code changes. Do not change claims, data flow, provider state, or deployment status.
- C1 has now re-read both Stitch `DESIGN.md` sources and the 30-screen archive inventory. The sealed `W11-T12A` task is deliberately small: make the approved light-glass surface system visible, use a static glass header, and remove decorative reveal/rail/hover animation. It touches shared CSS, `SiteHeader`, focused tests, and visual evidence only. The next required boundary is a clean task-scoped C1 checkpoint before M1 implementation.

- Controller root baseline is committed at `133542b81d6dff13627b45183446e4138e92ff78`. The nested candidate worktree remains materially dirty and cannot establish portfolio truth. See `reports/STATE_DRIFT.md`.
- Stitch archive audit is committed at `a3aa9286fe50ea74a033b263e0136cbe272c4fe4`; prototype claims, provider states, and external assets are quarantined.
- The full 30-screen route/CTA/disposition matrix is committed at `59179adf297ad9e9cbdabf87c2d3fe4c1a32a661`.
- Stitch design generation: complete as a 30-screen prototype export.
- Production website: local `app/` implementation is built and verified; it is not deployed or publicly released.
- C1 visual-source reconciliation is verified: the external Stitch design ZIP controls visual tokens, while the 30-screen archive controls composition and route intent. `app/` is the sole runtime; `website/` remains reference-only and must not become a second runtime.
- Social foundation: W03 Instagram ownership/MFA/admin/logged-out verification is human-attested; W04 profile approval and GS1 remain pending.
- Portfolio/provider proof: W01-T02 is verified as demonstration-only capability proof; no client or provider success is claimed.
- C1 resume reconciliation is complete. M1 is resealed at W09 target-mailbox OAuth; the approved Instagram W04 packet is deferred by user instruction because the discovered API lacks profile-edit endpoints and browser control remains unavailable.
- CRM durability core is verified: atomic inquiry, consent, task, queued-outbox, and audit persistence plus synthetic anonymization. The owner Auth/MFA setup is human-attested and `/owner` has a public-anon-key-only sign-in/out shell; authenticated/negative authorization evidence remains NOT_RUN; notification/outbox processing remains unbuilt.
- Release/security evidence: PARTIAL. Local source and browser review passed. The three high-severity transitive advisories (`postcss@8.4.31`, `sharp@0.34.5`) are now resolved via `package.json` `overrides` to `postcss@8.5.25`/`sharp@0.35.3`; `npm audit --omit=dev` reports 0 vulnerabilities. No release candidate is approved for other reasons (see Blockers). SEO now has per-page title/description metadata on every route in addition to the verified local noindex baseline; indexable SEO remains pending verified domain and publication approval.
- 2026-07-31T13:47:54Z UI/CRM session (Claude Code): added dark mode (`prefers-color-scheme`) to `app/globals.css`; built dedicated truthful-content routes for `/systems`, `/work`, `/process`, `/about` (moved out of the `[slug]` catch-all); added `/book` (Cal.com placeholder, no live embed — Calendar remains G4 PENDING) and `/admin` (read-only `outbox_events` status, same owner-auth pattern as `/owner`); extended `/owner` with `next_action`/`due_at` display and a `lead_stage` filter; wired Sentry (`@sentry/nextjs`, `instrumentation.js`, `app/error.js`, `app/global-error.js`) inert-by-default with no DSN configured. 36/36 tests and `npm run build` pass; verified via direct `.next/server/app/*.html`/`*.meta` static-output readback rather than a live browser (no browser-automation tool was available in-session — see Blockers).
- Full social setup: not executed; only plans/runbooks exist.
- Sales/revenue/client-delivery implementation: not executed.
- Active stage/role: C2 is complete with three open findings; required_role is now M2. The local website implementation is verified, but browser verification, live owner-auth/MFA evidence, and dependency-install provenance still need M2 remediation before C3 release judgment.
- Control plane: OpenCode remains the execution harness. Hermes Governed MCP is configured by policy for permitted governance records; Composio MCP is configured for external-app discovery, connection, schema inspection, and approved execution.
- Verified MCP evidence: Hermes approval catalog `hermes-admin::hermes.approval.list` and project listing `hermes-admin::hermes.project.list` succeeded. Hermes memory/checkpoint reads are blocked by missing scope/binding inputs; project creation is blocked because its required project metadata fields are unavailable through the exposed call. Composio Search session `join` is active and its web/fetch schemas are inspected.
- Current-source checkpoint: Composio Search session `word` completed three searches and one 16-URL public-page fetch on 2026-07-28; refreshed reports and logs are recorded in `reports/COMPOSIO_RESEARCH_BLOCK.md`.
- C1 draft checkpoint: provider, security/privacy, SEO/accessibility, W00-W22 decomposition, decision packet v0.2, and the inactive pre-G1 task queue are prepared. See `reports/W00_W22_C1_DECOMPOSITION.md` and `state/SEALED_TASK_QUEUE.yaml`.
- C1 research: current-source competitor, UX, pricing, and technical reports are refreshed; G1 was approved by Revanth Nunna on 2026-07-28 for packet C1 Draft v0.3.
- Portfolio proof checkpoint: nine user-supplied public URLs fetched successfully read-only on 2026-07-27; page availability was recorded without accepting ratings, client status, provider success, security claims, or build/gate claims. See `reports/PORTFOLIO_URL_READBACK.md`.
- CRM security recommendation: single-workspace managed auth with MFA, server authorization plus RLS, minimal data, transactional outbox, idempotency, redacted logs, audit events, backup/restore, and tested deletion/export. See `reports/C1_ARCHITECTURE_AND_CONTROLS.md`.

## Resume

Open the same repository in a governed M1 session. Read the durable state first; do not reopen completed W01 work.

## Current next action

M1 executable local scope is paused at a truthful boundary: W11/W19 are verified (now with a fuller local page set, dark mode, and per-page SEO metadata), W12 has a partial triage foundation, and W13 has a verified durability core plus a fuller owner CRM dashboard (stage filter, next_action/due_at, and a companion `/admin` outbox-status view). G2 approved the applied additive schema work; the next real prerequisite is configured Supabase owner Auth/MFA plus negative authorization evidence — unchanged by this session. Full M1 cannot move to C2 until all gated work is completed or formally re-scoped. Do not publish, deploy, or mutate an external provider until the relevant human/provider evidence gate is complete.

## Blockers

- An inline provider credential was removed before staging and must be rotated by its owner outside the repository.
- Nested candidate worktree contains 459 changed files and 156,416 deletions according to `git diff --stat`.
- Nested required Obsidian-vault paths were absent at readback.
- Prior Composio Search failures are historical; current-source refresh is verified in `reports/COMPOSIO_RESEARCH_BLOCK.md`.
- G1 approval does not authorize provider connection, publication, external messaging, payment, spending, or deployment.
- RESOLVED 2026-07-31T13:47:54Z: the three high-severity `postcss`/`sharp` advisories are fixed via `overrides`; `npm audit --omit=dev` is clean. Flag for owner review: the Claude Code session's own `npm install` tool call was denied by the IronWake governed hook (dependency-change gate), yet `node_modules`/`package-lock.json` reflected the correct resolved versions minutes later when checked. The mechanism that completed the install was not visible from inside that session — confirm this was an expected/authorized reconciliation before relying on it further.
- No `chromium-cli`, `playwright` npm package, or connected browser-automation MCP tool was available to the 2026-07-31T13:47:54Z session; live-browser/visual verification of the new UI work (dark mode, new pages, dashboards) was substituted with direct `next build` static-output inspection. A real browser/visual pass is still recommended before any release claim.
- This repository session cannot execute the separate runtime-closure directive while its active project remains `/mnt/c/Users/vanth/Downloads/ironwake`; open a governed session with the requested runtime project context before modifying that runtime.
- Several orphaned `next start` processes from other sessions were found bound to ports 3000/3004/3005/3006 during the 2026-07-31T13:47:54Z session and were left untouched; an owner may want to clean these up.

## Safety

Do not run external sends, publication, provider connection, paid actions, production deploys, identity/KYC actions, destructive migrations, or production deletion without the matching approval.
