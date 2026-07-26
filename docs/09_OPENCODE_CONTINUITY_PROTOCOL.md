# OpenCode Continuity Protocol

The repository state is the handoff mechanism inside OpenCode. After every atomic task, record changed files, commands, evidence, failures, remaining risk and exactly one next action in `state/PROJECT_STATE.yaml`, `state/WORK_LOG.md`, `state/EVIDENCE_INDEX.md` and `state/CLI_HANDOFF.md`.

If OpenCode reaches a limit or is interrupted, start a new OpenCode session in the same repository and use `prompts/00_START_OR_RESUME.md`. Verify the last evidence before continuing; do not repeat completed work.

Before changing role or model, stop at the nearest safe boundary. Update `required_role`, `active_stage`, `phase_prompt`, `next_exact_action` and the relevant sealed queue. Do not use chat memory as state.
