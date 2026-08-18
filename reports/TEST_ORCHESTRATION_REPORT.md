# Test Orchestration Report

Generated: 2026-08-18T03:46:57.958Z • Duration: 10.9s

**Total:** 142 files • 0 pass • 0 fail • 0 skipped • 0 env-failures

| Tier | Files | Pass | Fail | Env | Duration |
|------|-------|------|------|-----|----------|
| UNIT | 75 | 0 | 0 | 0 | 2.7s |
| COMPONENT | 58 | 0 | 0 | 0 | 2.1s |
| INTEGRATION | 6 | 0 | 0 | 0 | 0.2s |
| ENVIRONMENT | 3 | 0 | 0 | 0 | 0.1s |

## UNIT (75 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/error.test.js` | 0 | 0 | 0 | 0 | 124ms |
| `app/layout.test.js` | 0 | 0 | 0 | 0 | 129ms |
| `app/seo.test.js` | 0 | 0 | 0 | 0 | 125ms |
| `lib/auth-redirect-allowlist.test.mjs` | 0 | 0 | 0 | 0 | 140ms |
| `lib/notifications/config.test.mjs` | 0 | 0 | 0 | 0 | 157ms |
| `lib/notifications/templates.test.mjs` | 0 | 0 | 0 | 0 | 158ms |
| `lib/release-config.test.mjs` | 0 | 0 | 0 | 0 | 130ms |
| `lib/site-url-fallback.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `scripts/a11y-audit.test.mjs` | 0 | 0 | 0 | 0 | 117ms |
| `scripts/deploy-verified-fixes.test.mjs` | 0 | 0 | 0 | 0 | 134ms |
| `scripts/mobile-overlap-audit.test.mjs` | 0 | 0 | 0 | 0 | 154ms |
| `scripts/retell-prompt-audit.test.mjs` | 0 | 0 | 0 | 0 | 138ms |
| `scripts/seo-content-audit.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `scripts/verify-release-config.test.mjs` | 0 | 0 | 0 | 0 | 128ms |
| `supabase/migrations/005_grant_owner_crm_access.test.mjs` | 0 | 0 | 0 | 0 | 129ms |
| `supabase/migrations/20260809124000_durable_ai_triage_attempts.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `supabase/migrations/20260809143000_owner_lead_stage_updates.test.mjs` | 0 | 0 | 0 | 0 | 157ms |
| `supabase/migrations/20260809171000_fix_targeted_notification_claim_ambiguity.test.mjs` | 0 | 0 | 0 | 0 | 160ms |
| `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.test.mjs` | 0 | 0 | 0 | 0 | 159ms |
| `app/global-error.test.js` | 0 | 0 | 0 | 0 | 126ms |
| `app/loading.test.js` | 0 | 0 | 0 | 0 | 131ms |
| `lib/ai-chat.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `lib/indexnow.test.mjs` | 0 | 0 | 0 | 0 | 163ms |
| `lib/notifications/retell-webhook.test.mjs` | 0 | 0 | 0 | 0 | 204ms |
| `lib/owner-auth.test.mjs` | 0 | 0 | 0 | 0 | 147ms |
| `lib/retell-server.test.mjs` | 0 | 0 | 0 | 0 | 150ms |
| `next.config.test.mjs` | 0 | 0 | 0 | 0 | 127ms |
| `scripts/deploy-ledger-audit.test.mjs` | 0 | 0 | 0 | 0 | 126ms |
| `scripts/google-oauth-button-audit.test.mjs` | 0 | 0 | 0 | 0 | 145ms |
| `scripts/release-gate.test.mjs` | 0 | 0 | 0 | 0 | 144ms |
| `scripts/secret-scan.test.mjs` | 0 | 0 | 0 | 0 | 140ms |
| `scripts/ui-visual-audit.test.mjs` | 0 | 0 | 0 | 0 | 137ms |
| `supabase/migrations/004_fix_task_due_date.test.mjs` | 0 | 0 | 0 | 0 | 136ms |
| `supabase/migrations/20260809103635_durable_notification_state_machine.test.mjs` | 0 | 0 | 0 | 0 | 132ms |
| `supabase/migrations/20260809140000_owner_notes_and_activity_timeline.test.mjs` | 0 | 0 | 0 | 0 | 161ms |
| `supabase/migrations/20260809170000_targeted_notification_claim.test.mjs` | 0 | 0 | 0 | 0 | 162ms |
| `supabase/migrations/20260812100000_harden_customer_isolation.test.mjs` | 0 | 0 | 0 | 0 | 164ms |
| `app/globals.css.test.js` | 0 | 0 | 0 | 0 | 114ms |
| `app/layout-seo.test.mjs` | 0 | 0 | 0 | 0 | 138ms |
| `instrumentation.test.js` | 0 | 0 | 0 | 0 | 115ms |
| `lib/audit-validation.test.mjs` | 0 | 0 | 0 | 0 | 159ms |
| `lib/notifications/resend-adapter.test.mjs` | 0 | 0 | 0 | 0 | 164ms |
| `lib/notifications/worker.test.mjs` | 0 | 0 | 0 | 0 | 164ms |
| `lib/request-rate-limit.test.mjs` | 0 | 0 | 0 | 0 | 132ms |
| `lib/supabase-public-key.test.mjs` | 0 | 0 | 0 | 0 | 145ms |
| `scripts/csp-audit.test.mjs` | 0 | 0 | 0 | 0 | 128ms |
| `scripts/glass-primitive-audit.test.mjs` | 0 | 0 | 0 | 0 | 149ms |
| `scripts/portfolio-audit.test.mjs` | 0 | 0 | 0 | 0 | 145ms |
| `scripts/search-console-submit.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `scripts/sitemap-audit.test.mjs` | 0 | 0 | 0 | 0 | 141ms |
| `supabase/migrations/003_owner_crm_core.test.mjs` | 0 | 0 | 0 | 0 | 127ms |
| `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.test.mjs` | 0 | 0 | 0 | 0 | 137ms |
| `supabase/migrations/20260809133000_follow_up_task_operations.test.mjs` | 0 | 0 | 0 | 0 | 147ms |
| `supabase/migrations/20260809153000_owner_consent_withdrawal.test.mjs` | 0 | 0 | 0 | 0 | 167ms |
| `supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs` | 0 | 0 | 0 | 0 | 164ms |
| `tests/portfolio-links.test.mjs` | 0 | 0 | 0 | 0 | 129ms |
| `app/icon.test.js` | 0 | 0 | 0 | 0 | 124ms |
| `app/not-found.test.js` | 0 | 0 | 0 | 0 | 116ms |
| `app/page.test.js` | 0 | 0 | 0 | 0 | 120ms |
| `lib/ai-triage.test.mjs` | 0 | 0 | 0 | 0 | 138ms |
| `lib/meta-webhook-verify.test.mjs` | 0 | 0 | 0 | 0 | 156ms |
| `lib/notifications/supabase-store.test.mjs` | 0 | 0 | 0 | 0 | 156ms |
| `lib/pricing.test.mjs` | 0 | 0 | 0 | 0 | 141ms |
| `lib/sentry-dsn.test.mjs` | 0 | 0 | 0 | 0 | 144ms |
| `scripts/contrast-audit.test.mjs` | 0 | 0 | 0 | 0 | 128ms |
| `scripts/favicon-audit.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `scripts/perf-audit.test.mjs` | 0 | 0 | 0 | 0 | 143ms |
| `scripts/rls-policy-audit.test.mjs` | 0 | 0 | 0 | 0 | 139ms |
| `scripts/seo-tech-audit.test.mjs` | 0 | 0 | 0 | 0 | 143ms |
| `sentry.server.config.test.js` | 0 | 0 | 0 | 0 | 130ms |
| `supabase/migrations/006_restrict_owner_to_single_email.test.mjs` | 0 | 0 | 0 | 0 | 133ms |
| `supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs` | 0 | 0 | 0 | 0 | 142ms |
| `supabase/migrations/20260809150000_durable_request_rate_limit.test.mjs` | 0 | 0 | 0 | 0 | 151ms |
| `supabase/migrations/20260810100000_require_owner_aal2.test.mjs` | 0 | 0 | 0 | 0 | 163ms |
| `tests/audit-validation.test.mjs` | 0 | 0 | 0 | 0 | 157ms |

