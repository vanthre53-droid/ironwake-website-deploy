# Test Orchestration Report

Generated: 2026-08-19T18:28:12.507Z • Duration: 435.1s

**Total:** 162 files • 546 pass • 5 fail • 0 skipped • 0 env-failures

| Tier | Files | Pass | Fail | Env | Duration |
|------|-------|------|------|-----|----------|
| UNIT | 85 | 377 | 3 | 0 | 153.5s |
| COMPONENT | 68 | 134 | 1 | 0 | 4.1s |
| INTEGRATION | 6 | 33 | 0 | 0 | 6.0s |
| ENVIRONMENT | 3 | 2 | 1 | 0 | 17.0s |

## UNIT (85 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/error.test.js` | 0 | 1 | 0 | 0 | 294ms |
| `app/layout-seo.test.mjs` | 0 | 1 | 0 | 0 | 281ms |
| `instrumentation.test.js` | 0 | 1 | 0 | 0 | 278ms |
| `lib/auth-redirect-allowlist.test.mjs` | 0 | 4 | 0 | 0 | 324ms |
| `lib/notifications/config.test.mjs` | 0 | 2 | 0 | 0 | 325ms |
| `lib/notifications/supabase-store.test.mjs` | 0 | 2 | 0 | 0 | 308ms |
| `lib/notifications/whatsapp-adapter.test.mjs` | 0 | 13 | 0 | 0 | 415ms |
| `lib/pricing.test.mjs` | 0 | 2 | 0 | 0 | 286ms |
| `lib/request-rate-limit.test.mjs` | 0 | 6 | 0 | 0 | 340ms |
| `lib/retell/golden.test.mjs` | 0 | 14 | 0 | 0 | 445ms |
| `lib/whatsapp/business-profile.test.js` | 0 | 26 | 0 | 0 | 400ms |
| `lib/whatsapp/meta-client.test.js` | 0 | 12 | 0 | 0 | 413ms |
| `lib/whatsapp/parse.test.js` | 0 | 10 | 0 | 0 | 345ms |
| `lib/whatsapp/templates.test.js` | 0 | 10 | 0 | 0 | 334ms |
| `scripts/contrast-audit.test.mjs` | 0 | 1 | 0 | 0 | 454ms |
| `scripts/csp-audit.test.mjs` | 0 | 1 | 0 | 0 | 600ms |
| `scripts/deploy-verified-fixes.test.mjs` | 0 | 3 | 0 | 0 | 263ms |
| `scripts/favicon-audit.test.mjs` | 0 | 1 | 0 | 0 | 403ms |
| `scripts/google-oauth-button-audit.test.mjs` | 0 | 1 | 0 | 0 | 402ms |
| `scripts/lighthouse-audit.test.mjs` | 0 | 1 | 0 | 0 | 146624ms |
| `app/global-error.test.js` | 0 | 1 | 0 | 0 | 311ms |
| `app/loading.test.js` | 0 | 2 | 0 | 0 | 324ms |
| `lib/audit-validation.test.mjs` | 0 | 8 | 0 | 0 | 3108ms |
| `lib/whatsapp/oauth.test.js` | 0 | 36 | 0 | 0 | 450ms |
| `lib/whatsapp/signature.test.js` | 0 | 12 | 0 | 0 | 331ms |
| `next.config.test.mjs` | 0 | 1 | 0 | 0 | 245ms |
| `scripts/a11y-audit.test.mjs` | 0 | 7 | 0 | 0 | 10365ms |
| `scripts/search-console-submit.test.mjs` | 0 | 6 | 0 | 0 | 800ms |
| `scripts/secret-scan.test.mjs` | 0 | 1 | 0 | 0 | 46412ms |
| `app/globals.css.test.js` | 0 | 2 | 0 | 0 | 318ms |
| `app/not-found.test.js` | 0 | 1 | 0 | 0 | 286ms |
| `lib/ai-chat.test.mjs` | 0 | 20 | 0 | 0 | 371ms |
| `lib/meta-webhook-verify.test.mjs` | 0 | 9 | 0 | 0 | 310ms |
| `lib/notifications/retell-webhook.test.mjs` | 0 | 10 | 0 | 0 | 321ms |
| `lib/notifications/templates.test.mjs` | 0 | 3 | 0 | 0 | 324ms |
| `lib/notifications/worker.test.mjs` | 0 | 9 | 0 | 0 | 986ms |
| `lib/sentry-dsn.test.mjs` | 0 | 3 | 0 | 0 | 290ms |
| `lib/supabase-public-key.test.mjs` | 0 | 3 | 0 | 0 | 306ms |
| `lib/whatsapp/crm.test.js` | 0 | 3 | 0 | 0 | 5349ms |
| `scripts/perf-audit.test.mjs` | 0 | 6 | 0 | 0 | 22076ms |
| `tests/portfolio-links.test.mjs` | 0 | 3 | 0 | 0 | 11445ms |
| `app/icon.test.js` | 0 | 3 | 0 | 0 | 324ms |
| `app/seo.test.js` | 0 | 1 | 0 | 0 | 296ms |
| `lib/ai-triage.test.mjs` | 0 | 4 | 0 | 0 | 350ms |
| `lib/indexnow.test.mjs` | 0 | 6 | 0 | 0 | 304ms |
| `lib/notifications/resend-adapter.test.mjs` | 0 | 4 | 0 | 0 | 834ms |
| `lib/owner-auth.test.mjs` | 0 | 3 | 0 | 0 | 286ms |
| `lib/release-config.test.mjs` | 0 | 3 | 0 | 0 | 323ms |
| `lib/retell-server.test.mjs` | 0 | 15 | 0 | 0 | 351ms |
| `lib/site-url-fallback.test.mjs` | 0 | 2 | 0 | 0 | 2540ms |
| `scripts/deploy-ledger-audit.test.mjs` | 0 | 1 | 0 | 0 | 682ms |
| `scripts/glass-primitive-audit.test.mjs` | 0 | 1 | 0 | 0 | 1103ms |
| `scripts/mobile-overlap-audit.test.mjs` | 0 | 1 | 0 | 0 | 2275ms |
| `scripts/portfolio-audit.test.mjs` | 0 | 1 | 0 | 0 | 539ms |
| `scripts/release-gate.test.mjs` | 0 | 3 | 0 | 0 | 297ms |
| `scripts/responsive-viewport-audit.test.mjs` | 0 | 7 | 0 | 0 | 294ms |
| `scripts/retell-prompt-audit.test.mjs` | 0 | 1 | 0 | 0 | 637ms |
| `scripts/rls-policy-audit.test.mjs` | 0 | 1 | 0 | 0 | 507ms |
| `scripts/routes-acceptance-audit.test.mjs` | 1 | 7 | 1 | 0 | 4336ms |
| `scripts/seo-content-audit.test.mjs` | 1 | 1 | 1 | 0 | 2386ms |
| `scripts/seo-tech-audit.test.mjs` | 1 | 0 | 1 | 0 | 1642ms |
| `scripts/sitemap-audit.test.mjs` | 0 | 1 | 0 | 0 | 2099ms |
| `scripts/ui-visual-audit.test.mjs` | 0 | 1 | 0 | 0 | 543ms |
| `scripts/verify-release-config.test.mjs` | 0 | 1 | 0 | 0 | 326ms |
| `sentry.server.config.test.js` | 0 | 1 | 0 | 0 | 245ms |
| `supabase/migrations/003_owner_crm_core.test.mjs` | 0 | 1 | 0 | 0 | 276ms |
| `supabase/migrations/004_fix_task_due_date.test.mjs` | 0 | 1 | 0 | 0 | 239ms |
| `supabase/migrations/005_grant_owner_crm_access.test.mjs` | 0 | 1 | 0 | 0 | 267ms |
| `supabase/migrations/006_restrict_owner_to_single_email.test.mjs` | 0 | 1 | 0 | 0 | 281ms |
| `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.test.mjs` | 0 | 4 | 0 | 0 | 321ms |
| `supabase/migrations/20260809103635_durable_notification_state_machine.test.mjs` | 0 | 10 | 0 | 0 | 417ms |
| `supabase/migrations/20260809124000_durable_ai_triage_attempts.test.mjs` | 0 | 1 | 0 | 0 | 343ms |
| `supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs` | 0 | 1 | 0 | 0 | 359ms |
| `supabase/migrations/20260809133000_follow_up_task_operations.test.mjs` | 0 | 1 | 0 | 0 | 515ms |
| `supabase/migrations/20260809140000_owner_notes_and_activity_timeline.test.mjs` | 0 | 1 | 0 | 0 | 377ms |
| `supabase/migrations/20260809143000_owner_lead_stage_updates.test.mjs` | 0 | 1 | 0 | 0 | 330ms |
| `supabase/migrations/20260809150000_durable_request_rate_limit.test.mjs` | 0 | 1 | 0 | 0 | 322ms |
| `supabase/migrations/20260809153000_owner_consent_withdrawal.test.mjs` | 0 | 1 | 0 | 0 | 343ms |
| `supabase/migrations/20260809170000_targeted_notification_claim.test.mjs` | 0 | 1 | 0 | 0 | 344ms |
| `supabase/migrations/20260809171000_fix_targeted_notification_claim_ambiguity.test.mjs` | 0 | 1 | 0 | 0 | 268ms |
| `supabase/migrations/20260810100000_require_owner_aal2.test.mjs` | 0 | 2 | 0 | 0 | 256ms |
| `supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs` | 0 | 5 | 0 | 0 | 299ms |
| `supabase/migrations/20260812100000_harden_customer_isolation.test.mjs` | 0 | 7 | 0 | 0 | 327ms |
| `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.test.mjs` | 0 | 7 | 0 | 0 | 299ms |
| `tests/audit-validation.test.mjs` | 0 | 2 | 0 | 0 | 2794ms |

