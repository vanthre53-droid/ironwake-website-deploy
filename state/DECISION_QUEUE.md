# Consolidated Decision Queue

Only material decisions belong here. Routine reversible engineering follows the approved standards.

## Open decisions

| D-001 | P0 | Intended Git-backed IronWake source root and reproducible baseline | W00 and all portfolio truth depend on a stable source root; the nested candidate is materially dirty | Controller root was initialized as the source root; retain nested work separately | Restore a clean nested repository only if it later becomes approved portfolio source evidence | Incorrect source selection could destroy work or create false portfolio/public claims | Human owner | W00-W22 | approved |
| D-002 | P0 | Initial controller baseline commit scope | A Git repository without a commit is not a reproducible baseline | Commit controller files while excluding `ironwakeportifolioprojects/` | Include selected archives only after size/retention review; never stage the nested worktree as an embedded repository | A broad initial commit can capture unwanted source archives or unreviewed files | Human owner | W00-W22 | approved |
| D-003 | P0 | Public Git author identity for controller commits | Git rejected the approved baseline commit without an author name and email | Use the repository-local author identity read at the resume gate | Use a privacy-preserving address controlled by the owner for a future identity change | Commit identity can be visible to collaborators or a future remote host | Human owner | W00-W22 | approved |
| D-004 | P0/P1 | Consolidated launch facts and approvals | Public identity/contact, offer/pricing, proof wording, providers/budget, social ownership/URLs/content, data retention, and legal/payment ownership are all unknown or pending | Decide them once in the G1 decision packet after current research; defer unavailable surfaces and hide all unsupported public information | Keep all relevant items internal/pending; approve a narrower launch | Unapproved facts could create false public claims, provider cost/ownership exposure, or legal/payment risk | Human owner; adult/legal owner where applicable | W01-W22 | open |
| D-005 | Control plane | Governed MCP operating model | Prior documents conflicted over whether Hermes could be used with OpenCode | OpenCode remains the universal execution harness; use Hermes Governed MCP for permitted governance records and Composio MCP for permitted external-app work | Disable either control plane only through a new recorded owner instruction | MCP tool availability does not authorize human-only actions, external mutations, or a model identity | User instruction dated 2026-07-26 | W00-W22 | approved |

## Required decision format

| ID | Priority | Missing fact/decision | Why it blocks | Recommended option | Alternatives/tradeoffs | Cost/risk | Required authority | Affected tasks | Status |
|---|---|---|---|---|---|---|---|---|---|

Status values: `open`, `answered_pending_record`, `approved`, `rejected`, `deferred_approved`.

Do not store passwords, tokens, identity documents, payment data, or customer private messages here.
