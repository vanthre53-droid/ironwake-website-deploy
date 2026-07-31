# CLI SETUP — run this repo from any coding CLI

One brain (`AGENTS.md`), one state file (`state/PROJECT_STATE.yaml`), one git history.
Each CLI just needs a thin entry file pointing at the brain. Nothing is converted,
copied, or duplicated — every CLI reads the same law.

## One-time wiring (run from the repository root)

```bash
# Claude Code
ln -sf AGENTS.md CLAUDE.md

# Codex — reads AGENTS.md natively, nothing to do
# OpenCode — reads AGENTS.md natively, nothing to do

# Cursor
mkdir -p .cursor/rules && ln -sf ../../AGENTS.md .cursor/rules/ironwake.mdc

# Gemini CLI
ln -sf AGENTS.md GEMINI.md

# Aider
printf 'read: AGENTS.md\nread: ironwake.execution.yaml\n' > .aider.conf.yml
```

If your filesystem or CLI does not follow symlinks, use `cp AGENTS.md CLAUDE.md` and
re-copy after any edit to `AGENTS.md`. Never edit the copies — `AGENTS.md` is canonical.

## Per-CLI permission configuration

Permissions are the one thing that cannot be shared — each CLI has its own format.
Equivalent configs are provided so behaviour matches everywhere:

| CLI | File | Status |
|---|---|---|
| OpenCode | `opencode.json` | provided |
| Claude Code | `.claude/settings.json` | provided |
| Codex | uses its own approval mode — run with full-auto and rely on the deny rules below | manual |
| Cursor / Gemini / Aider | tool-specific | apply the same intent |

The intent, in all of them: allow everything except operations that destroy work.
Denied everywhere: `rm -rf`, `git push --force`, `git reset --hard`, `git clean -fd`.
Ask everywhere: plain `rm`, `git push`, `sudo`, database resets.

## Portable stage commands (replaces OpenCode's slash commands)

OpenCode's `/ironwake-*` commands only exist in OpenCode. In any other CLI, paste the
matching prompt text instead. Same effect, no CLI dependency.

**Start or resume — the only one you need most of the time**
```
Read AGENTS.md, ironwake.execution.yaml, and all of state/. Execute
prompts/00_START_OR_RESUME.md: verify the current role, gate, and evidence, then perform
only next_exact_action. Record harness: <your CLI name> in the checkpoint. Do not skip the
state gate. Do not claim a model identity unless this CLI reports it explicitly.
```

**C1 — architecture / research**
```
Read AGENTS.md and state/. Execute only prompts/10_STAGE_C1_ARCHITECT.md. Stop at the
approval gate. Record harness: <your CLI name>.
```

**M1 — sealed implementation**
```
Read AGENTS.md and state/SEALED_TASK_QUEUE.yaml. Execute only
prompts/11_STAGE_M1_IMPLEMENT.md. Do not redesign or add unqueued scope. Record harness.
```

**C2 — independent audit** (use a DIFFERENT CLI or a fresh session than the one that ran M1)
```
Read AGENTS.md and state/. Execute only prompts/12_STAGE_C2_AUDIT.md. Inspect actual files
and evidence, not the build session's claims. Record harness.
```

**M2 — sealed remediation**
```
Read AGENTS.md and state/SEALED_REMEDIATION_QUEUE.yaml. Execute only
prompts/13_STAGE_M2_REMEDIATE.md. Fix only the sealed queue. Record harness.
```

**C3 — final release gate** (again: different CLI or fresh session)
```
Read AGENTS.md and state/. Execute only prompts/14_STAGE_C3_FINAL_GATE.md. Re-verify the
exact commit. Never deploy automatically. Record harness.
```

**Deploy** (only after approval is recorded in inputs/APPROVALS.md)
```
Read AGENTS.md and inputs/APPROVALS.md. Verify recorded production approval exists, then
execute only prompts/07_PHASE_6_DEPLOY_AND_HANDOVER.md. Record harness.
```

## Switching CLIs safely

1. Finish the current atomic unit.
2. Ensure `state/` is updated and **committed** — uncommitted work is invisible to the
   next CLI.
3. Open the other CLI in the same repository root.
4. Paste the start/resume prompt. It reads state and continues.

Do not run two CLIs against this repository at the same time. Role separation depends on
one executor holding the stage.

## Which CLI for which role (suggestion, not law)

- **C1 / C2 / C3** (judgment, audit, gates) — your strongest reasoning model
- **M1 / M2** (sealed implementation) — your fastest capable coding model
- **C2 and C3 specifically** — a different CLI than the one that ran M1/M2 where possible.
  Cross-CLI audit is genuinely stronger than same-tool self-review, because it cannot
  inherit the builder's assumptions.
