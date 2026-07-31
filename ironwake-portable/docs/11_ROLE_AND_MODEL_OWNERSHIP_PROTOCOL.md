# 11 — ROLE, HARNESS AND MODEL OWNERSHIP PROTOCOL

## Roles are not tools
C1, M1, C2, M2, C3 are workflow roles. Any capable CLI executes any role. The role defines
authority and output; the CLI is an implementation detail recorded for traceability.

| Role | Owns | Must not |
|---|---|---|
| C1 | Research, architecture, risk, skill selection, the sealed queue | Write production feature code |
| M1 | Implementing the sealed queue exactly | Redesign, add scope, invent |
| C2 | Independent adversarial audit, remediation queue | Rebuild, or audit its own build |
| M2 | Fixing only the remediation queue | Touch anything outside the queue |
| C3 | Final verification of the exact commit | Deploy |

## Harness rules
1. One harness holds the stage at a time. Never run two CLIs concurrently on this repo.
2. Switch only at a committed safe boundary.
3. Record `harness:` at every checkpoint.
4. Audit roles SHOULD use a different CLI than the build they audit — cross-tool audit
   cannot inherit the builder's blind spots. Same-context self-review is not independence.

## Model rules
1. Record `model:` only when the CLI explicitly reports it.
2. Never infer model identity from an MCP connection, a config file, or a model catalog.
3. Never switch model inside an atomic task. Boundaries only.
4. Prefer strongest reasoning for C1/C2/C3, fastest capable coder for M1/M2 — a preference,
   not a law.

## MCP rules
Hermes Governed MCP = governance operations. Composio MCP = external-app operations.
Neither is a controller, a model, or an authority. An MCP record is linked evidence; the
repository state remains the release source of truth. A tool error is never a reason to
bypass a gate.
