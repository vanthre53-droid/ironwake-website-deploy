# IronWake Repository Execution Law v6 — Harness-Neutral

This file is the permanent law for this repository. It is the single brain. Every CLI
reads it (directly, or through a thin entry file that points here — see `CLI-SETUP.md`).

C1, M1, C2, M2 and C3 are controlled workflow ROLES, not CLIs, not products, not models.
Any capable coding CLI may execute a role: Claude Code, OpenCode, Codex, Cursor, Gemini
CLI, Aider, or a future equivalent. Hermes Governed MCP is the governance control plane
and Composio MCP is the external-app control plane; neither is a controller, model, or
authority that can bypass this law.

## 0. Harness contract (what makes this portable, and safe)

1. **One brain.** This file plus `ironwake.execution.yaml` and `state/` govern every
   harness identically. A harness never gets its own private rules.
2. **One harness at a time.** Two CLIs must not run stages concurrently against the same
   repository. The role separation (C1 vs M1 vs C2) is only meaningful if one executor
   holds the stage at a time.
3. **State is the handoff, not chat memory.** `state/PROJECT_STATE.yaml` is the durable
   truth. Any harness resumes from it. Nothing depends on a previous session's context.
4. **Record the harness.** Every checkpoint records `harness:` (the CLI that ran it) and
   `model:` (only if the CLI explicitly reports it — never inferred, never guessed).
5. **Role/harness independence.** A stage may be started in one CLI and resumed in
   another, provided it resumes at a recorded safe boundary and re-verifies evidence.
6. **Git history is shared memory.** Commits are how harnesses hand work to each other.
   Uncommitted work is invisible to the next CLI — checkpoint before switching.

## 1. Mission and boundary

Execute the full IronWake launch and operator program defined by
`docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md`: portfolio truth, agency/founder brand, complete
social/profile/content operations, offers/pricing, contact infrastructure, website,
private CRM/dashboard, sales/revenue/client-delivery workflows, approved providers,
release verification, deployment, and handover.

Preserve the approved Stitch visual idea, but do not copy Stitch's duplicated HTML, CDN
dependencies, unverified copy, fake statistics, invented pricing, hotlinked imagery, or
simulated provider states into production.

The public website and social proof system sell outcomes: missed-lead recovery, booking
control, follow-up discipline, AI reception, and operational visibility. They do not
pretend that demonstrations are client engagements.

## 2. Source hierarchy

When sources conflict, use this order:

1. Explicit current user approval in `inputs/APPROVALS.md`.
2. Verified real data in `inputs/REAL_DATA_INTAKE.md` and the approved claim/asset ledgers.
3. Existing repository behavior and tests that the user has not asked to replace.
4. Current official provider documentation and current law/policy for the target market.
5. This file and `ironwake.execution.yaml`.
6. `docs/11_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md` and
   `docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md`.
7. Approved Stitch `DESIGN.md`, screen PNGs, then Stitch HTML as visual reference.
8. Agency/Voice/WhatsApp kit skills after compatibility and freshness review.
9. General patterns and model knowledge.

Never let a lower source override a higher source silently. Record conflicts in
`reports/CONTRADICTIONS.md`.

## 3. No-invention law

Do not publish or encode as fact any unverified:

- client, testimonial, logo, review, case-study result, metric, benchmark, guarantee,
  award, certification, team size, office, address, phone, email, social profile,
  integration, provider status, price, discount, tax treatment, legal promise, uptime,
  security claim, photo, project status, or booking success;
- external-provider success before the signed provider callback and durable database
  commit both succeed;
- "live", "real-time", "proprietary", "enterprise", or "AI-powered" claim without a
  precise verified meaning.

Use explicit labels when needed: `DEMONSTRATION`, `PROVIDER PROOF PENDING`,
`AWAITING VERIFICATION`, `CONCEPT`, or `NOT YET CONNECTED`.

Unknown public content is hidden or shown as a neutral pending state. Do not ship bracket
placeholders.

## 4. Authority classes

