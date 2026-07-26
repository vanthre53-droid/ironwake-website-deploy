# Consolidated Decision Queue

Only material decisions belong here. Routine reversible engineering follows the approved standards.

## Open decisions

| D-001 | P0 | Intended Git-backed IronWake source root and reproducible baseline | W00 and all portfolio truth depend on a stable source root; the nested candidate is materially dirty | Controller root was initialized as the source root; retain nested work separately | Restore a clean nested repository only if it later becomes approved portfolio source evidence | Incorrect source selection could destroy work or create false portfolio/public claims | Human owner | W00-W22 | answered_pending_record |
| D-002 | P0 | Initial controller baseline commit scope | A Git repository without a commit is not a reproducible baseline | Commit controller files while excluding `ironwakeportifolioprojects/` | Include selected archives only after size/retention review; never stage the nested worktree as an embedded repository | A broad initial commit can capture unwanted source archives or unreviewed files | Human owner | W00-W22 | answered_pending_record |
| D-003 | P0 | Public Git author identity for controller commits | Git rejected the approved baseline commit without an author name and email | Provide the name and email intended to appear in commit metadata; configure locally only | Use a privacy-preserving address controlled by the owner | Commit identity can be visible to collaborators or a future remote host | Human owner | W00-W22 | open |

## Required decision format

| ID | Priority | Missing fact/decision | Why it blocks | Recommended option | Alternatives/tradeoffs | Cost/risk | Required authority | Affected tasks | Status |
|---|---|---|---|---|---|---|---|---|---|

Status values: `open`, `answered_pending_record`, `approved`, `rejected`, `deferred_approved`.

Do not store passwords, tokens, identity documents, payment data, or customer private messages here.
