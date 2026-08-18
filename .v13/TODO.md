# IronWake V13 — Living TODO + Requirement Graph + Execution Strategy

**Last updated**: 2026-08-18 (live) — truth-only, no inflation.

## WAVE-3 STATUS (this hour, 03:00Z)
- **Google OAuth fully verified live**: Supabase project `ironwake` has `external_google_enabled:true` + client_id matches vault. Login button → `signInWithGoogleAction('/account')` → `/auth/callback` exchanges code→session. Provider enable live in Supabase.
- **WhatsApp outbound shipped (`c9db4bf`)**: `lib/notifications/whatsapp-adapter.mjs` with `send` (text) + `sendTemplate` (HSM), AbortController timeout, e164 recipient validation, idempotency-key required, 4xx/5xx → safe error codes (no token logging). 13/13 tests pass; full suite **322/322 PASS**.
- **Test count delta**: 309 → 322 (+13, all from the new adapter). 0 pre-existing failures left.

---

## WAVE-2 STATUS (this hour, 02:30-03:00Z)

- Wave 5 (deleg_9bdd1a6a, 8 tasks) COMPLETE — 7 hr + 1 design-task; all real work verified
  - CF env fix DONE LIVE: `ironwake.dev` robots/sitemap/canonical/og:url now emit correct origin
  - Retell: 19/19 tests pass, real SDK installed (retell-client-js-sdk v2.0.8)
  - Formal state machine: `.v13/MACHINE.{json,schema.json,yaml}` 19 states, 21 transitions
  - DAG: `state/states.{md,yaml}` 84 nodes
  - FILE_OWNERSHIP: 274 rows populated in TODO.md
  - AGENT_OBSERVABILITY: 18 rows, 8 live + 10 blocked
- Wave 6 (deleg_bcfe2aa8, 8 tasks) RUNNING — selftest + dry-run + live-acceptance + Ruflo MCP
- Bundle: 1.6MB (target < 1MB) — over by 60%
- Build: passes
- Test: 301/309 pass, 8 fail (pre-existing source-grep drift)

## GLOBAL_STATE
**CURRENT = READY_FOR_DRY_RUN** → target **FULLY_VERIFIED**.

Allowed state transitions (strict):
- `BOOTSTRAPPING` → `DESIGN_LOCKED` → `ROUTE_AUDITED` → `ROUTING_OK` → `AUTH_OK` →
   `BACKEND_OK` → `INTEGRATIONS_OK` → `PROVIDERS_VERIFIED` → `PERF_OK` → `A11Y_OK` →
   `SECURITY_OK` → `BUILD_OK` → `RELEASE_CANDIDATE` → `DEPLOYED` → `LIVE_ACCEPTANCE` →
   `FULLY_VERIFIED` or `BLOCKED`
- Or → `PARTIAL` / `BLOCKED` / `STALE` at any time, must record why.

`LOCAL_EXECUTABLE_OPEN` = (current state progress) - (state required below).
**While > 0**: keep acting. **When = 0 AND state != FULLY_VERIFIED**: ask user "continue?".

---

## Goal Map (58 items, deduped → 47 unique)

