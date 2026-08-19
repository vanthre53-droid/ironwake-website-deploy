# Test Orchestration Report

Generated: 2026-08-19T18:36:08.667Z • Duration: 368.0s

**Total:** 162 files • 548 pass • 3 fail • 0 skipped • 0 env-failures

| Tier | Files | Pass | Fail | Env | Duration |
|------|-------|------|------|-----|----------|
| UNIT | 85 | 378 | 2 | 0 | 143.2s |
| COMPONENT | 68 | 134 | 1 | 0 | 4.2s |
| INTEGRATION | 6 | 33 | 0 | 0 | 6.5s |
| ENVIRONMENT | 3 | 3 | 0 | 0 | 21.9s |

## UNIT (85 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/error.test.js` | 0 | 1 | 0 | 0 | 213ms |
| `app/layout-seo.test.mjs` | 0 | 1 | 0 | 0 | 228ms |
| `instrumentation.test.js` | 0 | 1 | 0 | 0 | 232ms |
| `lib/auth-redirect-allowlist.test.mjs` | 0 | 4 | 0 | 0 | 261ms |
| `lib/notifications/config.test.mjs` | 0 | 2 | 0 | 0 | 285ms |
| `lib/notifications/supabase-store.test.mjs` | 0 | 2 | 0 | 0 | 307ms |
| `lib/notifications/whatsapp-adapter.test.mjs` | 0 | 13 | 0 | 0 | 332ms |
| `lib/pricing.test.mjs` | 0 | 2 | 0 | 0 | 227ms |
| `lib/request-rate-limit.test.mjs` | 0 | 6 | 0 | 0 | 289ms |
| `lib/retell/golden.test.mjs` | 0 | 14 | 0 | 0 | 552ms |
| `lib/whatsapp/business-profile.test.js` | 0 | 26 | 0 | 0 | 384ms |
| `lib/whatsapp/oauth.test.js` | 0 | 36 | 0 | 0 | 399ms |
| `lib/whatsapp/signature.test.js` | 0 | 12 | 0 | 0 | 331ms |
| `next.config.test.mjs` | 0 | 1 | 0 | 0 | 248ms |
| `scripts/contrast-audit.test.mjs` | 0 | 1 | 0 | 0 | 347ms |
| `scripts/csp-audit.test.mjs` | 0 | 1 | 0 | 0 | 496ms |
| `scripts/deploy-verified-fixes.test.mjs` | 0 | 3 | 0 | 0 | 231ms |
| `scripts/favicon-audit.test.mjs` | 0 | 1 | 0 | 0 | 380ms |
| `scripts/google-oauth-button-audit.test.mjs` | 0 | 1 | 0 | 0 | 433ms |
| `scripts/lighthouse-audit.test.mjs` | 0 | 1 | 0 | 0 | 136981ms |
| `app/global-error.test.js` | 0 | 1 | 0 | 0 | 248ms |
| `app/loading.test.js` | 0 | 2 | 0 | 0 | 256ms |
| `lib/ai-triage.test.mjs` | 0 | 4 | 0 | 0 | 298ms |
| `lib/indexnow.test.mjs` | 0 | 6 | 0 | 0 | 268ms |
| `lib/notifications/resend-adapter.test.mjs` | 0 | 4 | 0 | 0 | 748ms |
| `lib/owner-auth.test.mjs` | 0 | 3 | 0 | 0 | 234ms |
| `lib/release-config.test.mjs` | 0 | 3 | 0 | 0 | 212ms |
| `lib/retell-server.test.mjs` | 0 | 15 | 0 | 0 | 407ms |
| `lib/site-url-fallback.test.mjs` | 0 | 2 | 0 | 0 | 2250ms |
| `scripts/deploy-ledger-audit.test.mjs` | 0 | 1 | 0 | 0 | 569ms |
| `scripts/glass-primitive-audit.test.mjs` | 0 | 1 | 0 | 0 | 1123ms |
| `scripts/mobile-overlap-audit.test.mjs` | 0 | 1 | 0 | 0 | 1840ms |
| `scripts/portfolio-audit.test.mjs` | 0 | 1 | 0 | 0 | 433ms |
| `scripts/release-gate.test.mjs` | 0 | 3 | 0 | 0 | 237ms |
| `scripts/responsive-viewport-audit.test.mjs` | 0 | 7 | 0 | 0 | 214ms |
| `scripts/retell-prompt-audit.test.mjs` | 0 | 1 | 0 | 0 | 439ms |
| `scripts/rls-policy-audit.test.mjs` | 0 | 1 | 0 | 0 | 401ms |
| `scripts/routes-acceptance-audit.test.mjs` | 0 | 8 | 0 | 0 | 2158ms |
| `scripts/seo-content-audit.test.mjs` | 1 | 1 | 1 | 0 | 1267ms |
| `scripts/seo-tech-audit.test.mjs` | 1 | 0 | 1 | 0 | 1535ms |
| `scripts/sitemap-audit.test.mjs` | 0 | 1 | 0 | 0 | 1432ms |
| `scripts/ui-visual-audit.test.mjs` | 0 | 1 | 0 | 0 | 807ms |
| `scripts/verify-release-config.test.mjs` | 0 | 1 | 0 | 0 | 310ms |
| `sentry.server.config.test.js` | 0 | 1 | 0 | 0 | 269ms |
| `supabase/migrations/003_owner_crm_core.test.mjs` | 0 | 1 | 0 | 0 | 293ms |
| `supabase/migrations/004_fix_task_due_date.test.mjs` | 0 | 1 | 0 | 0 | 308ms |
| `supabase/migrations/005_grant_owner_crm_access.test.mjs` | 0 | 1 | 0 | 0 | 257ms |
| `supabase/migrations/006_restrict_owner_to_single_email.test.mjs` | 0 | 1 | 0 | 0 | 411ms |
| `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.test.mjs` | 0 | 4 | 0 | 0 | 435ms |
| `supabase/migrations/20260809103635_durable_notification_state_machine.test.mjs` | 0 | 10 | 0 | 0 | 499ms |
| `supabase/migrations/20260809124000_durable_ai_triage_attempts.test.mjs` | 0 | 1 | 0 | 0 | 322ms |
| `supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs` | 0 | 1 | 0 | 0 | 310ms |
| `supabase/migrations/20260809133000_follow_up_task_operations.test.mjs` | 0 | 1 | 0 | 0 | 345ms |
| `supabase/migrations/20260809140000_owner_notes_and_activity_timeline.test.mjs` | 0 | 1 | 0 | 0 | 395ms |
| `supabase/migrations/20260809143000_owner_lead_stage_updates.test.mjs` | 0 | 1 | 0 | 0 | 471ms |
| `supabase/migrations/20260809150000_durable_request_rate_limit.test.mjs` | 0 | 1 | 0 | 0 | 377ms |
| `supabase/migrations/20260809153000_owner_consent_withdrawal.test.mjs` | 0 | 1 | 0 | 0 | 345ms |
| `supabase/migrations/20260809170000_targeted_notification_claim.test.mjs` | 0 | 1 | 0 | 0 | 307ms |
| `supabase/migrations/20260809171000_fix_targeted_notification_claim_ambiguity.test.mjs` | 0 | 1 | 0 | 0 | 325ms |
| `supabase/migrations/20260810100000_require_owner_aal2.test.mjs` | 0 | 2 | 0 | 0 | 288ms |
| `supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs` | 0 | 5 | 0 | 0 | 335ms |
| `supabase/migrations/20260812100000_harden_customer_isolation.test.mjs` | 0 | 7 | 0 | 0 | 352ms |
| `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.test.mjs` | 0 | 7 | 0 | 0 | 393ms |
| `tests/audit-validation.test.mjs` | 0 | 2 | 0 | 0 | 3110ms |
| `app/globals.css.test.js` | 0 | 2 | 0 | 0 | 254ms |
| `app/not-found.test.js` | 0 | 1 | 0 | 0 | 255ms |
| `lib/audit-validation.test.mjs` | 0 | 8 | 0 | 0 | 2602ms |
| `lib/whatsapp/crm.test.js` | 0 | 3 | 0 | 0 | 4359ms |
| `scripts/perf-audit.test.mjs` | 0 | 6 | 0 | 0 | 19693ms |
| `tests/portfolio-links.test.mjs` | 0 | 3 | 0 | 0 | 11952ms |
| `app/icon.test.js` | 0 | 3 | 0 | 0 | 256ms |
| `app/seo.test.js` | 0 | 1 | 0 | 0 | 237ms |
| `lib/ai-chat.test.mjs` | 0 | 20 | 0 | 0 | 313ms |
| `lib/meta-webhook-verify.test.mjs` | 0 | 9 | 0 | 0 | 292ms |
| `lib/notifications/retell-webhook.test.mjs` | 0 | 10 | 0 | 0 | 347ms |
| `lib/notifications/templates.test.mjs` | 0 | 3 | 0 | 0 | 260ms |
| `lib/notifications/worker.test.mjs` | 0 | 9 | 0 | 0 | 861ms |
| `lib/sentry-dsn.test.mjs` | 0 | 3 | 0 | 0 | 338ms |
| `lib/supabase-public-key.test.mjs` | 0 | 3 | 0 | 0 | 297ms |
| `lib/whatsapp/meta-client.test.js` | 0 | 12 | 0 | 0 | 387ms |
| `lib/whatsapp/parse.test.js` | 0 | 10 | 0 | 0 | 318ms |
| `lib/whatsapp/templates.test.js` | 0 | 10 | 0 | 0 | 316ms |
| `scripts/a11y-audit.test.mjs` | 0 | 7 | 0 | 0 | 7622ms |
| `scripts/search-console-submit.test.mjs` | 0 | 6 | 0 | 0 | 306ms |
| `scripts/secret-scan.test.mjs` | 0 | 1 | 0 | 0 | 41178ms |

