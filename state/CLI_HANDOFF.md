# CLI Handoff

## Current handoff — 2026-08-09 Codex real-product reconstruction

- Programme: `IRONWAKE_REAL_PRODUCT_COMPLETION`; status `PARTIAL`.
- Audit commit: `109c711`.
- Real source of truth: `reports/REAL_CAPABILITY_LEDGER.md`; the cycle-15 37/37 matrix is superseded.
- Live critical evidence: migration 006 absent; `is_owner()` and the inquiry policy are role-only; privileged SECURITY DEFINER functions are executable by anon/authenticated; owner has zero verified MFA factors; all 36 outbox rows are queued at zero attempts; AI triage has zero completed rows.
- Required role: M1.
- Exact next action: execute only sealed `IW-P0-SEC-01`, verify the forward authorization/RPC repair locally and live, then checkpoint before email or AI work.
- External boundaries: do not send email, deploy, publish, connect a provider, accept legal terms, spend, or expose credentials in this task.

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
