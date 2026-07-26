# OpenCode M2 — Sealed Remediation

Precondition: `allowed_harness: OPENCODE`, `required_role: M2`, `active_stage: M2`, and `state/SEALED_REMEDIATION_QUEUE.yaml` exists.

Apply only the remediation queue. Fix every blocker and high-severity finding, rerun the named regressions, capture fresh evidence, and do not redesign or add unrelated features. Do not publish or deploy.

Create `reports/M2_COMPLETION_EVIDENCE.md`; update state to `required_role: C3`, `active_stage: C3`, `phase_prompt: prompts/14_OPENCODE_STAGE_C3_FINAL_GATE.md`, and one exact final-gate action.
