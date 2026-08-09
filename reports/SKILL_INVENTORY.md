# P0 Skill Inventory

- Audited: 2026-08-09T10:00:00Z
- Status: discovery refreshed; the official Supabase skill was selected for the real capability audit

| Name | Path | Purpose | Freshness | Required inputs | Side effects | Compatibility | Chosen phase |
|---|---|---|---|---|---|---|---|
| Repository audit | `ironwakeportifolioprojects/.claude/skills/repo-audit/SKILL.md` | Historical nested-worktree audit | Unknown; source is untracked in a dirty worktree | Clean nested repository | Read-only by intent | Defer; cannot establish a trustworthy baseline | P0 after integrity resolution |
| Enterprise gate | `ironwakeportifolioprojects/.claude/skills/enterprise-gate/SKILL.md` | Historical app gate procedure | Unknown | Stable app source and providers | May run builds/tests | Defer; not an IronWake release gate | P1.5/P5 if adapted |
| Design retrofit | `ironwakeportifolioprojects/.claude/skills/design-retrofit/SKILL.md` | Historical UI-restyle procedure | Unknown | Stable app source and approved UI task | Changes application code | Reject for current phase; P0 prohibits app edits | None |
| Handoff | `ironwakeportifolioprojects/.claude/skills/handoff/SKILL.md` | Historical nested-worktree continuity | Unknown | Nested worktree and vault files | Documentation writes | Defer; controller continuity protocol governs this work | None |
| Agency legacy pack | `AGENCY_V2_2_UPGRADE_PACK.zip:pack/04_HERMES_SKILLS/{fleet-orchestration,portfolio-demo-factory,voice-agent-build,whatsapp-bot-build,demo-personalization-pipeline,webchat-widget,script-generator}/SKILL.md` | Historical implementation runbooks | Historical versions; provider and policy details require current official verification | Approved scope, account and provider data | Several can trigger external/provider work | Adapt or defer; repository law overrides all controller/model references | P2-P4 only after approval |
| Mixed IronWake skills archive | `ironwake-skills.tar.gz:skills/**/SKILL.md` | Broad historical skill collection | Unknown; includes workflows incompatible with OpenCode-only control | Varies | Some may invoke providers, publishing, or other controllers | Defer pending targeted review and compatibility check | No phase selected |
| Supabase | `/home/shadowlingo/.codex/plugins/cache/openai-curated-remote/supabase/1.0.0/skills/supabase/SKILL.md` | Current Supabase schema, Auth, RLS, RPC, advisor, and migration guidance | Skill v0.1.2; current changelog checked 2026-08-09 | Connected project ID; no credentials copied | Read-only provider/database inspection in P0; DDL only after a sealed approved task | Selected; repository law remains higher priority | P0.1 audit and later approved remediation |

## Result

No root-level `SKILL.md`, `.claude/skills/*.md`, `skills/**/INDEX.md`, or `rules/*.md` exists in the controller root. Historical archive skills remain deferred. The official Supabase skill was read in full and used for read-only current-state inspection; no third-party script was executed.

### Discovery refresh

The nested workspace contains four historical `.claude` skill files. The historical Agency ZIP lists seven `SKILL.md` files. The mixed `ironwake-skills.tar.gz` lists 150+ candidates, including controller/model-routing, outbound, provider, publishing, and automation skills. They remain discovery-only: several conflict with the OpenCode-only controller law or could create external/provider side effects; none is selected for P0/P1. A candidate is read in full only if it is chosen for a later compatible task, and its freshness and side effects will then be recorded in `reports/SKILL_USAGE_LOG.md`.
