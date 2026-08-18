# Test Orchestration Report

Generated: 2026-08-18T11:59:45.012Z • Duration: 5.3s

**Total:** 143 files • 0 pass • 0 fail • 0 skipped • 0 env-failures

| Tier | Files | Pass | Fail | Env | Duration |
|------|-------|------|------|-----|----------|
| UNIT | 76 | 0 | 0 | 0 | 1.7s |
| COMPONENT | 58 | 0 | 0 | 0 | 1.4s |
| INTEGRATION | 6 | 0 | 0 | 0 | 0.2s |
| ENVIRONMENT | 3 | 0 | 0 | 0 | 0.1s |

## UNIT (76 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/error.test.js` | 0 | 0 | 0 | 0 | 117ms |
| `app/not-found.test.js` | 0 | 0 | 0 | 0 | 99ms |
| `instrumentation.test.js` | 0 | 0 | 0 | 0 | 76ms |
| `lib/auth-redirect-allowlist.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `lib/notifications/resend-adapter.test.mjs` | 0 | 0 | 0 | 0 | 86ms |
| `lib/notifications/whatsapp-adapter.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `lib/release-config.test.mjs` | 0 | 0 | 0 | 0 | 85ms |
| `lib/sentry-dsn.test.mjs` | 0 | 0 | 0 | 0 | 82ms |
| `scripts/a11y-audit.test.mjs` | 0 | 0 | 0 | 0 | 89ms |
| `scripts/deploy-verified-fixes.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `scripts/mobile-overlap-audit.test.mjs` | 0 | 0 | 0 | 0 | 93ms |
| `scripts/rls-policy-audit.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `scripts/seo-tech-audit.test.mjs` | 0 | 0 | 0 | 0 | 99ms |
| `sentry.server.config.test.js` | 0 | 0 | 0 | 0 | 93ms |
| `supabase/migrations/006_restrict_owner_to_single_email.test.mjs` | 0 | 0 | 0 | 0 | 88ms |
| `supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `supabase/migrations/20260809150000_durable_request_rate_limit.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `supabase/migrations/20260810100000_require_owner_aal2.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `tests/audit-validation.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `app/global-error.test.js` | 0 | 0 | 0 | 0 | 92ms |
| `app/layout.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/page.test.js` | 0 | 0 | 0 | 0 | 95ms |
| `lib/audit-validation.test.mjs` | 0 | 0 | 0 | 0 | 85ms |
| `lib/notifications/config.test.mjs` | 0 | 0 | 0 | 0 | 94ms |
| `lib/notifications/templates.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `lib/pricing.test.mjs` | 0 | 0 | 0 | 0 | 96ms |
| `lib/site-url-fallback.test.mjs` | 0 | 0 | 0 | 0 | 86ms |
| `scripts/contrast-audit.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `scripts/favicon-audit.test.mjs` | 0 | 0 | 0 | 0 | 78ms |
| `scripts/perf-audit.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `scripts/retell-prompt-audit.test.mjs` | 0 | 0 | 0 | 0 | 85ms |
| `scripts/seo-content-audit.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `scripts/verify-release-config.test.mjs` | 0 | 0 | 0 | 0 | 96ms |
| `supabase/migrations/005_grant_owner_crm_access.test.mjs` | 0 | 0 | 0 | 0 | 90ms |
| `supabase/migrations/20260809124000_durable_ai_triage_attempts.test.mjs` | 0 | 0 | 0 | 0 | 82ms |
| `supabase/migrations/20260809143000_owner_lead_stage_updates.test.mjs` | 0 | 0 | 0 | 0 | 91ms |
| `supabase/migrations/20260809171000_fix_targeted_notification_claim_ambiguity.test.mjs` | 0 | 0 | 0 | 0 | 78ms |
| `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.test.mjs` | 0 | 0 | 0 | 0 | 78ms |
| `app/globals.css.test.js` | 0 | 0 | 0 | 0 | 108ms |
| `app/loading.test.js` | 0 | 0 | 0 | 0 | 103ms |
| `lib/ai-chat.test.mjs` | 0 | 0 | 0 | 0 | 92ms |
| `lib/indexnow.test.mjs` | 0 | 0 | 0 | 0 | 82ms |
| `lib/notifications/retell-webhook.test.mjs` | 0 | 0 | 0 | 0 | 91ms |
| `lib/notifications/worker.test.mjs` | 0 | 0 | 0 | 0 | 83ms |
| `lib/request-rate-limit.test.mjs` | 0 | 0 | 0 | 0 | 85ms |
| `lib/supabase-public-key.test.mjs` | 0 | 0 | 0 | 0 | 81ms |
| `scripts/csp-audit.test.mjs` | 0 | 0 | 0 | 0 | 89ms |
| `scripts/glass-primitive-audit.test.mjs` | 0 | 0 | 0 | 0 | 79ms |
| `scripts/portfolio-audit.test.mjs` | 0 | 0 | 0 | 0 | 92ms |
| `scripts/search-console-submit.test.mjs` | 0 | 0 | 0 | 0 | 82ms |
| `scripts/sitemap-audit.test.mjs` | 0 | 0 | 0 | 0 | 94ms |
| `supabase/migrations/003_owner_crm_core.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.test.mjs` | 0 | 0 | 0 | 0 | 96ms |
| `supabase/migrations/20260809133000_follow_up_task_operations.test.mjs` | 0 | 0 | 0 | 0 | 85ms |
| `supabase/migrations/20260809153000_owner_consent_withdrawal.test.mjs` | 0 | 0 | 0 | 0 | 82ms |
| `supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs` | 0 | 0 | 0 | 0 | 78ms |
| `tests/portfolio-links.test.mjs` | 0 | 0 | 0 | 0 | 76ms |
| `app/icon.test.js` | 0 | 0 | 0 | 0 | 81ms |
| `app/layout-seo.test.mjs` | 0 | 0 | 0 | 0 | 96ms |
| `app/seo.test.js` | 0 | 0 | 0 | 0 | 82ms |
| `lib/ai-triage.test.mjs` | 0 | 0 | 0 | 0 | 81ms |
| `lib/meta-webhook-verify.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `lib/notifications/supabase-store.test.mjs` | 0 | 0 | 0 | 0 | 76ms |
| `lib/owner-auth.test.mjs` | 0 | 0 | 0 | 0 | 89ms |
| `lib/retell-server.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `next.config.test.mjs` | 0 | 0 | 0 | 0 | 89ms |
| `scripts/deploy-ledger-audit.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `scripts/google-oauth-button-audit.test.mjs` | 0 | 0 | 0 | 0 | 96ms |
| `scripts/release-gate.test.mjs` | 0 | 0 | 0 | 0 | 86ms |
| `scripts/secret-scan.test.mjs` | 0 | 0 | 0 | 0 | 86ms |
| `scripts/ui-visual-audit.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `supabase/migrations/004_fix_task_due_date.test.mjs` | 0 | 0 | 0 | 0 | 101ms |
| `supabase/migrations/20260809103635_durable_notification_state_machine.test.mjs` | 0 | 0 | 0 | 0 | 87ms |
| `supabase/migrations/20260809140000_owner_notes_and_activity_timeline.test.mjs` | 0 | 0 | 0 | 0 | 83ms |
| `supabase/migrations/20260809170000_targeted_notification_claim.test.mjs` | 0 | 0 | 0 | 0 | 76ms |
| `supabase/migrations/20260812100000_harden_customer_isolation.test.mjs` | 0 | 0 | 0 | 0 | 81ms |