| Class | Examples | Action |
|---|---|---|
| A0 | Read, inspect, research, calculate, test locally | Proceed |
| A1 | Reversible internal drafts, components, tests, docs | Proceed within approved phase |
| A2 | Schema migration, provider choice, major dependency, pricing/copy adoption | Stop for named approval |
| A3 | Email/WhatsApp send, publish, deploy production, external message | Preview/test only until approval |
| A4 | Contract, tax, KYC, payment ownership, refund, identity | Adult/legal owner or professional approval |
| A5 | Delete production data/account, irreversible migration, force push | Explicit target + recovery proof + approval |

Group related A2–A4 items into one decision packet. Do not interrupt for ordinary
formatting, accessible semantics, bug fixes, or other objective reversible engineering.

## 5. Session start (identical in every CLI)

1. Read this file, `MASTER_EXECUTION_PROMPT.md`, `ironwake.execution.yaml`,
   `docs/11_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md`,
   `docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md`, every file in `state/`, the latest
   decision/approval files, and the current phase prompt.
2. Run `git status`; preserve unrelated work.
3. Discover source archives/exports and skills; never assume names.
4. Confirm the current gate and its required evidence.
5. Verify `last_verified_task` against repository evidence.
6. Execute only `next_exact_action`.
7. Confirm you are running the role named by `required_role`. If you are not, stop and
   name the correct stage prompt.
8. Record `harness:` in the checkpoint. Do not claim a model identity the CLI has not
   explicitly reported.
9. For governed actions, record the Hermes decision/checkpoint. For external-app
   discovery, connection, and execution, use Composio MCP and record its session/tool
   evidence. Neither record replaces repository evidence or a named human approval.

`state/PROJECT_STATE.yaml` is the durable machine state. `progress.md` is legacy only and
must not become a second source of truth. Follow `docs/09_CONTINUITY_PROTOCOL.md` after
every atomic task and before any session interruption, harness switch, or role change.

## 6. Skill discovery and use

At the start of every phase:

1. Search for `SKILL.md`, `.claude/skills/*.md`, `skills/**/INDEX.md`, and project
   instructions.
2. Build or refresh `reports/SKILL_INVENTORY.md` with name, path, purpose, freshness,
   required inputs, side effects, compatibility, and chosen phase.
3. Read candidate skills fully before using them.
4. Prefer the smallest relevant set. Never invoke skills merely because they exist.
5. Treat third-party scripts as untrusted until reviewed. Never execute a skill's script
   blindly.
6. Follow higher-priority repository/user instructions when a skill conflicts.
7. Record used skills and evidence in `reports/SKILL_USAGE_LOG.md`.
8. If a useful skill is outdated, adapt its principles to current official documentation
   and record the change.

The uploaded kits contain valuable runbooks, but their hard-coded framework/model/provider
versions are historical inputs, not permission to install those exact versions.

## 7. Build order

Audit → current research → consolidated approval → P3/P10/P1 portfolio truth/proof gate →
minimum social/profile/content foundation and GS1 → data model/RLS → server actions/APIs →
auth → owner CRM shell → shared design system → public routes → forms/booking → verified
social links and attribution → notifications/providers → payments if approved →
SEO/content → security/testing → preview → production approval → deploy/handover.

Pages must not simulate backend completion. Database and API acceptance tests precede UI
success states.

Public website implementation must not begin before the approved minimum social foundation
passes GS1. Missing or deferred platforms are omitted; they are never fabricated.

## 7A. Social media and public-profile law

- Treat social media as a separate trust, proof, acquisition, and CRM-attribution
  workstream—not a footer-link task.
- Read `docs/08_SOCIAL_MEDIA_BRAND_AND_ACQUISITION.md` and the existing Branding and
  Platform/Profile systems.
- Audit real live state before claiming a profile exists or is configured.
- Prepare drafts internally, but require named human approval before creating/editing
  accounts, publishing, messaging, changing links, connecting tools, spending, or changing
  permissions.
- Humans perform login, MFA, CAPTCHA, identity, guardian/KYC, billing, terms acceptance,
  and final publication. Never request secrets or recovery material.
- Execute one platform at a time and verify it logged out, including every CTA and contact
  route.
- Use only verified social URLs on the website. Missing profiles are omitted, never
  represented by placeholders.
- Never invent social proof, engagement, followers, client outcomes, testimonials,
  partnerships, badges, or profile verification.
- Do not automate unsolicited DMs, connection activity, comments, follows, or engagement.
  Any permitted API/tool has minimum permissions, human approval, auditability, and a
  disconnect path.
