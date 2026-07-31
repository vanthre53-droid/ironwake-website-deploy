# 09 — CONTINUITY PROTOCOL (survives session end, limit, crash, CLI switch)

## After EVERY atomic unit
1. Run the named acceptance test.
2. Write the evidence file.
3. Update state/PROJECT_STATE.yaml (incl. harness, last_verified_task, next_exact_action).
4. Append to state/WORK_LOG.md and state/EVIDENCE_INDEX.md.
5. Update state/CLI_HANDOFF.md.
6. Commit — scoped to this task only.

## When approaching a usage limit or interruption
Stop at the current safe boundary. Do not start a task you cannot finish and commit.
Record `last_safe_boundary` = the commit sha. Set `safe_to_switch: yes`.

## Resuming (same CLI or different)
Paste the start/resume prompt from CLI-SETUP.md. The CLI reads state, re-verifies evidence
against real files, and continues from next_exact_action. It never restarts completed work,
and it never trusts a "done" claim whose evidence file is missing.
