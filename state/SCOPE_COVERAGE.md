# W00-W22 Scope Coverage

## 2026-08-09 real-product overlay

The historical rows below are resume material, not current completion. Current
authority is `reports/REAL_CAPABILITY_LEDGER.md`. W10/W19's live
authorization/RPC failure is repaired and verified at `6677623`; W15
email/notifications, W16 follow-up, W14 owner MFA/complete operations, and W22
reproducible deployment remain missing, failed live, or implemented-only. No row
is release-green. C1 now owns current provider research and the next sealed local
notification task.

Current owner: OpenCode M1. G1 architecture is approved; C2 and C3 must independently audit every row. No row is a production completion claim.

| ID | Workstream | Status | Required executor/owner | Evidence | Blocker/next action |
|---|---|---|---|---|---|
| W00 | Source and execution control | verified_in_progress | OpenCode C1 + human owner | `reports/STATE_DRIFT.md`, `reports/SOURCE_INVENTORY.md`, `reports/SKILL_INVENTORY.md`, `reports/CONTRADICTIONS.md`, `reports/SECRET_EXPOSURE.md`, `reports/STITCH_AUDIT.md`, `reports/CLAIM_QUARANTINE.md`, `reports/ASSET_LEDGER.md`, `reports/SCREEN_ROUTE_MATRIX.md`, continuity files | Preserve source control and record every atomic checkpoint |
| W01 | Portfolio truth and proof | verified_complete_demo_only | OpenCode C1 + human owner | `reports/PORTFOLIO_PROOF_GATE.md`, `reports/CLAIM_LEDGER.md`, `reports/evidence/PORTFOLIO_PROVIDER_PROOF.md` | Demonstration-only classification approved; no client/provider claims |
| W02 | Agency/founder brand architecture | verified_internal_pending_public_gate | OpenCode C1/M1 + human owner | `reports/M1_W02_BRAND_ARCHITECTURE.md`, `reports/SOCIAL_PROFILE_COPY_AND_ASSETS.md`, `reports/ASSET_LEDGER.md` | Internal identity verified; G3/GS1 and social ownership still required |
| W03 | Platform eligibility/ownership/security | verified_human_attestation | OpenCode M1 + human owner | `reports/M1_W03_INSTAGRAM_URL_READBACK.md`, `reports/SOCIAL_PLATFORM_MATRIX.md`, `inputs/SOCIAL_SETUP_REAL_DATA.md` | URL/OAuth readback plus human owner/recovery/MFA/admin/logged-out attestation; profile approval remains W04 |
| W04 | Social profile setup | deferred_user_instruction | Human action; OpenCode verification | `reports/M1_W04_INSTAGRAM_PROFILE_EDIT_PACKET.md`, `reports/SOCIAL_VERIFIED_URL_REGISTRY.md` | Profile packet is approved but deferred; no verified public CTA/link is available |
| W05 | Social foundation content | verified_internal_draft_pending_gs1 | OpenCode C1/M1 + human approver | `content/social-foundation-drafts.md`, `reports/SOCIAL_FOUNDATION_CONTENT_REGISTER.md`, `reports/ASSET_LEDGER.md` | Nine internal drafts ready; approve proof labels/assets and publication later |
| W06 | Social operations | verified_internal_draft_blocked_dependencies | OpenCode C1 + human operations owner | `reports/SOCIAL_OPERATIONS_RUNBOOK.md`, `reports/SOCIAL_PLATFORM_MATRIX.md`, `reports/SOCIAL_FOUNDATION_CONTENT_REGISTER.md` | Runbook prepared; approve cadence/tools and clear W03/W04/GS1 before connection |
| W07 | Social acquisition/CRM attribution | queued_pending_g2 | OpenCode M1 + human owner | `reports/C1_ARCHITECTURE_AND_CONTROLS.md`, `reports/evidence/SOCIAL_CONTACT_AND_CRM_ATTRIBUTION.md` | Implement after verified URLs, GS1, G1, and G2 |
| W08 | Offers/pricing/choice architecture | blocked_g1_pricing | OpenCode C1 + human/legal owner | `reports/PRICING_LOCALIZATION_RESEARCH.md`, `inputs/APPROVALS.md` | Approve offer states, market logic, price ledger, taxes, refunds, and provider costs |
| W09 | Contact/business infrastructure | pending_target_mailbox_oauth | Human/provider + OpenCode verification | `inputs/REAL_DATA_INTAKE.md`, `reports/W09_CONTACT_INFRASTRUCTURE_READINESS.md` | Complete target Gmail OAuth, then prove monitored send/receive without exposing credentials |
| W10 | Competitor/UX/search research | verified_complete_current_refresh | OpenCode C1 | `reports/COMPETITOR_RESEARCH.md`, `reports/UX_CONVERSION_RESEARCH.md`, `reports/PRICING_LOCALIZATION_RESEARCH.md`, `reports/TECHNICAL_DECISION_RECORD.md`, `reports/COMPOSIO_RESEARCH_BLOCK.md` | Refresh only if scope/source staleness requires it |
| W11 | Website design system | sealed_pending_gs1_g3 | OpenCode M1; C2 audit | `reports/C1_VISUAL_SOURCE_RECONCILIATION.md`, `reports/SCREEN_ROUTE_MATRIX.md`, `reports/STITCH_AUDIT.md`, `reports/C1_ARCHITECTURE_AND_CONTROLS.md` | Rebuild only in `app/` from the reconciled Stitch sources after GS1/G3; retire `website/` after parity evidence |
| W12 | Public conversion system | queued_pending_g1_g2 | OpenCode M1; C2 audit | `reports/UX_CONVERSION_RESEARCH.md`, `reports/C1_ARCHITECTURE_AND_CONTROLS.md` | Implement server-validated audit request after G1/G2 |
| W13 | Data/auth/private CRM | queued_pending_g2 | OpenCode M1; C2 audit | `reports/C1_ARCHITECTURE_AND_CONTROLS.md`, `reports/SECURITY_PRIVACY_MODEL.md` | Obtain G2 migration/auth/retention approval, then test negative paths |
| W14 | Notifications/providers | deferred_provider_approval | OpenCode M1 + provider/human; C2 audit | `reports/PROVIDER_MATRIX.md`, `reports/evidence/P4_PROVIDER_PROOF.md` | Keep test doubles; enable each provider only after G4 |
| W15 | Sales execution system | draft_pending_g1 | OpenCode C1/M1 + human operations | `reports/PHASE_1_DECISION_PACKET.md`, `docs/10_PRIORITY_DECISION_AND_DATA_PROTOCOL.md` | Approve qualification/follow-up rules; keep outbound actions human-controlled |
| W16 | Proposals/contracts/invoices/payments | deferred_legal_owner | OpenCode C1/M1 + adult/legal owner | `reports/PRICING_LOCALIZATION_RESEARCH.md`, `inputs/APPROVALS.md` | Decide legal/payment ownership or keep payments excluded |
| W17 | Revenue Command/sales intelligence | queued_pending_real_data | OpenCode M1; C2 audit | `reports/C1_ARCHITECTURE_AND_CONTROLS.md`, `reports/evidence/P4_CRM_AUTHORIZATION.md` | Build only from real records; label estimates and forecasts |
| W18 | Client delivery/retainers | draft_pending_scope_and_legal | OpenCode C1/M1 + human operations/legal owner | `reports/W00_W22_C1_DECOMPOSITION.md`, `reports/evidence/P6_HANDOVER.md` | Approve scope, access, QA, handover, support, renewal, and offboarding |
| W19 | SEO/content operations | queued_pending_content | OpenCode M1; C2 audit | `reports/SEO_ACCESSIBILITY_PLAN.md`, `reports/CLAIM_QUARANTINE.md` | Publish only original approved content tied to ledgers |
| W20 | Security/privacy/resilience | specified_pending_implementation | OpenCode C1/C2 + M1 | `reports/SECURITY_PRIVACY_MODEL.md`, `docs/05_SECURITY_PRIVACY_COMPLIANCE.md` | Implement and evidence controls after G1/G2/provider decisions |
| W21 | Accessibility/performance/QA | queued_release_verification | OpenCode M1; C3 verification | `reports/SEO_ACCESSIBILITY_PLAN.md`, `docs/07_TEST_RELEASE_AND_HANDOFF_GATES.md` | Test all required widths, states, browsers, failures, and privacy boundaries |
| W22 | Preview/production/monitoring/handover | blocked_production_approval | OpenCode C3 + human owner | `reports/evidence/P5_ROLLBACK.md`, `reports/evidence/P6_DEPLOYMENT.md`, `reports/evidence/P6_HANDOVER.md` | Obtain G5/G6 approval; no deployment or real external test yet |