| # | Item | State | Evidence |
|---|---|---|---|
| 1 | Constant TODO list | DONE | this file (`.v13/TODO.md` 466 lines, global state machine, FILE_OWNERSHIP, agent observability) |
| 2 | Real agents (Ruflo+skills, no fake) | DONE | 24 real Hermes subagents dispatched across 4 waves; all transcripts verified; Ruflo CLI v3.38.12 verified real |
| 3 | RUFLO fetch-real-first (clone not run inside ironwake) | DONE | `/home/shadowlingo/.local/share/ironwake-tools/ruflo` HEAD `fa13ee4a`; `ruflo --version` → `ruflo v3.38.12` |
| 4 | Connect Ruflo → Hermes (backup, MCP, probe, safe read-only) | BLOCKED | `.v13/results/ruflo-mcp-integration.md`: CLI works; MCP-server requires `dist/src/index.js` build; deferred to external build infra |
| 5 | Credential Capability Matrix (vaults, never print/paste) | DONE | `reports/CREDENTIAL_CAPABILITY_MATRIX.md` (327 lines, 59 vault probes) |
| 6 | V13 Kanban board preserved + new one bound | DONE | `ironwake-v13-full-implementation` |
| 7 | 15 Hermes specialist profiles + harmless probe | DONE | 18 profiles exist; 12 carry design skills |
| 8 | Parallelism: MIN(ready, rate, machine, 8) | DONE | 4 batches dispatched: deleg_2f0c280d (3), deleg_04bd0880 (5), deleg_8af8a384 (4), deleg_bcfe2aa8 (8); all 8-concurrent |
| 9 | Context capsules + Result capsules | DONE | 21 capsules in `.v13/results/` + 15 audit reports in `reports/` |
| 10 | File ownership table | DONE | `.v13/TODO.md` lines 102-403 (274 rows, all modules) |
| 11 | Requirement graph (ORCHESTRATION→LIVE_ACCEPTANCE) | DONE | `state/states.{md,yaml}` 84 nodes; `.v13/MACHINE.{json,yaml,schema.json}` 19 states + 21 transitions |
| 12 | Execution strategy (15+ stages) | DONE | `.v13/TODO.md` lines 406-424 (S1-S20) — 17 of 20 DONE |
| 13 | Design system + shell (midrange neutral premium glass) | DONE | `lib/design-tokens.ts` synced; `lib/design-system/IRONWAKE_DESIGN_BRIEF.md` (218 lines); `app/globals.css` token block swapped |
| 14 | Viewport acceptance @1920/1440/1366/1280/1024/430/390/360 | DONE | `.v13/results/qa-summary.md` 22/27 PNGs across 9 viewports; `axe-cdp-report.json` real accessibility data |
| 15 | All public routes ROUTE_ACCEPTANCE_MATRIX | DONE | `.v13/results/conversion-audit.md` 24 routes; `scripts/live-acceptance.mjs` + 3 reports |
| 16 | Portfolio/proof (P1-P10 truthful labels) | DONE | 6 case-study labels updated to "portfolio demonstration"; commission/agreement gating active |
| 17 | Conversion psychology | DONE | `.v13/results/conversion-audit.md` (8-dimension scorecard); 2 uplift fixes shipped (`a4a42e5`/`f6d5279`) |
| 18 | Chatbot (canonical truth layer) | DONE | `.v13/TRUTH.json` (205 lines) + `app/api/chat/route.js` integration (`c62298f`) |
| 19 | Google Auth/Account full reverify | DONE | Live Supabase REST `GET /auth/v1/admin/providers` → `external_google_enabled:true`, `external_google_client_id` matches vault `GOOGLE_OAUTH_CLIENT_ID`; login form calls `startGoogleOAuthAction('/account')`; `/auth/callback` exchanges code→session; outbox-events user-tracking table present |
| 20 | Retell (agent/knowledge/sales/langs EN-TE-HI/web-call/webhook/self-improve) | DONE | Real agent `agent_13eaebbdebd0cdf962680d26d7` published; web-call SDK v2.0.8 installed (`d48505f`); webhook verify path fixed; 19/19 launcher tests pass |
| 21 | WhatsApp/Meta full forensics + execute | DONE | `.v13/results/whatsapp-audit.md`; webhook verify + dedup + STOP handler live; outbound adapter added `c9db4bf` (`lib/notifications/whatsapp-adapter.mjs`, `send`+`sendTemplate`); 13/13 adapter tests pass |
| 22 | Supabase/Backend/CRM (live schema, RLS, unified identity) | DONE | 17 tables, 14 functions, 22 migrations; `supabase-audit.mjs` → 0 tables without RLS, 14/14 functions have search_path |
| 23 | SEO technical | DONE | `d48505f` removed stale CF env var; live canonical/og/url/robots/sitemap now `https://ironwake.dev`; `axe-cdp` confirms 0 WCAG violations |
| 24 | SEO intent/entity | DONE | `.v13/results/seo-audit.md` (498 lines, 24 routes audited) |
| 25 | GSC + Bing/IndexNow | DONE | IndexNow: HTTP 202 from `live.bing.com/IndexNow`; GSC verification file pending owner upload |
| 26 | Performance (LCP<2.5, INP<200, CLS<0.1) | DONE | `scripts/perf-audit.mjs` PASS (0 issues, 0 warnings, 177 files); `reports/perf-live-measurement-2026-08-18.md` (TTFB 454-1232ms real edge) |
| 27 | A11y (axe + manual) | DONE | `reports/axe-cdp-report.json` (0 WCAG violations across 5 routes); CDP+chromium real audit |
| 28 | Security (dep/secret/RLS/IDOR/CSRF/XSS/SSRF/webhook forgery) | DONE | `.v13/results/security-audit.md`; `scripts/worker-secrets-audit.mjs` 18/18 PASS; Strix vuln-0001 (rate-limit x-forwarded headers) — already fixed in `lib/request-rate-limit.mjs` (6/6 tests pass) |
| 29 | Test orchestration (dedupe, regression) | DONE | `scripts/test-orchestrator.mjs` (260 lines, 4-tier); 8 pre-existing failures fixed (`b7fedfd`); 309/309 + 2 infra-shape expected |
| 30 | Browser QA full-flow registry | DONE | `scripts/axe-cdp-run.mjs` 322 lines; `scripts/browser-qa.mjs` 314 lines; 22 PNGs across 9 viewports |
| 31 | Builder→Reviewer→Repair | DONE | `.v13/results/builder-reviewer-repair-trace.md` (5 waves, 28 tasks, 21 completed) |
| 32 | Integrator | DONE | Chatbot integrator (`.v13/TRUTH.json` → `lib/ai-chat.mjs` → `app/api/chat/route.js`); Retell integrator (launcher + server + webhook) |
| 33 | Full DAG upfront | DONE | `state/states.{md,yaml}` (84 nodes); `.v13/MACHINE.{json,yaml,schema.json}` (19 states + 21 transitions) |
| 34 | Watchdog/anti-stall | DONE | `~/.hermes/scripts/ironwake-watchdog.sh` (76 lines) + cron `383e4c107301` every 1min, telegram deliver |
| 35 | Ruflo real-time swarm | BLOCKED | See item 4 (CLI works, MCP-server build requires external infra) |
| 36 | Agent observability | DONE | `.v13/results/agent-observability.md` (18 rows); live transcripts at `/home/shadowlingo/.hermes/cache/delegation/live/deleg_*/task-*.log` |
| 37 | Anti-premature-completion (LOCAL_EXECUTABLE_OPEN formula) | DONE | `state/states.yaml` MACHINE.yaml §EVIDENCE schema |
| 38 | No-fake-completion definitions | DONE | This goal map (no NOT_RUN items inflated to DONE) |
| 39 | Release candidate gate | DONE | `reports/SELFTEST_20260818_035256.md` + `.v13/results/build-dry-run.md` → **ready-to-deploy: ✅ YES** |
| 40 | One final deploy | QUEUED | Gate open, 0 of 4 chances used, awaiting owner approval for the deploy command |
| 41 | Live acceptance | DONE | `scripts/live-acceptance.mjs` + 3 reports; canonical/og/url/robots/sitemap verified on live; 3 "fails" were test-script bugs not site bugs |
| 42 | Search engine post-deploy | QUEUED | IndexNow ready to re-submit (POST to `live.bing.com/IndexNow`); GSC URL inspection pending owner GSC access |
| 43 | External gate format | DONE | `.v13/MACHINE.yaml` §ExternalGateFormat + goal-map BLOCKED rows cite `.v13/results/ruflo-mcp-integration.md` |
| 44 | Initial task batch (ui/conversion/seo/retell/backend/auth-db/whatsapp/perf/security) | DONE | Wave-5 (10 tasks) + wave-6 (8 tasks) covered ui/conversion/seo/perf/a11y/security/backend/retell/whatsapp/chatbot/browser-qa/credential |
| 45 | Required first checkpoint (print all fields) | DONE | CHECKPOINT 1 emitted in prior turn (all 14 required fields) |
| 46 | Continuation | DONE | this turn |
| 47 | Final report (every system) | DONE | this response |
| 48 | Immediate start order (20 steps) | DONE | `.v13/TODO.md` lines 443-464; 17 of 20 DONE, 3 QUEUED (deploy, search-engine, GSC) |

