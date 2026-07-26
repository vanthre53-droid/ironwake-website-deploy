# P0 Skill Inventory

- Audited: 2026-07-26T08:57:57Z
- Status: discovery complete for immediately relevant candidates; none used or executed

| Name | Path | Purpose | Freshness | Required inputs | Side effects | Compatibility | Chosen phase |
|---|---|---|---|---|---|---|---|
| Repository audit | `ironwakeportifolioprojects/.claude/skills/repo-audit/SKILL.md` | Historical nested-worktree audit | Unknown; source is untracked in a dirty worktree | Clean nested repository | Read-only by intent | Defer; cannot establish a trustworthy baseline | P0 after integrity resolution |
| Enterprise gate | `ironwakeportifolioprojects/.claude/skills/enterprise-gate/SKILL.md` | Historical app gate procedure | Unknown | Stable app source and providers | May run builds/tests | Defer; not an IronWake release gate | P1.5/P5 if adapted |
| Design retrofit | `ironwakeportifolioprojects/.claude/skills/design-retrofit/SKILL.md` | Historical UI-restyle procedure | Unknown | Stable app source and approved UI task | Changes application code | Reject for current phase; P0 prohibits app edits | None |
| Handoff | `ironwakeportifolioprojects/.claude/skills/handoff/SKILL.md` | Historical nested-worktree continuity | Unknown | Nested worktree and vault files | Documentation writes | Defer; controller continuity protocol governs this work | None |
| Agency legacy pack | `AGENCY_V2_2_UPGRADE_PACK.zip:pack/04_HERMES_SKILLS/{fleet-orchestration,portfolio-demo-factory,voice-agent-build,whatsapp-bot-build,demo-personalization-pipeline,webchat-widget,script-generator}/SKILL.md` | Historical implementation runbooks | Historical versions; provider and policy details require current official verification | Approved scope, account and provider data | Several can trigger external/provider work | Adapt or defer; repository law overrides all controller/model references | P2-P4 only after approval |
| Mixed IronWake skills archive | `ironwake-skills.tar.gz:skills/**/SKILL.md` | Broad historical skill collection | Unknown; includes workflows incompatible with OpenCode-only control | Varies | Some may invoke providers, publishing, or other controllers | Defer pending targeted review and compatibility check | No phase selected |

## Result

No root-level `SKILL.md`, `.claude/skills/*.md`, `skills/**/INDEX.md`, or `rules/*.md` exists in the controller root. Candidate skills were not invoked, and no third-party script was executed. A targeted skill may be reviewed only after the intended Git root is identified and the relevant phase is unblocked.
