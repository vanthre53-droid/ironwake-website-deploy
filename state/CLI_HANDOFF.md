# CLI Handoff

## Current truth

- Controller root baseline is committed at `133542b81d6dff13627b45183446e4138e92ff78`. The nested candidate worktree remains materially dirty and cannot establish portfolio truth. See `reports/STATE_DRIFT.md`.
- Stitch archive audit is committed at `a3aa9286fe50ea74a033b263e0136cbe272c4fe4`; prototype claims, provider states, and external assets are quarantined.
- The full 30-screen route/CTA/disposition matrix is committed at `59179adf297ad9e9cbdabf87c2d3fe4c1a32a661`.
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

OpenCode C1 must inventory the P1 RapidPulse, P3 DentaCare, and P10 Atelier source snapshots and record their code, test, provider-proof, and public-claim status without accepting archive contents as live proof.

## Blockers

- An inline provider credential was removed before staging and must be rotated by its owner outside the repository.
- Nested candidate worktree contains 459 changed files and 156,416 deletions according to `git diff --stat`.
- Nested required Obsidian-vault paths were absent at readback.

## Safety

Do not run external sends, publication, provider connection, paid actions, production deploys, identity/KYC actions, destructive migrations, or production deletion without the matching approval.