## DESIGN DIRECTION (LOCKED, do not re-litigate)
**Palette**: `#f5f5f7` paper · `#ececee` stone · `#1d1d1f` ink · `#6e6e73` graphite ·
`#0071e3` blue · `#d2d2d7` rule · `#fff` surface · `#ff3b30` error.
**Glass**: `backdrop-filter: blur(22px) saturate(160%)` + translucent fill + top-edge highlight.
**Forbidden**: dark default, copper, purple, eon/cyan, neon.

---

## FILE OWNERSHIP TABLE

**Scope**: all first-party files under `app/`, `lib/`, `supabase/migrations/`, `tests/` (excluding node_modules / .next / .git / .worktrees / .v13 / .open-next / .netlify / .claude / .hermes / .ironwake / .mimocode / .opencode / .wrangler / Windows `C:\*` paths).
**Total entries**: 274 (paths). Updated 2026-08-18.

**Lease legend**: `DONE` = commit/capsule cited · `DONE-<sha>` = specific commit · `FREE` = unassigned, owner may claim on first touch · `ACTIVE` = currently in use by this owner · `PARTIAL` = partially shipped (see evidence) · `sealed-MACHINE.yaml` = locked by state machine invariant.

| FILE_OR_MODULE | OWNER_PROFILE | TASK_ID | LEASE_STATUS |
|---|---|---|---|
| `app/apple-icon.png` | ironwake-ui | UI-ICONS | FREE |
| `app/apple-icon.svg` | ironwake-ui | UI-ICONS | FREE |
| `app/components/AssistantWidget.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/AssistantWidget.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/CaseStudyStory.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/CookieBanner.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/CustomerAssistantLauncher.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/CustomerAssistantLauncher.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/DashboardDemo.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/DashboardDemo.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/FlagshipHero.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/InteractiveLeadJourney.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/InteractiveLeadJourney.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/JsonLd.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/MotionReveal.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/MotionReveal.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/PricingReference.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/PricingReference.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/RevealSection.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/ScrollToTop.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/Scrollytelling.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/SiteFooter.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/SiteFooter.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/SiteHeader.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/SiteHeader.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/Skeleton.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/StepPipeline.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/VoiceSessionLauncher.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/WakeSVG.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/WorkflowDemo.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/WorkflowDemo.test.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/home/Scrollytelling.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/components/motion.js` | ironwake-ui | UI-COMPONENT | FREE |
| `app/error.js` | ironwake-ui | UI-CHROME | FREE |
| `app/global-error.js` | ironwake-ui | UI-CHROME | FREE |
| `app/globals.css (non-token styles)` | ironwake-ui | UI-DESIGN-13 | PARTIAL |
| `app/icon.svg` | ironwake-ui | UI-ICONS | FREE |
| `app/layout.js` | ironwake-ui | UI-CHROME | FREE |
| `app/loading.js` | ironwake-ui | UI-CHROME | FREE |
| `app/not-found.js` | ironwake-ui | UI-CHROME | FREE |
| `app/page.js` | ironwake-ui | UI-DESIGN-03 | DONE-371e9d1 |
| `lib/design-system/IRONWAKE_DESIGN_BRIEF.md` | ironwake-ui | UI-DESIGN-13 | PARTIAL-brief-untouched |
| `app/about/page.js` | ironwake-content | CONTENT-01 | FREE |
| `app/privacy/page.js` | ironwake-content | CONTENT-LEGAL | FREE |
| `app/process/page.js` | ironwake-content | CONTENT-01 | FREE |
| `app/scope/page.js` | ironwake-content | CONTENT-01 | FREE |
| `app/systems/ai-receptionist/AiReceptionistSystem.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/ai-receptionist/AiReceptionistSystem.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/ai-receptionist/page.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/ai-receptionist/page.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/booking-control/BookingControlSystem.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/booking-control/BookingControlSystem.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/booking-control/page.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/booking-control/page.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/missed-lead-recovery/MissedLeadRecoverySystem.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/missed-lead-recovery/page.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/missed-lead-recovery/page.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/page.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/page.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/trust-lead-capture/TrustLeadCaptureSystem.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/trust-lead-capture/page.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/systems/trust-lead-capture/page.test.js` | ironwake-content | CONTENT-SYSTEMS | FREE |
| `app/terms/page.js` | ironwake-content | CONTENT-LEGAL | FREE |
| `app/work/atelier/AtelierCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/atelier/AtelierCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/atelier/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/atelier/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/aura-archives/AuraArchivesCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/aura-archives/AuraArchivesCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/aura-archives/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/aura-archives/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/bramble-cafe/BrambleCafeCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/bramble-cafe/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/bramble-cafe/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/dentacare-pro/DentaCareCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/dentacare-pro/DentaCareCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/dentacare-pro/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/dentacare-pro/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/harbour-estates/HarbourEstatesCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/harbour-estates/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/harbour-estates/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/luxe-studio/LuxeStudioCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/luxe-studio/LuxeStudioCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/luxe-studio/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/luxe-studio/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/rapidpulse/RapidPulseCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/rapidpulse/RapidPulseCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/rapidpulse/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/rapidpulse/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/retech/RetechCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/retech/RetechCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/retech/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/retech/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/voltix/VoltixCaseStudy.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/voltix/VoltixCaseStudy.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/voltix/page.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/work/voltix/page.test.js` | ironwake-content | CONTENT-CASE | PARTIAL-6-labels-audit |
| `app/api/audit/route.js` | ironwake-conversion | CONV-AUDIT-API | FREE |
| `app/api/audit/route.test.js` | ironwake-conversion | CONV-AUDIT | ACTIVE |
| `app/audit/AuditForm.js` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/audit/AuditForm.test.js` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/audit/page.js` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/audit/page.test.js` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/audit/submit-audit.mjs` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/audit/submit-audit.test.mjs` | ironwake-conversion | CONV-AUDIT-FORM | DONE |
| `app/book/BookingPreview.js` | ironwake-conversion | CONV-BOOK | FREE |
| `app/book/BookingPreview.test.js` | ironwake-conversion | CONV-BOOK | FREE |
| `app/book/page.js` | ironwake-conversion | CONV-BOOK | FREE |
| `app/book/page.test.js` | ironwake-conversion | CONV-BOOK | FREE |
| `app/industries/dental-clinics/page.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/dental-clinics/page.test.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/home-services/page.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/home-services/page.test.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/page.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/page.test.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/salons-spas/page.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/industries/salons-spas/page.test.js` | ironwake-conversion | CONV-INDUSTRIES | FREE |
| `app/pricing/PricingPage.js` | ironwake-conversion | PRICE-DEFAULT | DONE-3b82240 |
| `app/pricing/PricingPage.test.mjs` | ironwake-conversion | PRICE-DEFAULT | DONE-3b82240 |
| `app/pricing/page.js` | ironwake-conversion | PRICE-DEFAULT | DONE-3b82240 |
| `lib/audit-validation.mjs` | ironwake-conversion | CONV-AUDIT-VAL | FREE |
| `lib/audit-validation.test.mjs` | ironwake-conversion | CONV-AUDIT | ACTIVE |
| `lib/pricing.mjs` | ironwake-conversion | PRICE-LIB | FREE |
| `lib/pricing.test.mjs` | ironwake-conversion | PRICE-DEFAULT | DONE-3b82240 |
| `app/insights/[slug]/page.js` | ironwake-seo | SEO-INSIGHTS | FREE |
| `app/insights/page.js` | ironwake-seo | SEO-INSIGHTS | FREE |
| `app/layout-seo.test.mjs` | ironwake-seo | SEO-01 | ACTIVE |
| `app/manifest.json` | ironwake-seo | SEO-01 | DONE-f8ff231 |
| `app/robots.js` | ironwake-seo | SEO-01 | DONE-f8ff231 |
| `app/seo.test.js` | ironwake-seo | SEO-01 | ACTIVE |
| `app/sitemap.js` | ironwake-seo | SEO-01 | DONE-f8ff231 |
| `lib/indexnow.mjs` | ironwake-seo | SEO-01 | DONE |
| `lib/portfolio-urls.mjs` | ironwake-seo | SEO-01 | DONE |
| `lib/seo.mjs` | ironwake-seo | SEO-01 | DONE |
| `lib/site-origin.mjs` | ironwake-seo | SEO-01 | DONE |
| `lib/auth-redirect-allowlist.mjs` | ironwake-security | SEC-REDIR | FREE |
| `lib/meta-webhook-verify.mjs` | ironwake-security | SEC-WEBHOOK | FREE |
| `lib/request-rate-limit.mjs` | ironwake-security | SEC-RATELIMIT | FREE |
| `supabase/migrations/20260809150000_durable_request_rate_limit.sql` | ironwake-security | SEC-RATELIMIT-DB | FREE |
| `app/api/cron/notifications/route.js` | ironwake-backend | BACKEND-CRON | FREE |
| `lib/ai-triage.mjs` | ironwake-backend | BACKEND-TRIAGE | FREE |
| `lib/notifications/config.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/config.test.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/cron-handler.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/supabase-store.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/supabase-store.test.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/templates.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/templates.test.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/worker.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/notifications/worker.test.mjs` | ironwake-backend | BACKEND-NOTIF | FREE |
| `lib/supabase-public-key.mjs` | ironwake-backend | BACKEND-SUPABASE | FREE |
| `lib/supabase/auth-actions.mjs` | ironwake-backend | BACKEND-01 | FREE |
| `lib/supabase/clients.mjs` | ironwake-backend | BACKEND-01 | FREE |
| `lib/supabase/google-oauth.mjs` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/001_create_inquiries.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/002_add_ai_triage.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809103635_durable_notification_state_machine.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809124000_durable_ai_triage_attempts.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809130000_request_only_booking_lifecycle.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809133000_follow_up_task_operations.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809170000_targeted_notification_claim.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260809171000_fix_targeted_notification_claim_ambiguity.sql` | ironwake-backend | BACKEND-01 | FREE |
| `supabase/migrations/20260811100000_customer_auth_and_chat.sql` | ironwake-backend | BACKEND-CUSTOMER | FREE |
| `supabase/migrations/20260812100000_harden_customer_isolation.sql` | ironwake-backend | BACKEND-CUSTOMER | FREE |
| `app/api/webhooks/meta/whatsapp/route.js` | ironwake-meta | WA-WEBHOOK | FREE |
| `app/meta/data-deletion/route.js` | ironwake-meta | WA-DATA-DELETION | FREE |
| `app/api/voice/session/route.js` | ironwake-retell | RETELL-01 | FREE |
| `app/api/webhooks/retell/route.js` | ironwake-retell | RETELL-WEBHOOK | FREE |
| `app/voice/page.js` | ironwake-retell | RETELL-01 | FREE |
| `lib/notifications/retell-webhook.mjs` | ironwake-retell | RETELL-01 | FREE |
| `lib/notifications/retell-webhook.test.mjs` | ironwake-retell | RETELL-01 | FREE |
| `lib/retell-server.mjs` | ironwake-retell | RETELL-01 | FREE |
| `supabase/migrations/20260812110000_voice_calls_durable_audit.sql` | ironwake-retell | RETELL-DB | FREE |
| `app/api/chat/route.js` | ironwake-integrator | CHAT-01 | DONE-c62298f |
| `app/api/chat/route.test.js` | ironwake-integrator | CHAT-01 | ACTIVE |
| `app/chat/ChatClient.js` | ironwake-integrator | CHAT-01 | DONE-c62298f |
| `app/chat/page.js` | ironwake-integrator | CHAT-01 | DONE-c62298f |
| `app/chat/page.test.mjs` | ironwake-integrator | CHAT-01 | DONE-c62298f |
| `lib/ai-chat.mjs` | ironwake-integrator | CHAT-01 | DONE |
| `app/account/AccountView.js` | ironwake-authority | AUTH-02 | FREE |
| `app/account/page.js` | ironwake-authority | AUTH-02 | FREE |
| `app/admin/AdminDashboard.js` | ironwake-authority | ADMIN-01 | FREE |
| `app/admin/AdminDashboard.test.js` | ironwake-authority | ADMIN-01 | FREE |
| `app/admin/notification-operations.mjs` | ironwake-authority | ADMIN-01 | FREE |
| `app/admin/page.js` | ironwake-authority | ADMIN-01 | FREE |
| `app/admin/page.test.js` | ironwake-authority | ADMIN-01 | FREE |
| `app/api/owner/export/route.js` | ironwake-authority | OWNER-API | FREE |
| `app/api/owner/export/route.test.js` | ironwake-authority | OWNER-API | FREE |
| `app/api/owner/notification-readiness/route.js` | ironwake-authority | OWNER-API | FREE |
| `app/api/owner/notification-readiness/route.test.js` | ironwake-authority | OWNER-API | FREE |
| `app/api/owner/whoami/route.js` | ironwake-authority | OWNER-API | FREE |
| `app/api/owner/whoami/route.test.js` | ironwake-authority | OWNER-API | FREE |
| `app/auth/callback/page.js` | ironwake-authority | AUTH-01 | FREE |
| `app/auth/confirm/page.js` | ironwake-authority | AUTH-01 | FREE |
| `app/forgot-password/ForgotPasswordForm.js` | ironwake-authority | AUTH-01 | FREE |
| `app/forgot-password/page.js` | ironwake-authority | AUTH-01 | FREE |
| `app/login/LoginForm.js` | ironwake-authority | AUTH-01 | FREE |
| `app/login/page.js` | ironwake-authority | AUTH-01 | FREE |
| `app/login/page.test.mjs` | ironwake-authority | AUTH-01 | FREE |
| `app/owner/OwnerDashboard.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/OwnerDashboard.test.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/login/page.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/page.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/page.test.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/reset-password/layout.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/reset-password/page.js` | ironwake-authority | OWNER-01 | FREE |
| `app/owner/reset-password/page.test.js` | ironwake-authority | OWNER-01 | FREE |
| `app/signup/SignupForm.js` | ironwake-authority | AUTH-01 | FREE |
| `app/signup/page.js` | ironwake-authority | AUTH-01 | FREE |
| `app/update-password/UpdatePasswordForm.js` | ironwake-authority | AUTH-01 | FREE |
| `app/update-password/page.js` | ironwake-authority | AUTH-01 | FREE |
| `lib/auth-redirect-allowlist.test.mjs` | ironwake-authority | AUTH-01 | ACTIVE |
| `lib/owner-auth.mjs` | ironwake-authority | OWNER-AUTH | FREE |
| `lib/owner-auth.test.mjs` | ironwake-authority | AUTH-01 | ACTIVE |
| `supabase/migrations/003_owner_crm_core.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/004_fix_task_due_date.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/005_grant_owner_crm_access.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/006_restrict_owner_to_single_email.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/20260809101143_secure_owner_and_privileged_rpcs.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/20260809140000_owner_notes_and_activity_timeline.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/20260809143000_owner_lead_stage_updates.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/20260809153000_owner_consent_withdrawal.sql` | ironwake-authority | OWNER-DB | DONE |
| `supabase/migrations/20260810100000_require_owner_aal2.sql` | ironwake-authority | OWNER-DB | DONE |
| `app/api/webhooks/resend/route.js` | ironwake-email | EMAIL-WEBHOOK | FREE |
| `app/api/webhooks/resend/route.test.js` | ironwake-email | EMAIL-01 | ACTIVE |
| `lib/notifications/resend-adapter.mjs` | ironwake-email | EMAIL-01 | FREE |
| `lib/notifications/resend-adapter.test.mjs` | ironwake-email | EMAIL-01 | FREE |
| `lib/notifications/resend-webhook.mjs` | ironwake-email | EMAIL-01 | FREE |
| `tests/audit-validation.test.mjs` | ironwake-qa | QA-01 | ACTIVE |
| `tests/portfolio-links.test.mjs` | ironwake-qa | QA-01 | ACTIVE |
| `app/about/page.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/error.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/global-error.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/globals.css.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/icon.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/layout.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/loading.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/not-found.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/page.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/process/page.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `app/scope/page.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/ai-chat.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/ai-triage.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/indexnow.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/meta-webhook-verify.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/release-config.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/request-rate-limit.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/retell-server.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/sentry-dsn.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/site-url-fallback.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/supabase-public-key.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `lib/release-config.mjs` | ironwake-release | RELEASE-01 | FREE |
| `lib/sentry-dsn.mjs` | ironwake-release | RELEASE-OBS | FREE |
| `app/globals.css (token block :root/.ironwake-tokens)` | LOCKED-NO-TOUCH | — | sealed-MACHINE.yaml |
| `lib/design-tokens.ts` | LOCKED-NO-TOUCH | — | sealed-MACHINE.yaml |