## COMPONENT (58 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/about/page.test.js` | 0 | 0 | 0 | 0 | 139ms |
| `app/audit/submit-audit.test.mjs` | 0 | 0 | 0 | 0 | 131ms |
| `app/components/CustomerAssistantLauncher.test.js` | 0 | 0 | 0 | 0 | 130ms |
| `app/components/InteractiveLeadJourney.test.js` | 0 | 0 | 0 | 0 | 138ms |
| `app/components/SiteHeader.test.js` | 0 | 0 | 0 | 0 | 148ms |
| `app/industries/home-services/page.test.js` | 0 | 0 | 0 | 0 | 162ms |
| `app/owner/page.test.js` | 0 | 0 | 0 | 0 | 151ms |
| `app/scope/page.test.js` | 0 | 0 | 0 | 0 | 146ms |
| `app/systems/booking-control/page.test.js` | 0 | 0 | 0 | 0 | 136ms |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.test.js` | 0 | 0 | 0 | 0 | 141ms |
| `app/work/aura-archives/AuraArchivesCaseStudy.test.js` | 0 | 0 | 0 | 0 | 144ms |
| `app/work/dentacare-pro/DentaCareCaseStudy.test.js` | 0 | 0 | 0 | 0 | 149ms |
| `app/work/luxe-studio/LuxeStudioCaseStudy.test.js` | 0 | 0 | 0 | 0 | 149ms |
| `app/work/rapidpulse/RapidPulseCaseStudy.test.js` | 0 | 0 | 0 | 0 | 152ms |
| `app/admin/AdminDashboard.test.js` | 0 | 0 | 0 | 0 | 139ms |
| `app/book/BookingPreview.test.js` | 0 | 0 | 0 | 0 | 125ms |
| `app/components/AssistantWidget.test.js` | 0 | 0 | 0 | 0 | 135ms |
| `app/components/MotionReveal.test.js` | 0 | 0 | 0 | 0 | 144ms |
| `app/components/VoiceSessionLauncher.test.js` | 0 | 0 | 0 | 0 | 148ms |
| `app/industries/page.test.js` | 0 | 0 | 0 | 0 | 140ms |
| `app/owner/OwnerDashboard.test.js` | 0 | 0 | 0 | 0 | 157ms |
| `app/process/page.test.js` | 0 | 0 | 0 | 0 | 138ms |
| `app/systems/booking-control/BookingControlSystem.test.js` | 0 | 0 | 0 | 0 | 150ms |
| `app/systems/page.test.js` | 0 | 0 | 0 | 0 | 135ms |
| `app/work/atelier/page.test.js` | 0 | 0 | 0 | 0 | 145ms |
| `app/work/bramble-cafe/page.test.js` | 0 | 0 | 0 | 0 | 151ms |
| `app/work/harbour-estates/page.test.js` | 0 | 0 | 0 | 0 | 161ms |
| `app/work/rapidpulse/page.test.js` | 0 | 0 | 0 | 0 | 138ms |
| `app/work/voltix/VoltixCaseStudy.test.js` | 0 | 0 | 0 | 0 | 121ms |
| `app/admin/page.test.js` | 0 | 0 | 0 | 0 | 141ms |
| `app/book/page.test.js` | 0 | 0 | 0 | 0 | 136ms |
| `app/components/DashboardDemo.test.js` | 0 | 0 | 0 | 0 | 140ms |
| `app/components/SiteFooter.test.js` | 0 | 0 | 0 | 0 | 142ms |
| `app/industries/dental-clinics/page.test.js` | 0 | 0 | 0 | 0 | 139ms |
| `app/industries/salons-spas/page.test.js` | 0 | 0 | 0 | 0 | 156ms |
| `app/owner/reset-password/page.test.js` | 0 | 0 | 0 | 0 | 145ms |
| `app/systems/ai-receptionist/AiReceptionistSystem.test.js` | 0 | 0 | 0 | 0 | 154ms |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.test.js` | 0 | 0 | 0 | 0 | 144ms |
| `app/work/atelier/AtelierCaseStudy.test.js` | 0 | 0 | 0 | 0 | 150ms |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.test.js` | 0 | 0 | 0 | 0 | 149ms |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.test.js` | 0 | 0 | 0 | 0 | 138ms |
| `app/work/page.test.js` | 0 | 0 | 0 | 0 | 143ms |
| `app/work/retech/RetechCaseStudy.test.js` | 0 | 0 | 0 | 0 | 128ms |
| `app/work/voltix/page.test.js` | 0 | 0 | 0 | 0 | 118ms |
| `app/audit/AuditForm.test.js` | 0 | 0 | 0 | 0 | 126ms |
| `app/audit/page.test.js` | 0 | 0 | 0 | 0 | 131ms |
| `app/chat/page.test.mjs` | 0 | 0 | 0 | 0 | 155ms |
| `app/components/PricingReference.test.js` | 0 | 0 | 0 | 0 | 142ms |
| `app/components/WorkflowDemo.test.js` | 0 | 0 | 0 | 0 | 157ms |
| `app/login/page.test.mjs` | 0 | 0 | 0 | 0 | 145ms |
| `app/pricing/PricingPage.test.mjs` | 0 | 0 | 0 | 0 | 158ms |
| `app/systems/ai-receptionist/page.test.js` | 0 | 0 | 0 | 0 | 140ms |
| `app/systems/missed-lead-recovery/page.test.js` | 0 | 0 | 0 | 0 | 139ms |
| `app/systems/trust-lead-capture/page.test.js` | 0 | 0 | 0 | 0 | 137ms |
| `app/work/aura-archives/page.test.js` | 0 | 0 | 0 | 0 | 149ms |
| `app/work/dentacare-pro/page.test.js` | 0 | 0 | 0 | 0 | 150ms |
| `app/work/luxe-studio/page.test.js` | 0 | 0 | 0 | 0 | 153ms |
| `app/work/retech/page.test.js` | 0 | 0 | 0 | 0 | 149ms |

## INTEGRATION (6 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/api/audit/route.test.js` | 0 | 0 | 0 | 0 | 126ms |
| `app/api/owner/whoami/route.test.js` | 0 | 0 | 0 | 0 | 121ms |
| `app/api/chat/route.test.js` | 0 | 0 | 0 | 0 | 141ms |
| `app/api/owner/export/route.test.js` | 0 | 0 | 0 | 0 | 125ms |
| `app/api/webhooks/resend/route.test.js` | 0 | 0 | 0 | 0 | 117ms |
| `app/api/owner/notification-readiness/route.test.js` | 0 | 0 | 0 | 0 | 136ms |

## ENVIRONMENT (3 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `scripts/build-audit.test.mjs` | 0 | 0 | 0 | 0 | 110ms |
| `scripts/metadata-audit.test.mjs` | 0 | 0 | 0 | 0 | 122ms |
| `scripts/worker-secrets-audit.test.mjs` | 0 | 0 | 0 | 0 | 117ms |