### Logic failures (blocking)

- `scripts/seo-content-audit.test.mjs` — scripts/seo-content-audit.mjs reports zero failures on current tree: |-
- `scripts/seo-tech-audit.test.mjs` — seo tech audit gate: |-

## COMPONENT (68 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/.well-known/indexnow-key.txt/route.test.mjs` | 0 | 2 | 0 | 0 | 233ms |
| `app/audit/submit-audit.test.mjs` | 0 | 8 | 0 | 0 | 201ms |
| `app/components/AssistantWidget.test.js` | 0 | 5 | 0 | 0 | 207ms |
| `app/components/MotionReveal.test.js` | 0 | 1 | 0 | 0 | 231ms |
| `app/components/VoiceSessionLauncher.test.js` | 0 | 4 | 0 | 0 | 256ms |
| `app/components/ui/GoogleIcon.test.mjs` | 0 | 3 | 0 | 0 | 238ms |
| `app/industries/salons-spas/page.test.js` | 0 | 1 | 0 | 0 | 245ms |
| `app/owner/OwnerDashboard.test.js` | 0 | 2 | 0 | 0 | 247ms |
| `app/page.test.js` | 0 | 2 | 0 | 0 | 253ms |
| `app/scope/page.test.js` | 0 | 1 | 0 | 0 | 240ms |
| `app/systems/booking-control/page.test.js` | 0 | 1 | 0 | 0 | 293ms |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/work/aura-archives/AuraArchivesCaseStudy.test.js` | 0 | 1 | 0 | 0 | 270ms |
| `app/work/dentacare-pro/DentaCareCaseStudy.test.js` | 0 | 1 | 0 | 0 | 254ms |
| `app/work/luxe-studio/page.test.js` | 0 | 1 | 0 | 0 | 271ms |
| `app/work/retech/RetechCaseStudy.test.js` | 0 | 1 | 0 | 0 | 273ms |
| `app/work/voltix/page.test.js` | 0 | 1 | 0 | 0 | 224ms |
| `app/about/page.test.js` | 0 | 1 | 0 | 0 | 173ms |
| `app/audit/AuditForm.test.js` | 0 | 2 | 0 | 0 | 178ms |
| `app/book/page.test.js` | 0 | 1 | 0 | 0 | 167ms |
| `app/components/DashboardDemo.test.js` | 0 | 1 | 0 | 0 | 186ms |
| `app/components/PricingReference.test.js` | 0 | 1 | 0 | 0 | 216ms |
| `app/components/WorkflowDemo.test.js` | 0 | 1 | 0 | 0 | 217ms |
| `app/industries/dental-clinics/page.test.js` | 0 | 1 | 0 | 0 | 223ms |
| `app/industries/page.test.js` | 0 | 1 | 0 | 0 | 216ms |
| `app/manifest.webmanifest/route.test.mjs` | 0 | 3 | 0 | 0 | 303ms |
| `app/pricing/PricingPage.test.js` | 0 | 13 | 0 | 0 | 256ms |
| `app/systems/ai-receptionist/AiReceptionistSystem.test.js` | 0 | 2 | 0 | 0 | 236ms |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.test.js` | 0 | 1 | 0 | 0 | 311ms |
| `app/work/atelier/AtelierCaseStudy.test.js` | 0 | 1 | 0 | 0 | 253ms |
| `app/work/bramble-cafe/page.test.js` | 0 | 1 | 0 | 0 | 292ms |
| `app/work/harbour-estates/page.test.js` | 0 | 1 | 0 | 0 | 250ms |
| `app/work/rapidpulse/RapidPulseCaseStudy.test.js` | 0 | 2 | 0 | 0 | 311ms |
| `app/work/voltix/VoltixCaseStudy.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/admin/AdminDashboard.test.js` | 0 | 5 | 0 | 0 | 193ms |
| `app/audit/page.test.js` | 0 | 1 | 0 | 0 | 166ms |
| `app/chat/page.test.mjs` | 0 | 1 | 0 | 0 | 171ms |
| `app/components/InteractiveLeadJourney.test.js` | 0 | 1 | 0 | 0 | 195ms |
| `app/components/SiteFooter.test.js` | 0 | 1 | 0 | 0 | 228ms |
| `app/components/ui/Button.test.mjs` | 0 | 8 | 0 | 0 | 250ms |
| `app/industries/dental/page.test.js` | 1 | 1 | 1 | 0 | 251ms |
| `app/layout.test.js` | 0 | 1 | 0 | 0 | 208ms |
| `app/owner/page.test.js` | 0 | 1 | 0 | 0 | 237ms |
| `app/pricing/PricingPage.test.mjs` | 0 | 2 | 0 | 0 | 238ms |
| `app/systems/ai-receptionist/page.test.js` | 0 | 2 | 0 | 0 | 233ms |
| `app/systems/missed-lead-recovery/page.test.js` | 0 | 1 | 0 | 0 | 286ms |
| `app/systems/trust-lead-capture/page.test.js` | 0 | 1 | 0 | 0 | 247ms |
| `app/work/aura-archives/page.test.js` | 0 | 1 | 0 | 0 | 272ms |
| `app/work/dentacare-pro/page.test.js` | 0 | 1 | 0 | 0 | 235ms |
| `app/work/luxe-studio/LuxeStudioCaseStudy.test.js` | 0 | 1 | 0 | 0 | 256ms |
| `app/work/rapidpulse/page.test.js` | 0 | 1 | 0 | 0 | 297ms |
| `app/admin/page.test.js` | 0 | 1 | 0 | 0 | 166ms |
| `app/apple-icon.svg/route.test.mjs` | 0 | 3 | 0 | 0 | 170ms |
| `app/book/BookingPreview.test.js` | 0 | 1 | 0 | 0 | 179ms |
| `app/components/CustomerAssistantLauncher.test.js` | 0 | 4 | 0 | 0 | 215ms |
| `app/components/SiteHeader.test.js` | 0 | 1 | 0 | 0 | 270ms |
| `app/components/ui/Field.test.mjs` | 0 | 9 | 0 | 0 | 251ms |
| `app/industries/home-services/page.test.js` | 0 | 1 | 0 | 0 | 218ms |
| `app/login/page.test.mjs` | 0 | 2 | 0 | 0 | 228ms |
| `app/owner/reset-password/page.test.js` | 0 | 4 | 0 | 0 | 240ms |
| `app/process/page.test.js` | 0 | 1 | 0 | 0 | 223ms |
| `app/systems/booking-control/BookingControlSystem.test.js` | 0 | 1 | 0 | 0 | 259ms |
| `app/systems/page.test.js` | 0 | 1 | 0 | 0 | 277ms |
| `app/work/atelier/page.test.js` | 0 | 1 | 0 | 0 | 235ms |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.test.js` | 0 | 1 | 0 | 0 | 286ms |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.test.js` | 0 | 1 | 0 | 0 | 240ms |
| `app/work/page.test.js` | 0 | 1 | 0 | 0 | 282ms |
| `app/work/retech/page.test.js` | 0 | 1 | 0 | 0 | 254ms |

### Logic failures (blocking)

- `app/industries/dental/page.test.js` — dental industry landing page wires SEO metadata, demo proof, and a real ROI calculator: |-

## INTEGRATION (6 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `app/api/audit/route.test.js` | 0 | 5 | 0 | 0 | 6452ms |
| `app/api/chat/route.test.js` | 0 | 11 | 0 | 0 | 2956ms |
| `app/api/owner/whoami/route.test.js` | 0 | 3 | 0 | 0 | 3479ms |
| `app/api/owner/export/route.test.js` | 0 | 2 | 0 | 0 | 2963ms |
| `app/api/webhooks/resend/route.test.js` | 0 | 10 | 0 | 0 | 2654ms |
| `app/api/owner/notification-readiness/route.test.js` | 0 | 2 | 0 | 0 | 2986ms |

## ENVIRONMENT (3 files)

| File | Exit | Pass | Fail | Env | Duration |
|------|------|------|------|-----|----------|
| `scripts/build-audit.test.mjs` | 0 | 1 | 0 | 0 | 21850ms |
| `scripts/metadata-audit.test.mjs` | 0 | 1 | 0 | 0 | 1476ms |
| `scripts/worker-secrets-audit.test.mjs` | 0 | 1 | 0 | 0 | 13331ms |