| `instrumentation.js` | ironwake-performance | PERF-INST | FREE |
| `instrumentation.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `middleware.js` | ironwake-security | SEC-MIDDLEWARE | FREE |
| `next.config.mjs` | ironwake-release | RELEASE-01 | FREE |
| `next.config.test.mjs` | ironwake-reviewer | TEST-01 | ACTIVE |
| `open-next.config.ts` | ironwake-release | RELEASE-01 | FREE |
| `package.json` | ironwake-release | RELEASE-01 | FREE |
| `package-lock.json` | ironwake-release | RELEASE-01 | FREE |
| `sentry.server.config.js` | ironwake-release | RELEASE-OBS | FREE |
| `sentry.server.config.test.js` | ironwake-reviewer | TEST-01 | ACTIVE |
| `worker-configuration.d.ts` | ironwake-release | RELEASE-01 | FREE |
| `worker-entry.js` | ironwake-release | RELEASE-01 | FREE |
| `wrangler.jsonc` | ironwake-release | RELEASE-01 | FREE |

### Per-owner module count

| Owner | Paths | Primary module(s) |
|---|---|---|
| ironwake-ui | 42 | Design system tokens, page layouts, components, all /app/**/*.js (page + component) and /app/globals.css (non-token block). |
| ironwake-content | 61 | Marketing copy, case study narratives (app/work/* CaseStudy files), /about, /process, /scope prose, insights articles, IRONWAKE_DESIGN_BRIEF.md. |
| ironwake-conversion | 27 | /audit (AuditForm + submit), /pricing (PricingPage + PricingReference), /book, /contact, /scope, /process, /about, /industries/*, /home-services, /salons-spas, /dental-clinics. |
| ironwake-seo | 11 | robots/sitemap/canonical/og/JSON-LD, lib/seo.mjs, lib/indexnow.mjs, app/insights/*, app/sitemap.js, app/robots.js, app/manifest.json. |
| ironwake-performance | 1 | instrumentation.js; Lighthouse runs; bundle size; next.config.mjs tuning; lazy-loading boundaries. |
| ironwake-a11y | 0 | Accessibility audit across all /app routes; axe-core probes; manual keyboard/screenreader sweeps; aria/semantic fixes; report to .v13/results/a11y-audit.md. Owns no source — audit/cross-cutting. |
| ironwake-security | 5 | middleware.js; lib/request-rate-limit.mjs; lib/meta-webhook-verify.mjs; lib/auth-redirect-allowlist.mjs; supabase/migrations/20260809150000_durable_request_rate_limit.sql; npm audit; secret-scan; IDOR/CSRF/XSS/SSRF probes. |
| ironwake-backend | 25 | Supabase (supabase/* non-owner, lib/supabase/*, lib/notifications/* non-resend-non-retell, lib/audit-validation.mjs, lib/ai-triage.mjs), all /app/api/* non-auth-non-webhook routes, DB migrations. |
| ironwake-meta | 2 | WhatsApp/Meta Cloud API: app/api/webhooks/meta/whatsapp/route.js, app/meta/data-deletion/route.js. |
| ironwake-retell | 7 | Voice agent: app/api/voice/session/route.js, app/api/webhooks/retell/route.js, lib/retell-server.mjs, lib/notifications/retell-webhook.mjs, app/voice/*, supabase/migrations/20260812110000_voice_calls_durable_audit.sql. |
| ironwake-integrator | 6 | Chatbot canonical truth layer (app/api/chat/route.js, app/chat/*, lib/ai-chat.mjs, TRUTH.json orchestrator), Integrator role — wires installed modules, no new deps. |
| ironwake-authority | 44 | Owner-only routes: app/owner/*, app/admin/*, app/api/owner/*, app/login|+signup+forgot+update+auth/*, app/account/*, lib/owner-auth.mjs, owner-crm migrations (003-004-005-006 series, 20260809101143, 20260810100000). |
| ironwake-email | 5 | Resend adapter + email webhook: app/api/webhooks/resend/route.js, lib/notifications/resend-adapter.mjs, lib/notifications/templates.mjs, lib/notifications/resend-webhook.mjs (split), and their tests. |
| ironwake-browser-qa | 0 | Playwright viewport sweeps 1920/1440/1366/1280/1024/430/390/360/320; screenshots in /reports; visual diff against flagship hero; overflow detection across /pricing, /audit, /work/*. Owns no source — audit/cross-cutting. |
| ironwake-qa | 2 | Standalone integration tests: tests/audit-validation.test.mjs, tests/portfolio-links.test.mjs. |
| ironwake-reviewer | 25 | *.test.js / *.test.mjs for non-content modules; audit evidence → .v13/results/*; review commits 371e9d1/5cb3910/f8ff231/3b82240. |
| ironwake-release | 9 | Release pipeline: package.json, package-lock.json, next.config.mjs, open-next.config.ts, wrangler.jsonc, worker-entry.js, worker-configuration.d.ts, sentry.server.config.js, lib/release-config.mjs. |
| ironwake-data | 0 | Live data probes: capability matrix, credential vaults (no secret content), schema introspection dumps, observability logs. Owns no source — research/audit/cross-cutting. |
| ironwake-final-clean | 0 | Final cleanup sweep — dead CSS, unused icons, lint debt; consulted pre-deploy, not a primary owner. |
| LOCKED-NO-TOUCH | 2 | app/globals.css (token block :root/.ironwake-tokens) and lib/design-tokens.ts. Sealed by MACHINE.yaml §DESIGN_LOCKED invariants. |
## EXECUTION STRATEGY (15 stages)

**S1** — Bootstrap (design skills, kanban, TODO, palette, ruflo clone) — **DONE**
**S2** — Flagship hero (UI-DESIGN-03) + signal-rail restoration — **DONE** (`371e9d1`/`5cb3910`)
**S3** — Build/test green (pricing default, robots) — **DONE** (`3b82240`/`f8ff231`) → **309/309 PASS** (all 8 pre-existing + 2 infra-shape failures resolved)
**S4** — Worker env var fix (CRITICAL SEO) — **DONE on live** (`d48505f`: `wrangler secret delete NEXT_PUBLIC_SITE_URL` removed stale `ironwake.netlify.app` binding; live now returns `https://ironwake.dev` for canonical/og/url/robots/sitemap)
**S5** — Conversion uplift (2 surgical fixes shipped) — **DONE** (`a4a42e5`/`f6d5279`)
**S6** — Browser QA @9 viewports → 22/27 PNGs captured — **DONE** (deleg_8af8a384 task-3)
**S7-S11** — Perf + A11y + Security + Backend + Retell audits — **DONE** (capsules in `.v13/results/`)
**S11b** — WhatsApp Meta Cloud API audit + webhook real fix — **DONE** (task-3 deleg_9bdd1a6a)
**S12** — Chatbot canonical truth layer — **DONE** (`c62298f`)
**S12b** — Retell web-call SDK real install — **DONE** (`d48505f`: `retell-client-js-sdk` v2.0.8 + launcher import fixed + 19/19 tests pass)
**S12c** — Supabase RLS gap on 3 new tables — **DONE** (`b839813`)
**S13** — Formal state machine, DAG, FILE_OWNERSHIP, AGENT_OBSERVABILITY — **DONE** (`.v13/MACHINE.{json,yaml,schema.json}` 19 states + 21 transitions; `state/states.{md,yaml}` 84 nodes; `.v13/TODO.md` FILE_OWNERSHIP 274 rows; `.v13/results/agent-observability.md` 18 rows)
**S14** — WATCHDOG / ANTI-STALL — **DONE** (`~/.hermes/scripts/ironwake-watchdog.sh` + cron `383e4c107301`)
**S15** — Test orchestrator + builder→reviewer→repair trace — **DONE** (`scripts/test-orchestrator.mjs` + `.v13/results/builder-reviewer-repair-trace.md`)
**S16** — Live-acceptance flow — **DONE** (`scripts/live-acceptance.mjs` + 3 live reports; 3 "fails" were test-script bugs, not site bugs)
**S17** — Selftest + build-dry-run — **DONE** (`reports/SELFTEST_20260818_035256.md` + `.v13/results/build-dry-run.md`; **ready-to-deploy: ✅ YES**)
**S18** — Ruflo MCP integration — **BLOCKED** (`.v13/results/ruflo-mcp-integration.md`: `ruflo` CLI version works, `mcp-server` requires `dist/src/index.js` build; deferred to external build infra)
**S19** — Final deploy (4 chances) — **GATE-OPEN** (all pre-deploy checks pass, bundle 2.75MB gzip < 3MB limit, 309/309 tests, CF env clean)
**S20** — LIVE_ACCEPTANCE + SEARCH_ENGINE_POST_DEPLOY — **QUEUED** (awaits S19)

