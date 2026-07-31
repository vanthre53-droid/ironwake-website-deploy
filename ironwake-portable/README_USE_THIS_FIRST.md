# IronWake execution pack v6 — harness-neutral

Controls the complete IronWake website, social, CRM, sales, revenue, delivery, security,
QA, deployment and handover program. Runs from ANY capable coding CLI.

## What changed from v5
v5 was hard-wired to OpenCode ("OpenCode is the only execution harness"). v6 makes the
roles portable: Claude Code, OpenCode, Codex, Cursor, Gemini CLI, Aider — any of them can
execute any stage. The law, the state file, and git history are shared; only the thin
entry file and permission config differ per CLI. See `CLI-SETUP.md`.

## What is automatic
The CLI reads the rules, current state, inputs, prompts, queues and evidence requirements.
It audits, researches, plans, implements, tests, reviews and checkpoints according to the
recorded stage. You do not manually copy work between models or rewrite prompts.

## What cannot be automated safely
You must still connect providers, approve material decisions, enter secrets into
provider/deployment environments, complete MFA/CAPTCHA/KYC/terms, and approve external
publishing, messages, spending and production deployment. No agent can do those without
your account authorization.

## Start once
1. Open the actual IronWake **Git repository** as the project root — not a Downloads
   folder. Work done outside a git repo cannot be handed to the next CLI.
2. Copy this entire pack into that repository. Do not merge with old v1–v5 controller files.
3. Run the wiring commands in `CLI-SETUP.md` for whichever CLIs you intend to use.
4. Connect your providers inside each CLI and select models per role. The pack does not
   guess model IDs.
5. Open your chosen CLI in the repository and paste the start/resume prompt from
   `CLI-SETUP.md`.

## Fixed role order
```text
C1 architecture/research
→ your approval
→ M1 implementation
→ C2 independent audit
→ M2 remediation
→ C3 final gate
→ your production approval
→ deployment/handover
```
C1/M1/C2/M2/C3 are roles, not applications. One CLI holds the stage at a time. Audit roles
(C2, C3) should run in a different CLI or fresh session than the build they audit.

## Never place in this repository
Passwords, recovery codes, payment-card details, identity documents, private API keys or
private customer data. Use `.env`/provider secret storage and keep only variable names in
`.env.example`. `.env.local` is git-ignored and must never be uploaded, pasted, or shared —
if it ever is, rotate every key it contains.

## Important stop gates
The system stops for approval before public pricing/copy, provider activation, account
edits, publication, external sends, payment activation, schema meaning changes, production
deployment and destructive actions. It proceeds automatically with objective reversible
engineering and tests.

## Main files
| File | Purpose |
|---|---|
| `AGENTS.md` | Permanent repository law — the single brain, read by every CLI |
| `CLI-SETUP.md` | Per-CLI wiring + portable stage prompts |
| `MASTER_EXECUTION_PROMPT.md` | Full controller prompt (harness-neutral) |
| `ironwake.execution.yaml` | Machine-readable stages and gates |
| `opencode.json` | OpenCode permissions/commands |
| `.claude/settings.json` | Claude Code permissions |
| `state/PROJECT_STATE.yaml` | Exact current role, harness, and next action |
| `state/SEALED_TASK_QUEUE.yaml` | C1-approved M1 work |
| `state/SEALED_REMEDIATION_QUEUE.yaml` | C2-approved M2 work |
| `prompts/00_START_OR_RESUME.md` | Safe continuation prompt |

## Validation
```bash
bash scripts/validate-execution-pack.sh
bash scripts/validate-state.sh
```
These validate pack structure only. They do not claim the website, social accounts,
providers or deployment are complete.
