# OpenCode Role and Model Ownership Protocol

OpenCode is the only harness. The role labels below define judgment boundaries; they do not require separate applications.

| Role | Allowed stage | Responsibility | Required output |
|---|---|---|---|
| C1 | Architecture | Audit, research, portfolio truth, social plan, pricing, security, architecture, W00–W22 decomposition and sealed queue | `state/SEALED_TASK_QUEUE.yaml` |
| M1 | Implementation | Implement only the sealed queue and produce evidence | `reports/M1_COMPLETION_EVIDENCE.md` |
| C2 | Audit | Independently inspect actual code, UX, security, data flows and evidence | `state/SEALED_REMEDIATION_QUEUE.yaml` |
| M2 | Remediation | Apply only the remediation queue and rerun tests | `reports/M2_COMPLETION_EVIDENCE.md` |
| C3 | Release gate | Re-verify the exact commit and decide release status | `reports/FINAL_RELEASE_GATE.md` |

## State gate

`state/PROJECT_STATE.yaml` must contain `required_role`, `allowed_harness: OPENCODE`, `active_stage`, `phase_prompt` and `next_exact_action`. A role cannot start early. A model switch may happen only after checkpointing and changing the recorded stage.

## Human-only actions

The user or adult/legal owner must perform authentication, MFA, CAPTCHA, identity/KYC, billing, terms acceptance, account ownership, external publication, external messaging, payment activation and production approval. Never request or store passwords, recovery codes, cards or identity documents.
