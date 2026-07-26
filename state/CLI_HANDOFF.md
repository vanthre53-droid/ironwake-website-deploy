# CLI Handoff

## Current truth

- Controller root was initialized as a Git repository on 2026-07-26 with user approval. It has no initial commit; the nested candidate worktree remains materially dirty and cannot establish portfolio truth. See `reports/STATE_DRIFT.md`.
- Stitch design generation: complete as a 30-screen prototype export.
- Production website: not built.
- Social foundation: planned, not verified live.
- Portfolio/provider proof: requires P0 audit and P1.5 truth gate.
- CRM/auth/database/integrations: not built or connected.
- Release/security/SEO evidence: not run.
- Full social setup: not executed; only plans/runbooks exist.
- Sales/revenue/client-delivery implementation: not executed.
- Active OpenCode role/stage: C1.

## Resume

Open the same repository in OpenCode and run `/ironwake-start`. Do not start M1 until state records `required_role: M1`.

## Current next action

The human owner must provide the public Git author name and email. OpenCode C1 will configure them for this repository only, rerun the staged checks, create the approved controller-only baseline commit, and resume P0.

## Blockers

- Controller root has no committed baseline.
- Git rejected the initial commit because no author identity is configured.
- An inline provider credential was removed before staging and must be rotated by its owner outside the repository.
- Nested candidate worktree contains 459 changed files and 156,416 deletions according to `git diff --stat`.
- Nested required Obsidian-vault paths were absent at readback.

## Safety

Do not run external sends, publication, provider connection, paid actions, production deploys, identity/KYC actions, destructive migrations, or production deletion without the matching approval.
