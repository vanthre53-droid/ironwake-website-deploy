# IronWake OpenCode-only pack v5

This is the only pack to use. It starts after Stitch screen generation and controls the complete IronWake website, social, CRM, sales, revenue, delivery, security, QA, deployment and handover program.

## What is automatic

OpenCode reads the rules, current state, inputs, prompts, queues and evidence requirements. It audits, researches, plans, implements, tests, reviews and checkpoints according to the recorded stage. You do not manually copy work between models or rewrite prompts.

## What cannot be automated safely

You must still connect your OpenCode providers, approve material decisions, enter secrets into provider/deployment environments, complete MFA/CAPTCHA/KYC/terms, and approve external publishing, messages, spending and production deployment. No legitimate agent can do those actions without your account authorization.

## Start once

1. Open the actual IronWake Git repository as the OpenCode project root.
2. Copy this entire pack into that repository without merging old v1–v4 controller files.
3. Connect the providers you already own inside OpenCode. Select the model for each role in OpenCode; do not guess model IDs in files.
4. Start OpenCode in the repository and run `/ironwake-start`.

OpenCode then reads `prompts/00_START_OR_RESUME.md` and follows `state/PROJECT_STATE.yaml`.

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

C1/M1/C2/M2/C3 are roles inside OpenCode, not separate applications. OpenCode is the only harness. There is no Hermes, OpenRouter, separate Codex CLI, MiMo Code CLI or Claude Code requirement.

## Never place in this repository

Passwords, recovery codes, payment-card details, identity documents, private API keys or private customer data. Use `.env`/provider secret storage and keep only variable names in `.env.example`.

## Important stop gates

The system stops for approval before public pricing/copy, provider activation, account edits, publication, external sends, payment activation, schema meaning changes, production deployment and destructive actions. It proceeds automatically with objective reversible engineering and tests.

## Main files

| File | Purpose |
|---|---|
| `AGENTS.md` | Permanent OpenCode project law |
| `opencode.json` | OpenCode instructions, permissions and commands |
| `MASTER_OPENCODE_EXECUTION_PROMPT.md` | Full controller prompt |
| `ironwake.execution.yaml` | Machine-readable stages and gates |
| `state/PROJECT_STATE.yaml` | Exact current role and next action |
| `state/SEALED_TASK_QUEUE.yaml` | C1-approved M1 work |
| `state/SEALED_REMEDIATION_QUEUE.yaml` | C2-approved M2 work |
| `.opencode/agents/ironwake-controller.md` | Optional controlled primary agent |
| `prompts/00_START_OR_RESUME.md` | Safe continuation prompt |
| `prompts/10–14_OPENCODE_*` | Stage prompts |
| `docs/11_OPENCODE_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md` | Role boundaries |
| `docs/09_OPENCODE_CONTINUITY_PROTOCOL.md` | Checkpoint and resume rules |

## Validation

From the pack root, run:

```bash
bash scripts/validate-execution-pack.sh
bash scripts/validate-state.sh
```

These validate the pack structure only. They do not claim that the website, social accounts, providers or deployment are complete.