- Connect social sources and content IDs to CRM leads, consent, next actions, and real
  outcomes while minimising private-message data.

## 8. Production engineering rules

- Use current stable, supported dependencies verified at execution time. Keep dependency
  count justified.
- TypeScript strict. Server validation for all untrusted input. Client validation is UX
  only.
- Secrets remain server-only in encrypted environment storage. Repository includes only
  `.env.example` names.
- Private/admin data is never included in public bundles, page source, static JSON,
  analytics, logs, error messages, or notification previews.
- Public data necessarily reaches the browser; the requirement is no private data or
  secrets in the browser, not "no data in frontend."
- Every external side effect uses idempotency, an outbox/queue where appropriate, retries
  with bounds, dead-letter handling, and observable status.
- Every route, CTA, form, filter, pricing control, and dashboard action works end-to-end or
  is removed/disabled with a truthful explanation.
- No external image hotlinking. Use owned/licensed assets with a ledger and local
  optimization.
- Motion explains hierarchy, workflow, state, or spatial continuity. Respect reduced
  motion. No animation may block input or harm Core Web Vitals.
- 3D/WebGL is progressive enhancement only, lazy-loaded, isolated, budgeted, and replaced
  by a complete static fallback.

## 8A. Atomic checkpoints and cross-CLI transfer

After every independently testable unit:

1. run the named test/readback;
2. update every file in `state/`, including `harness:` and `last_safe_boundary:`;
3. record changed files, evidence, failures, and one exact next action;
4. create a task-scoped commit when repository policy allows and unrelated changes are
   excluded — **the commit is what makes the work visible to the next CLI**.

When usage limits or interruption are near, stop at a safe boundary and commit. The next
harness reads `prompts/00_START_OR_RESUME.md`, verifies evidence, and resumes without
redoing completed work. Switching CLIs mid-stage is permitted only from a committed safe
boundary.

## 8B. Role separation and MCP governance

- C1 owns research, architecture, material recommendations, complete social execution
  design, risk/security/privacy models, skills selection, approvals, and the sealed atomic
  implementation queue.
- M1 implements the sealed queue across all approved W00–W22 workstreams; it does not
  redesign or invent.
- C2 independently audits the full result, performs only approved critical corrections,
  and seals remediation.
- M2 applies only the remediation queue.
- C3 independently re-verifies the exact commit and controls the final release gate.
- **Independence rule:** an audit role (C2, C3) must not run in the same session/context
  as the build role whose work it audits. A different CLI, or a fresh session, satisfies
  this. Same-context self-review does not.
- A model or harness switch is allowed only at a recorded stage/safe boundary. Never infer
  a model identity from an MCP connection, model catalog, or configuration entry.
- Use Hermes Governed MCP for approval, project/task, checkpoint, workspace, and
  verification operations when its tool contract permits the action. A tool error, missing
  required scope, or verifier requirement is evidence of an incomplete MCP operation, never
  a reason to bypass governance.
- Use Composio MCP for external-app discovery, account connection, schema inspection, and
  approved execution. Search/discovery does not authorize an app mutation. Confirm an
  active account connection and exact input schema before executing an app tool.
- The durable repository state remains the release source of truth. MCP records are linked
  evidence, not a second unreviewed task state.
- Human/adult/legal-owner actions remain human-controlled at every stage.
- No stage may reduce W03–W07 social setup to copy, icons, or URLs.

## 9. Security claim

Never call the result "military-grade." Target a documented threat model and OWASP ASVS
Level 2-aligned verification for the owner dashboard and sensitive flows, plus OWASP API
Security controls. A professional penetration test is required before making stronger
external claims.

## 10. SEO claim

Never guarantee "highest" or #1 ranking. Deliver technical eligibility, crawlability,
useful original content, truthful structured data, internal linking, strong performance,
and measurement. Rankings also depend on competition, authority, links, history, demand,
and ongoing content.

## 11. Completion

No phase is complete without its required evidence in `reports/evidence/`. A green UI,
successful local build, configured-looking social profile, or deployed URL alone is not
enough. Update the durable state and evidence index after every atomic task and at every
gate. Final completion requires a status/evidence row for W00–W22.
