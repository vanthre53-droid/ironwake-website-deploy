# C1 W00-W22 Decomposition

- Prepared: 2026-07-27
- Role: OpenCode C1 architecture and task-sealing draft.
- Status vocabulary is intentionally truthful: `verified`, `in_progress`, `draft_pending_g1`, `blocked_*`, `deferred_approved`, and `queued_pending_gate` are not completion claims.

| ID | Status | Gate/dependency | C1 evidence | Owner | Exact next action |
|---|---|---|---|---|---|
| W00 | in_progress | None; continuity on every task | Existing P0 reports and state files | C1 + human owner | Preserve Git/evidence and checkpoint each atomic task |
| W01 | verified_complete_demo_only | G1.5 | Portfolio snapshot audit, claim quarantine, asset ledger | C1 + human owner | Demonstration-only capability proof approved; no provider/client claim required |
| W02 | draft_pending_g1 | G1 | Decision packet and approved voice/role rules | C1 + human owner | Approve agency/founder identity and public language |
| W03 | blocked_human_ownership | G1/GS1 | Social platform matrix | Human owner | Verify eligibility, owners, recovery, MFA, admins, disconnect |
| W04 | blocked_human_profile_verification | GS1 | Profile copy/assets and URL registry | Human owner + C1 | Perform one-platform-at-a-time human setup and logged-out readback |
| W05 | draft_pending_gs1 | G1.5/GS1 | Nine-asset content register | C1/M1 + human approver | Approve proof labels/assets, then prepare platform-native exports |
| W06 | draft_pending_gs1 | GS1 | Platform matrix and content register | C1 + human ops owner | Approve cadence, reply, moderation, escalation, and disconnect runbooks |
| W07 | queued_pending_g2 | GS1/G2 | Social URL registry and architecture contract | M1 + human owner | Implement source/content/consent/next-action attribution and E2E test |
| W08 | blocked_g1_pricing | G1/A4 where applicable | Pricing localization research | C1 + human/legal owner | Approve offer states, price ledger, taxes, refunds, and provider-cost treatment |
| W09 | blocked_real_contact | G1 | Real-data intake and social URL registry | Human owner | Supply monitored mailbox, domain, CTA, hours, and privacy contact |
| W10 | blocked_current_research_refresh | G1 | Candidate P1 reports and Composio block report | C1 | Resolve Composio limitation, rerun searches/fetches, update dated citations |
| W11 | queued_pending_g1 | G1 plus G1.5/GS1 | Route matrix, Stitch audit, architecture plan | M1/C2 | Implement approved reusable responsive design system and route states |
| W12 | queued_pending_g1 | G1 plus G2 | UX research and conversion spine | M1/C2 | Implement validated audit request and truthful acknowledgement state |
| W13 | queued_pending_g2 | G1/G2 | CRM architecture and security model | M1/C2 | Implement schema, RLS/auth, audit, retention, export, deletion tests |
| W14 | deferred_provider_approval | G4 | Provider matrix and adapter contract | M1 + provider owner | Keep test doubles; enable providers only with named approval/proof |
| W15 | draft_pending_g1 | G1 | UX, sales, and offer recommendations | C1/M1 + human ops | Approve qualification and follow-up discipline; no unsolicited automation |
| W16 | deferred_legal_owner | G1/A4/G4 | Pricing research and security boundaries | Adult/legal owner | Decide contracts, invoices, taxes, refunds, KYC, payments; otherwise exclude |
| W17 | queued_pending_real_data | G1/G2 | CRM/revenue field requirements | M1 + human owner | Build truthful pipeline and attribution only from real records |
| W18 | draft_pending_scope_and_legal | G1/A4 | Delivery workflow source systems | C1/M1 + human ops | Approve onboarding, scope, access, QA, handover, support, offboarding |
| W19 | queued_pending_content | G1/G3 | SEO/accessibility plan and claim ledger | M1/C2 | Publish only original approved content with owner/review dates |
| W20 | specified_pending_implementation | G1/G2 | Security/privacy model | C1/M1/C2 | Implement controls, scans, backup/restore, deletion, incident/rollback evidence |
| W21 | queued_release_verification | G3/G4/G5 | SEO/accessibility plan and release targets | C3 | Run responsive, accessibility, performance, browser, failure, and privacy checks |
| W22 | blocked_production_approval | G5/G6 | Release and handover requirements | C3 + human owner | Obtain exact-commit production approval, deploy, observe, test, delete/anonymize, hand over |

## Gate boundary

This decomposition is a C1 draft. No row authorizes public publication, account changes, provider connection, external messaging, payment, KYC, production deployment, or M1 implementation before its named gate and human approval.