### Logic failures (blocking)

- `scripts/routes-acceptance-audit.test.mjs` — every page has a real H1 (no orphan H1-less pages in header): |-
- `scripts/seo-content-audit.test.mjs` — scripts/seo-content-audit.mjs reports zero failures on current tree: |-
- `scripts/seo-tech-audit.test.mjs` — seo tech audit gate: |-

## COMPONENT (68 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/.well-known/indexnow-key.txt/route.test.mjs` | 0 | 2 | 0 | 0 | 270ms |
| `app/audit/submit-audit.test.mjs` | 0 | 8 | 0 | 0 | 221ms |
| `app/components/AssistantWidget.test.js` | 0 | 5 | 0 | 0 | 241ms |
| `app/components/MotionReveal.test.js` | 0 | 1 | 0 | 0 | 224ms |
| `app/components/VoiceSessionLauncher.test.js` | 0 | 4 | 0 | 0 | 234ms |
| `app/components/ui/GoogleIcon.test.mjs` | 0 | 3 | 0 | 0 | 240ms |
| `app/industries/page.test.js` | 0 | 1 | 0 | 0 | 223ms |
| `app/manifest.webmanifest/route.test.mjs` | 0 | 3 | 0 | 0 | 305ms |
| `app/page.test.js` | 0 | 2 | 0 | 0 | 234ms |
| `app/scope/page.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/systems/booking-control/page.test.js` | 0 | 1 | 0 | 0 | 246ms |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.test.js` | 0 | 1 | 0 | 0 | 263ms |
| `app/work/aura-archives/AuraArchivesCaseStudy.test.js` | 0 | 1 | 0 | 0 | 249ms |
| `app/work/dentacare-pro/DentaCareCaseStudy.test.js` | 0 | 1 | 0 | 0 | 219ms |
| `app/work/luxe-studio/LuxeStudioCaseStudy.test.js` | 0 | 1 | 0 | 0 | 242ms |
| `app/work/rapidpulse/page.test.js` | 0 | 1 | 0 | 0 | 247ms |
| `app/work/voltix/page.test.js` | 0 | 1 | 0 | 0 | 215ms |
| `app/about/page.test.js` | 0 | 1 | 0 | 0 | 201ms |
| `app/apple-icon.svg/route.test.mjs` | 0 | 3 | 0 | 0 | 212ms |
| `app/book/BookingPreview.test.js` | 0 | 1 | 0 | 0 | 216ms |
| `app/components/CustomerAssistantLauncher.test.js` | 0 | 4 | 0 | 0 | 245ms |
| `app/components/SiteFooter.test.js` | 0 | 1 | 0 | 0 | 226ms |
| `app/components/ui/Button.test.mjs` | 0 | 8 | 0 | 0 | 257ms |
| `app/industries/dental/page.test.js` | 1 | 1 | 1 | 0 | 250ms |
| `app/layout.test.js` | 0 | 1 | 0 | 0 | 219ms |
| `app/owner/page.test.js` | 0 | 1 | 0 | 0 | 230ms |
| `app/pricing/PricingPage.test.mjs` | 0 | 2 | 0 | 0 | 223ms |
| `app/systems/ai-receptionist/AiReceptionistSystem.test.js` | 0 | 2 | 0 | 0 | 235ms |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.test.js` | 0 | 1 | 0 | 0 | 251ms |
| `app/systems/trust-lead-capture/page.test.js` | 0 | 1 | 0 | 0 | 242ms |
| `app/work/aura-archives/page.test.js` | 0 | 1 | 0 | 0 | 239ms |
| `app/work/dentacare-pro/page.test.js` | 0 | 1 | 0 | 0 | 211ms |
| `app/work/luxe-studio/page.test.js` | 0 | 1 | 0 | 0 | 241ms |
| `app/work/retech/RetechCaseStudy.test.js` | 0 | 1 | 0 | 0 | 250ms |
| `app/admin/AdminDashboard.test.js` | 0 | 5 | 0 | 0 | 227ms |
| `app/audit/page.test.js` | 0 | 1 | 0 | 0 | 216ms |
| `app/chat/page.test.mjs` | 0 | 1 | 0 | 0 | 221ms |
| `app/components/InteractiveLeadJourney.test.js` | 0 | 1 | 0 | 0 | 224ms |
| `app/components/SiteHeader.test.js` | 0 | 1 | 0 | 0 | 229ms |
| `app/components/ui/Field.test.mjs` | 0 | 9 | 0 | 0 | 254ms |
| `app/industries/home-services/page.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/login/page.test.mjs` | 0 | 2 | 0 | 0 | 239ms |
| `app/owner/reset-password/page.test.js` | 0 | 4 | 0 | 0 | 252ms |
| `app/process/page.test.js` | 0 | 1 | 0 | 0 | 241ms |
| `app/systems/booking-control/BookingControlSystem.test.js` | 0 | 1 | 0 | 0 | 242ms |
| `app/systems/page.test.js` | 0 | 1 | 0 | 0 | 231ms |
| `app/work/atelier/page.test.js` | 0 | 1 | 0 | 0 | 227ms |
| `app/work/bramble-cafe/page.test.js` | 0 | 1 | 0 | 0 | 236ms |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.test.js` | 0 | 1 | 0 | 0 | 223ms |
| `app/work/rapidpulse/RapidPulseCaseStudy.test.js` | 0 | 2 | 0 | 0 | 254ms |
| `app/work/voltix/VoltixCaseStudy.test.js` | 0 | 1 | 0 | 0 | 247ms |
| `app/admin/page.test.js` | 0 | 1 | 0 | 0 | 205ms |
| `app/audit/AuditForm.test.js` | 0 | 2 | 0 | 0 | 211ms |
| `app/book/page.test.js` | 0 | 1 | 0 | 0 | 217ms |
| `app/components/DashboardDemo.test.js` | 0 | 1 | 0 | 0 | 226ms |
| `app/components/PricingReference.test.js` | 0 | 1 | 0 | 0 | 223ms |
| `app/components/WorkflowDemo.test.js` | 0 | 1 | 0 | 0 | 215ms |
| `app/industries/dental-clinics/page.test.js` | 0 | 1 | 0 | 0 | 257ms |
| `app/industries/salons-spas/page.test.js` | 0 | 1 | 0 | 0 | 254ms |
| `app/owner/OwnerDashboard.test.js` | 0 | 2 | 0 | 0 | 225ms |
| `app/pricing/PricingPage.test.js` | 0 | 13 | 0 | 0 | 258ms |
| `app/systems/ai-receptionist/page.test.js` | 0 | 2 | 0 | 0 | 244ms |
| `app/systems/missed-lead-recovery/page.test.js` | 0 | 1 | 0 | 0 | 245ms |
| `app/work/atelier/AtelierCaseStudy.test.js` | 0 | 1 | 0 | 0 | 264ms |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/work/harbour-estates/page.test.js` | 0 | 1 | 0 | 0 | 209ms |
| `app/work/page.test.js` | 0 | 1 | 0 | 0 | 220ms |
| `app/work/retech/page.test.js` | 0 | 1 | 0 | 0 | 250ms |

