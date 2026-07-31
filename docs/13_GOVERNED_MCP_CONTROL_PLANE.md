# Governed MCP Control Plane

## Purpose

OpenCode is the sole IronWake execution harness. This repository uses two MCP control planes under OpenCode:

| Plane | System | Permitted purpose | Does not establish |
|---|---|---|---|
| Governance | Hermes Governed MCP | Approval, task, checkpoint, workspace, and verification operations when the governed tool permits them | A separate controller, role, model identity, or human approval |
| External app | Composio MCP | App discovery, connection management, schema inspection, and approved app-tool execution | Provider approval, account ownership, external success, or a model identity |

## Operating rules

1. Start/resume in OpenCode and verify repository state before any MCP operation.
2. Use Hermes for the matching governance operation. Preserve its decision, checkpoint ID, and any failure in continuity evidence.
3. Use Composio Search to discover capabilities. Before an app mutation, inspect the full schema and verify an active account connection.
4. Preserve human-only approval for publication, account ownership, terms, MFA, KYC, billing, payment, external messaging, and production deployment.
5. A failed MCP operation is a blocked operation. Do not work around it with a different controller or an undocumented direct call.
6. Repository evidence and `state/PROJECT_STATE.yaml` remain the durable release record. MCP records support, but never replace, the repository state.

## Verified bootstrap

- 2026-07-26: Hermes approval catalog and project listing succeeded under governed read access. No Hermes projects were present.
- 2026-07-26: Hermes memory and checkpoint reads were not completed because the exposed tool contract lacks required scope/binding inputs. They remain blocked, not assumed empty or successful.
- 2026-07-26: Hermes project creation was not completed because the exposed call omitted required `projectId`, `name`, `classification`, `workspaceRoot`, and non-empty `owners` inputs. Do not fabricate those values; create the record only after a schema/binding-capable contract is available.
- 2026-07-26: Composio Search is connected without authentication. Session `join` returned schema-validated discovery and fetch tools. No user app account, provider connection, or external mutation was performed.

## Model identity

The configured model binding remains `pending_user_provider_connection` until OpenCode explicitly reports an active model for the recorded role. MCP availability and provider catalog entries are not proof of a model connection.