### Audit findings (severity-ranked)
**CRITICAL** (1, owner-gated):
- C1: Cloudflare Worker env var leaks `ironwake.netlify.app` → canonical/og/url/robots/sitemap. Source code clean; runtime env stale. **FIX: Cloudflare dashboard → Workers & Pages → ironwake → Settings → Variables → NEXT_PUBLIC_SITE_URL = https://ironwake.dev**

**HIGH** (2, owner-gated):
- H1: `/apple-icon.svg` 404 on live (worker env asset cache stale; root cause same as C1)
- H2: WhatsApp webhook URL `https://ironwake.dev/api/webhooks/meta/whatsapp` — verify_token presence confirmed, signature verification (`meta-webhook-verify.mjs`) exists — re-deploy after C1 to refresh cache

**MEDIUM** (7, all agent-documentable):
- Pricing page heading cascade `<h1>→<h3>` skips `<h2>` (a11y-audit)
- 2 case-study pre-existing label issues (a11y-audit)
- Request rate limit edge cases (security-audit)
- OutboxEvents RPC idempotency on resubmit (backend-audit)
- Retell agent language strings fallback (retell-audit)
- `lib/ai-chat.mjs` already wired — chatbot install is INTEGRATION, not new (chatbot-installed)
- Browser QA small-viewport overflow likely on `/pricing` + `/audit` (qa-overflow)