### Logic failures (blocking)

- `app/industries/dental/page.test.js` — dental industry landing page wires SEO metadata, demo proof, and a real ROI calculator: |-

## INTEGRATION (6 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/api/audit/route.test.js` | 0 | 5 | 0 | 0 | 5993ms |
| `app/api/chat/route.test.js` | 0 | 11 | 0 | 0 | 2937ms |
| `app/api/owner/export/route.test.js` | 0 | 2 | 0 | 0 | 2927ms |
| `app/api/owner/whoami/route.test.js` | 0 | 3 | 0 | 0 | 3064ms |
| `app/api/owner/notification-readiness/route.test.js` | 0 | 2 | 0 | 0 | 2927ms |
| `app/api/webhooks/resend/route.test.js` | 0 | 10 | 0 | 0 | 2361ms |

## ENVIRONMENT (3 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `scripts/build-audit.test.mjs` | 0 | 1 | 0 | 0 | 16957ms |
| `scripts/metadata-audit.test.mjs` | 1 | 0 | 1 | 0 | 1341ms |
| `scripts/worker-secrets-audit.test.mjs` | 0 | 1 | 0 | 0 | 14515ms |

### Logic failures (blocking)

- `scripts/metadata-audit.test.mjs` — metadata audit reports zero errors: |-
