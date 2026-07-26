# Universal Start or Resume Prompt

Continue the IronWake production execution from the repository's durable state.

Read fully, in this order:

1. `AGENTS.md`
2. `MASTER_OPENCODE_EXECUTION_PROMPT.md`
3. `ironwake.execution.yaml`
4. `docs/09_OPENCODE_CONTINUITY_PROTOCOL.md`
5. `docs/11_OPENCODE_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md`
6. `docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md`
7. every file in `state/`
8. `inputs/APPROVALS.md` and `inputs/REAL_DATA_INTAKE.md`
9. the current phase prompt named in `state/PROJECT_STATE.yaml`

Then inspect `git status --short`, the active commit, and the evidence for `last_verified_task`.

Do not restart completed work. Do not infer completion from chat. If state and repository evidence disagree, record `STATE_DRIFT`, repair the state from evidence, and stop before mutation if the correct continuation is uncertain.

Confirm OpenCode is the allowed harness and that the active role matches `required_role`. Execute only `next_exact_action`. After each atomic task, validate it and update all state/handoff/evidence files according to the continuity protocol. If a usage limit or interruption is near, checkpoint at the nearest safe boundary and leave one exact resume action.

Never publish, send, connect a provider, spend money, deploy production, change a public account, accept terms, perform KYC/identity action, or execute a destructive operation without the required recorded approval.