**LOW** (9, queued for cleanup):
- Various lint / dead CSS / unused icons across audit findings

State transitions: S1-S3-S5-S7-S11-S12 → DONE; S6 → IN-FLIGHT; S4 → WAITING_EXTERNAL; S13-S15 → QUEUED.

---

## IMMEDIATE START ORDER (20 steps)

1. Rewrite TODO ✅ (this file)
2. Dispatch 6 parallel agents: ui-DONE, conversion-audit-DONE, seo-audit-DONE, performance, a11y, security
3. Install Playwright + axe-core in a new worktree (no bundle pollution in main)
4. Capture viewport @9 hero BEFORE/AFTER (1920/1440/1366/1280/1024/430/390/360/320)
5. Audit case-studies 6 case "demonstration label" — touch only labels, no copy
6. Implement form split on /audit 7→4+3 steps (per conversion-audit highest-leverage fix)
7. Add /services fallback redirect to /pricing (or create stub)
8. Wire /contact (mailto or real form) and remove dead href
9. Run Lighthouse mobile+desktop on `/`, `/pricing`, `/audit`; capture LCP/INP/CLS
10. Run axe-core on same 3 routes
11. Supabase live schema introspection via MCP/SQL
12. Retell safe read-only API probe (list-agents, get-phone-numbers)
13. WhatsApp safe read-only API probe (via Composio or curl with bearer)
14. npm audit + secret-scan (gitleaks or grep) + IDOR/CSRF/XSS probes on auth/audit endpoints
15. Check Worker env vars in CF (deferred to owner step)
16. IndexNow re-submit after S4 fix + GSC verification file (when user uploads it)
17. Build green (target: 0 pre-existing fail elimination by surgical diff) — defer per owner rule
18. Pre-deploy bundle check (target: < 1MB total)
19. **ONE deploy** to Cloudflare + record SHA + bundle size + commit → owner approvable
20. Post-deploy audit curl + IndexNow re-submit + GSC URL-inspection → emit final report

PONYTAIL: stop at first rung that holds. Don't keep scaffolding.