## COMPONENT (58 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/about/page.test.js` | 0 | 0 | 0 | 0 | 99ms |
| `app/book/BookingPreview.test.js` | 0 | 0 | 0 | 0 | 96ms |
| `app/components/DashboardDemo.test.js` | 0 | 0 | 0 | 0 | 88ms |
| `app/components/PricingReference.test.js` | 0 | 0 | 0 | 0 | 86ms |
| `app/industries/dental-clinics/page.test.js` | 0 | 0 | 0 | 0 | 84ms |
| `app/industries/salons-spas/page.test.js` | 0 | 0 | 0 | 0 | 88ms |
| `app/pricing/PricingPage.test.mjs` | 0 | 0 | 0 | 0 | 80ms |
| `app/systems/ai-receptionist/AiReceptionistSystem.test.js` | 0 | 0 | 0 | 0 | 82ms |
| `app/systems/booking-control/page.test.js` | 0 | 0 | 0 | 0 | 90ms |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.test.js` | 0 | 0 | 0 | 0 | 92ms |
| `app/work/aura-archives/AuraArchivesCaseStudy.test.js` | 0 | 0 | 0 | 0 | 90ms |
| `app/work/dentacare-pro/DentaCareCaseStudy.test.js` | 0 | 0 | 0 | 0 | 90ms |
| `app/work/luxe-studio/LuxeStudioCaseStudy.test.js` | 0 | 0 | 0 | 0 | 107ms |
| `app/work/retech/RetechCaseStudy.test.js` | 0 | 0 | 0 | 0 | 93ms |
| `app/admin/AdminDashboard.test.js` | 0 | 0 | 0 | 0 | 76ms |
| `app/audit/page.test.js` | 0 | 0 | 0 | 0 | 97ms |
| `app/chat/page.test.mjs` | 0 | 0 | 0 | 0 | 91ms |
| `app/components/MotionReveal.test.js` | 0 | 0 | 0 | 0 | 84ms |
| `app/components/SiteHeader.test.js` | 0 | 0 | 0 | 0 | 101ms |
| `app/industries/page.test.js` | 0 | 0 | 0 | 0 | 88ms |
| `app/owner/reset-password/page.test.js` | 0 | 0 | 0 | 0 | 104ms |
| `app/systems/ai-receptionist/page.test.js` | 0 | 0 | 0 | 0 | 101ms |
| `app/systems/missed-lead-recovery/page.test.js` | 0 | 0 | 0 | 0 | 92ms |
| `app/work/atelier/AtelierCaseStudy.test.js` | 0 | 0 | 0 | 0 | 103ms |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.test.js` | 0 | 0 | 0 | 0 | 106ms |
| `app/work/page.test.js` | 0 | 0 | 0 | 0 | 91ms |
| `app/work/retech/page.test.js` | 0 | 0 | 0 | 0 | 97ms |
| `app/admin/page.test.js` | 0 | 0 | 0 | 0 | 98ms |
| `app/book/page.test.js` | 0 | 0 | 0 | 0 | 88ms |
| `app/components/CustomerAssistantLauncher.test.js` | 0 | 0 | 0 | 0 | 101ms |
| `app/components/SiteFooter.test.js` | 0 | 0 | 0 | 0 | 77ms |
| `app/components/WorkflowDemo.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/login/page.test.mjs` | 0 | 0 | 0 | 0 | 75ms |
| `app/owner/OwnerDashboard.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/process/page.test.js` | 0 | 0 | 0 | 0 | 84ms |
| `app/systems/booking-control/BookingControlSystem.test.js` | 0 | 0 | 0 | 0 | 79ms |
| `app/systems/page.test.js` | 0 | 0 | 0 | 0 | 91ms |
| `app/work/atelier/page.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/work/bramble-cafe/page.test.js` | 0 | 0 | 0 | 0 | 91ms |
| `app/work/harbour-estates/page.test.js` | 0 | 0 | 0 | 0 | 101ms |
| `app/work/rapidpulse/RapidPulseCaseStudy.test.js` | 0 | 0 | 0 | 0 | 93ms |
| `app/work/voltix/VoltixCaseStudy.test.js` | 0 | 0 | 0 | 0 | 114ms |
| `app/audit/AuditForm.test.js` | 0 | 0 | 0 | 0 | 76ms |
| `app/audit/submit-audit.test.mjs` | 0 | 0 | 0 | 0 | 100ms |
| `app/components/AssistantWidget.test.js` | 0 | 0 | 0 | 0 | 81ms |
| `app/components/InteractiveLeadJourney.test.js` | 0 | 0 | 0 | 0 | 96ms |
| `app/components/VoiceSessionLauncher.test.js` | 0 | 0 | 0 | 0 | 85ms |
| `app/industries/home-services/page.test.js` | 0 | 0 | 0 | 0 | 89ms |
| `app/owner/page.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/scope/page.test.js` | 0 | 0 | 0 | 0 | 86ms |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.test.js` | 0 | 0 | 0 | 0 | 91ms |
| `app/systems/trust-lead-capture/page.test.js` | 0 | 0 | 0 | 0 | 92ms |
| `app/work/aura-archives/page.test.js` | 0 | 0 | 0 | 0 | 97ms |
| `app/work/dentacare-pro/page.test.js` | 0 | 0 | 0 | 0 | 83ms |
| `app/work/luxe-studio/page.test.js` | 0 | 0 | 0 | 0 | 104ms |
| `app/work/rapidpulse/page.test.js` | 0 | 0 | 0 | 0 | 93ms |
| `app/work/voltix/page.test.js` | 0 | 0 | 0 | 0 | 104ms |

## INTEGRATION (6 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/api/audit/route.test.js` | 0 | 0 | 0 | 0 | 86ms |
| `app/api/owner/whoami/route.test.js` | 0 | 0 | 0 | 0 | 85ms |
| `app/api/chat/route.test.js` | 0 | 0 | 0 | 0 | 88ms |
| `app/api/owner/export/route.test.js` | 0 | 0 | 0 | 0 | 87ms |
| `app/api/owner/notification-readiness/route.test.js` | 0 | 0 | 0 | 0 | 84ms |
| `app/api/webhooks/resend/route.test.js` | 0 | 0 | 0 | 0 | 82ms |

## ENVIRONMENT (3 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `scripts/build-audit.test.mjs` | 0 | 0 | 0 | 0 | 84ms |
| `scripts/metadata-audit.test.mjs` | 0 | 0 | 0 | 0 | 72ms |
| `scripts/worker-secrets-audit.test.mjs` | 0 | 0 | 0 | 0 | 76ms |
