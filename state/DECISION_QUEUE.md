# Consolidated Decision Queue

Only material decisions belong here. Routine reversible engineering follows the approved standards.

## Open decisions

| D-001 | P0 | Intended Git-backed IronWake source root and reproducible baseline | W00 and all portfolio truth depend on a stable source root; the nested candidate is materially dirty | Controller root was initialized as the source root; retain nested work separately | Restore a clean nested repository only if it later becomes approved portfolio source evidence | Incorrect source selection could destroy work or create false portfolio/public claims | Human owner | W00-W22 | approved |
| D-002 | P0 | Initial controller baseline commit scope | A Git repository without a commit is not a reproducible baseline | Commit controller files while excluding `ironwakeportifolioprojects/` | Include selected archives only after size/retention review; never stage the nested worktree as an embedded repository | A broad initial commit can capture unwanted source archives or unreviewed files | Human owner | W00-W22 | approved |
| D-003 | P0 | Public Git author identity for controller commits | Git rejected the approved baseline commit without an author name and email | Use the repository-local author identity read at the resume gate | Use a privacy-preserving address controlled by the owner for a future identity change | Commit identity can be visible to collaborators or a future remote host | Human owner | W00-W22 | approved |
| D-004 | P0/P1 | Consolidated launch facts and approvals | Public identity/contact, offer/pricing, proof wording, providers/budget, social ownership/URLs/content, data retention, and legal/payment ownership are all unknown or pending | Decide them once in the G1 decision packet after current research; defer unavailable surfaces and hide all unsupported public information | Keep all relevant items internal/pending; approve a narrower launch | Unapproved facts could create false public claims, provider cost/ownership exposure, or legal/payment risk | Human owner; adult/legal owner where applicable | W01-W22 | open |
| D-005 | Control plane | Governed MCP operating model | Prior documents conflicted over whether Hermes could be used with OpenCode | OpenCode remains the universal execution harness; use Hermes Governed MCP for permitted governance records and Composio MCP for permitted external-app work | Disable either control plane only through a new recorded owner instruction | MCP tool availability does not authorize human-only actions, external mutations, or a model identity | User instruction dated 2026-07-26 | W00-W22 | approved |
| D-006 | P0.9 | Forward-only live authorization/RPC hardening | Live migration 006 is absent; owner policies are inconsistent; anon/authenticated can execute privileged SECURITY DEFINER functions | Apply the sealed minimal forward migration after focused tests, preserving service-role intake and existing data | Leave live exposure in place or redesign auth/provider architecture first | Current state bypasses the validated API boundary and exposes destructive retention logic | Current owner programme plus existing Surekha Nunna G2 auth/RLS approval | W10/W19/W20 | approved |
| D-007 | P1 | Transactional-email provider and zero-cost execution architecture | No provider/worker exists; 36 legacy events are undifferentiated and must never be sent retroactively | Select Resend Free for code only; use additive Supabase outbox/attempt/provider-event state, bounded worker retries, signed callbacks, and Netlify schedule; cancel legacy events safely | Brevo or SMTP; shorter provider idempotency, weaker signed-callback fit, or more operations | ₹0 code path; account/domain/data-processing and future delivery risks stay human-controlled | Current owner programme for architecture/schema/local code; adult/legal owner plus G4/G5 for account/terms/domain/send/deploy | W09/W14/W15/W20/W22 | approved |

D-006 execution result: `VERIFIED_LIVE` on 2026-08-09 at commit `6677623`; Supabase migration `20260809101715` is applied, customer-table counts are unchanged, and the targeted advisor findings are cleared. This does not approve a provider, send, deployment, or MFA bypass.

D-007 architecture result: `VERIFIED C1 SEAL` at commit `27db52d`. Resend is selected only for local/provider-adapter code; the first executable unit is additive state task `IW-P0-NOTIFY-01`. Provider account/terms/domain/secret/send/webhook registration/deployment remain unapproved external actions.

D-007 state implementation result: `VERIFIED_LIVE` on 2026-08-09 at commit `354c9cb`; Supabase migration `20260809104514` adds the provider-neutral notification state machine, safely cancels all 36 legacy events, preserves core counts, and leaves attempt/provider-event tables empty. This does not approve or prove a provider connection, email send, webhook, or deployment. `IW-P0-NOTIFY-02` is the next local-only task.

## Required decision format

| ID | Priority | Missing fact/decision | Why it blocks | Recommended option | Alternatives/tradeoffs | Cost/risk | Required authority | Affected tasks | Status |
|---|---|---|---|---|---|---|---|---|---|

Status values: `open`, `answered_pending_record`, `approved`, `rejected`, `deferred_approved`.

Do not store passwords, tokens, identity documents, payment data, or customer private messages here.
