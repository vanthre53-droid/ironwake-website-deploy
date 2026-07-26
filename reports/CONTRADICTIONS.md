# Contradictions Register

| ID | Sources | Conflict | Resolution | Status |
|---|---|---|---|---|
| C-001 | `state/PROJECT_STATE.yaml`, `CURRENT_STATUS_EXECUTION_MAP.md`, controller-root Git readback | Controller instructions require a Git-backed IronWake root; the controller directory was not a Git worktree. | Human authorized a new controller-root Git repository. Initial commit scope remains approval-gated; nested source remains separate. | Partially resolved |
| C-002 | Controller state/inputs versus nested `HANDOFF.md`, `EXECUTION_STATUS.md`, and `ENTERPRISE_PORTFOLIO_REAUDIT.md` | Controller state says production has not begun, while nested historical documents assert deployed portfolio apps and provider-connected workflows. | Treat nested documents as unverified historical inputs. Do not publish claims, provider success, live URLs, metrics, or client status from them. | Open |
| C-003 | `docs/11_OPENCODE_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md` versus `state/SCOPE_COVERAGE.md` | Scope coverage assigns several workstreams to Codex/MiMo although the controlling protocol names OpenCode roles only. | Controller protocol takes precedence. Update all rows during C1 only after repository integrity is resolved. | Open |
| C-004 | Nested `AGENTS.md` versus filesystem readback | Nested instructions require the Obsidian `State.md` and `Project Map.md`; both expected paths are absent. | Do not rely on the nested handoff's completion claims. Recover a coherent source baseline before any project-level audit. | Open |
