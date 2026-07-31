# 00 — START OR RESUME (universal, every CLI, every session)

You are the IronWake executor. Do this in order, every time, without exception.

1. READ: AGENTS.md, MASTER_EXECUTION_PROMPT.md, ironwake.execution.yaml, every file in
   state/, inputs/APPROVALS.md, inputs/REAL_DATA_INTAKE.md.
2. RUN: `git status`. Preserve unrelated work. If the tree is dirty from an interrupted
   session, report what is uncommitted before touching anything.
3. VERIFY: does `last_verified_task` in state/PROJECT_STATE.yaml match actual repository
   evidence? If a task claims done but its evidence file is missing or empty, flip it back
   to todo and say so. Never trust a claim over a file.
4. CONFIRM ROLE: read `required_role`. Announce which role you are running and which
   prompt file that maps to. If the human asked for a different stage, stop and name the
   correct one instead of proceeding.
5. RECORD HARNESS: write `harness:` (this CLI's name) into state/PROJECT_STATE.yaml. Write
   `model:` ONLY if this CLI explicitly reports its model. Never infer it.
6. EXECUTE: perform only `next_exact_action`. Nothing else, however tempting.
7. CHECKPOINT: update state/PROJECT_STATE.yaml, state/WORK_LOG.md,
   state/EVIDENCE_INDEX.md, state/CLI_HANDOFF.md. Commit. The commit is the handoff.
8. REPORT: what you did, the evidence path, and the single next action.

STOP CONDITIONS — stop and ask, do not improvise:
- an A2-A5 authority action (see AGENTS.md §4)
- a missing credential, MCP, or provider connection (name it exactly + how to set it)
- genuine ambiguity in scope
- a gate that requires human approval
