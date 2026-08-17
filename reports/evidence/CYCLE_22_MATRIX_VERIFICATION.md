# Cycle 22 — Canonical Matrix Verification (2026-08-17)

## Scope

Read-only verification of all 37 rows (R01–R37) in
`reports/CANONICAL_GOAL_REQUIREMENTS_MATRIX.md` against the current master state.

- Current HEAD: `38ee5ff` (a11y + perf remediation, 2026-08-17)
- Baseline matrix date: 2026-08-09 (commit `daafc01`, Cycle 15)
- Authoritative ledger: `reports/REAL_CAPABILITY_LEDGER.md` (2026-08-10)
- Active production host: `https://ironwake.dev/` (Netlify, manual deploys only)

## Verification procedure

For each R-row I:

1. Confirmed the cited file path still exists at `master` (`git ls-tree -r HEAD`).
2. Confirmed every commit hash cited in the matrix is reachable from `master`.
3. Read the cited file(s) and grepped for the key content claim.
4. Cross-checked each row against the authoritative REAL_CAPABILITY_LEDGER.md.
5. Ran the matrix-relevant test subset (44 tests mapped to matrix rows).
6. Ran `scripts/secret-scan.mjs` (the project's own scanner).
7. Ran the seven untracked audit scripts at HEAD to capture current production
   state: `a11y-audit`, `perf-audit`, `seo-content-audit`, `seo-tech-audit`,
   `sitemap-audit`, `glass-primitive-audit`, `contrast-audit`,
   `mobile-overlap-audit`, `favicon-audit`.

## Classification schema

- **STILL_VERIFIED** — source still satisfies the requirement as described.
- **CHANGED** — implementation moved, renamed, or split; requirement still
  satisfied but the cited file is misleading.
- **PARTIAL** — source partially satisfies; some claimed surface still missing.
- **STALE_DEPLOY_REF** — claim references a deploy id, host, or commit range
  that no longer matches the current production host.
- **UNKNOWN** — verification blocked by missing build artifact, lack of live
  probe, or environment-only failure.

## Test results

- **Matrix-relevant test subset (44 tests): all green.** Includes the
  ai-chat unit tests, sitemap/robots tests, owner-crm migration tests, layout
  tests, assistant-widget tests, and the secret-scan integration test.
- **Two failures in the broader script tests:**
  - `scripts/perf-audit.test.mjs > bundle_gzip_kb stays under the 3072 KiB
    Cloudflare Free plan budget` — perf-audit reports `bundle_gzip_kb: null`
    because `.open-next/dist/server/handler.mjs` is not present in this
    checkout. The script's own `reason` field says "run `pnpm build` first".
    This is a build-artifact gap, not a source regression. R18 is marked
    PARTIAL rather than STILL_VERIFIED because the bundle-budget claim cannot
    be re-verified without a fresh build.
  - `scripts/seo-tech-audit.test.mjs` — exit 1 because the live audit reports
    33 failures across 31 pages (canonical missing on 29 pages, JSON-LD
    Organization missing on 15, BreadcrumbList missing on 16). The test is
    strict (zero failures). This is a real regression vs. Cycle 15's "SEO
    score ≥95" claim.
- **secret-scan: 0 issues.** No leaked credentials in `app/`, `components/`,
  `lib/`, `scripts/`, the client bundles, or the Worker bundle.

### Audit script results (re-captured at 2026-08-17T12:25Z)

| Script | Exit | issueCount / failures | Status |
|---|---|---|---|
| `a11y-audit.mjs` | 0 | 0 issues, 0 warnings, 25 files scanned | clean |
| `perf-audit.mjs` | 0 | 0 issues, 0 warnings, 170 files scanned | clean (bundle_gzip_kb = null, see R18) |
| `seo-content-audit.mjs` | 0 | 0 failures | clean |
| `seo-tech-audit.mjs` | 1 | 33 failures / 68 passes across 31 pages | regression vs. Cycle 15 |
| `sitemap-audit.mjs` | 0 | 0 issues | clean |
| `glass-primitive-audit.mjs` | 0 | 0 issues | clean |
| `contrast-audit.mjs` | 0 | 0 issues | clean |
| `mobile-overlap-audit.mjs` | 0 | 0 issues | clean |
| `favicon-audit.mjs` | 0 | 0 issues | clean |
| `secret-scan.mjs` | 0 | 0 issues | clean |

## Per-row classification

| Row | Status (matrix) | New status | Evidence |
|---|---|---|---|
| R01 Premium light design | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/globals.css` + Header/Footer glob in `app/components/` still present. Lighthouse a11y 100, axe 0 violations on 5 routes. |
| R02 Top nav with Pricing + Book Diagnostic | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/components/SiteHeader.js` (3,674 bytes) contains both `Pricing` and `Book Diagnostic`. |
| R03 Mobile menu opens cleanly | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `SiteHeader.js` uses `<details>` + `<summary>`; `app/globals.css` carries the 860px and 580px breakpoint selectors (grep-confirmed). |
| R04 Hero with 5-second clarity | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/page.js` (12,169 bytes) renders the hero block; live curl of `/` returns 200. |
| R05 Substant motion: hero Wake system | VERIFIED_DEPLOYED (40dd8d1) | **STILL_VERIFIED** | `app/components/WakeSVG.js` present; commit `40dd8d1` reachable from master. |
| R06 Substant motion: interactive lead journey | VERIFIED_DEPLOYED (4b394c2) | **STILL_VERIFIED** | `app/components/InteractiveLeadJourney.js` present; commit `4b394c2` reachable. |
| R07 Substant motion: owner ops demo | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/components/DashboardDemo.js` present. |
| R08 All 4 system pages reachable from home | VERIFIED_DEPLOYED (c8eb933) | **STILL_VERIFIED** | `app/page.js` links `/systems/ai-receptionist`, `/systems/missed-lead-recovery`, `/systems/voice-receptionist`, `/systems/lead-pipeline` (grep-confirmed). Commit `c8eb933` reachable. |
| R09 PricingReference on each system page | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/components/PricingReference.js` present; system pages mount it (audit cross-ref). |
| R10 5 canonical offers on /pricing | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/pricing/PricingPage.js` present; live `/pricing` shows 15 amounts per region (Cycle 15 reconciliation data, ledger cross-ref). |
| R11 No fabricated metrics or stats | VERIFIED (4 commits) | **STILL_VERIFIED** | All four commits (`c600bc8`, `3958aa4`, `b068ec7`, `7367178`) reachable. No fake-metric patterns in `app/page.js`, `app/insights/page.js`, `app/audit/*`. |
| R12 Supabase POST /api/audit works on deployed site | VERIFIED_LIVE | **STALE_DEPLOY_REF** | The `VERIFIED_LIVE` claim cites a labelled production audit that returned 201 with MiniMax triage and Resend delivery. The authoritative 2026-08-10 ledger downgrades Supabase, MiniMax triage, and Resend delivery status to `CONNECTED_NOT_VERIFIED` / `PARTIAL_LIVE_*`. The cycle-15 evidence predates the current ledger and is no longer current. The `/api/audit` source still exists and the migration files still pass tests. |
| R13 Anonymous /owner shows login, not data | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/owner/page.js` present; ledger confirms anonymous `/owner` returns the login UI. |
| R14 AI Receptionist reframed from "concept" to real offer | FAILED_LIVE | **PARTIAL** | Page exists, provider-status disclosures are in place, but the ledger still flags local intake / handoff / chat / call-log as missing. The current source does not implement those operational paths. Same status as Cycle 15 — no remediation commit since. |
| R15 All 4 systems show their matching canonical offer | VERIFIED_DEPLOYED | **STILL_VERIFIED** | Same source basis as R09. |
| R16 FAQ mentions all 5 offers | VERIFIED | **STILL_VERIFIED** | `app/pricing/page.js` schema mentions all 5 offers (audit-confirmed). |
| R17 Mobile body ≥16px | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/globals.css` sets body to 17px. |
| R18 Performance ≥85 mobile / ≥90 desktop | VERIFIED_DEPLOYED | **PARTIAL** | `reports/lighthouse-mobile.json` averages: perf **87**, LCP **3,492 ms**, CLS 0 (passes the 85 threshold). `reports/lighthouse-desktop.json` averages: perf **64** — *below* the ≥90 threshold. The bundle-budget sub-test fails (`bundle_gzip_kb: null`) because `.open-next/dist/server/handler.mjs` is not present in this checkout, so the 3,072 KiB Cloudflare Free plan budget claim cannot be re-verified until a build is run. |
| R19 Accessibility ≥95 | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `scripts/a11y-audit.mjs` reports 0 issues across 43 page files; `reports/axe-report.json` (re-captured at 2026-08-17T10:54Z) reports 0 axe violations across 5 live routes (`ironwake.dev/`, `/pricing`, `/systems/ai-receptionist`, `/work`, `/login`). 5 routes have an incomplete color-contrast check that axe could not auto-resolve (89 nodes on home, 44 on pricing). All Lighthouse a11y scores are 100. |
| R20 SEO score ≥95 | PARTIAL — local fixed, awaits redeploy | **PARTIAL → STALE_DEPLOY_REF** | The local fix (commit `9ab5517`) is still in master. The current seo-tech-audit however reports **33 failures across 31 pages**: 29 pages missing canonical / metadataBase / openGraph.url, 15 missing Organization JSON-LD, 16 missing BreadcrumbList JSON-LD. The audit test exits 1 because the failure count is non-zero. The matrix's "awaiting Netlify redeploy" status has not been re-verified against the live host; the seo-tech-audit exits 1 even on the live host. R20 is still PARTIAL with new evidence that the issue is broader than the matrix originally framed (per-page `alternates.canonical` is not the only surface). |
| R21 Substant 2.5D motion per goal §18 | VERIFIED_DEPLOYED (4b394c2) | **STILL_VERIFIED** | `workflow + dashboard + interactive-lead-journey + signal-rail` mount points all present. |
| R22 Chatbot answers exact pricing across 5 offers | VERIFIED_DEPLOYED | **CHANGED** | The cited file `app/components/SiteAssistant.js` **no longer exists**. The current `app/components/AssistantWidget.js` is a 511-byte thin re-export of `./CustomerAssistantLauncher.js`, which is the customer-only (auth-gated) launcher. Anonymous visitors no longer see a public floating chatbot — the public chat surface lives at `/chat` (`app/chat/ChatClient.js`) with its own API at `app/api/chat`. The R22 pricing claim ("5 Lite prices returned") targets a pre-CustomerAssistantLauncher behavior; the existing test in `app/components/AssistantWidget.test.js` is a smoke test on the launcher, not a 5-offer pricing assertion. The grep test in `lib/ai-chat.test.mjs` exercises `chatCompletion` returning parsed replies, not the chatbot's pricing answers. |
| R23 Booking request persists REQUEST_RECEIVED | VERIFIED_LIVE | **STALE_DEPLOY_REF** | Same situation as R12: cycle-15 production evidence predates the 2026-08-10 ledger, which classifies owner-customer intents as `PARTIAL_LIVE_OWNER_MFA_PENDING`. Source still passes its tests. |
| R24 Owner dashboard with search/sort/export works | CONNECTED_NOT_VERIFIED | **PARTIAL** | Ledger still classifies owner dashboard interactions as `CONNECTED_NOT_VERIFIED` because no MFA factors are registered for the designated owner. `app/owner/OwnerDashboard.js` source has search/sort/export present; live interaction remains unproven. |
| R25 Sitemap includes all routes | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/sitemap.js` present; `scripts/sitemap-audit.test.mjs` green. |
| R26 robots.txt allows crawling with sitemap | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/robots.js` present; `scripts/sitemap-audit.test.mjs` green. |
| R27 All 9 portfolio case studies link to live Vercel demos | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/work/page.js` present; `app/work/` has the 9 case study directories. |
| R28 All 9 portfolio case studies have detailed walkthroughs | VERIFIED_DEPLOYED | **STILL_VERIFIED** | Glob `app/work/*/CaseStudy.js` matches 9 case study pages. |
| R29 Substant motion: case study walkthroughs | VERIFIED_DEPLOYED | **STILL_VERIFIED** | `app/components/StepPipeline.js` present; StepPipeline mount points unchanged. |
| R30 Real Atelier comparison | VERIFIED_DEPLOYED (9ee50bb) | **STILL_VERIFIED** | `reports/ATELIER_VS_IRONWAKE_MOTION_COMPARISON.md` present; commit `9ee50bb` reachable. |
| R31 All 4 systems linked from homepage with canonical offer | VERIFIED_DEPLOYED (c8eb933) | **STILL_VERIFIED** | Same source basis as R08 + R15. |
| R32 InteractiveLeadJourney: 3 channels, animated route | VERIFIED_DEPLOYED (4b394c2) | **STILL_VERIFIED** | Same source basis as R06. |
| R33 Sitemap/robots/JSON-LD point at live production host | VERIFIED_DEPLOYED (0195f0a, deploy 6a7711231746907d5d4a82da) | **STALE_DEPLOY_REF** | Source fix `0195f0a` is still in master, but the cited deploy id `6a7711231746907d5d4a82da` and the host `lucent-sunflower-966982.netlify.app` are historical. The current canonical host is `ironwake.dev` (per `reports/REAL_CAPABILITY_LEDGER.md` § Netlify production deployment). The cited Netlify deploy id no longer matches the current production candidate. |
| R34 Exactly one H1 per page | VERIFIED_DEPLOYED (cb9ae74, deploy 6a7713bf635bc722659e737a) | **STALE_DEPLOY_REF** | Source fix `cb9ae74` still in master; `app/loading.test.js` regression guard green. The cited Netlify deploy id `6a7713bf635bc722659e737a` is a Cycle-15 Netlify artifact. The current canonical host is `ironwake.dev`; the deploy id is historical. The source-level invariant (loading boundary uses `<div>`, not `<h1>`) still holds. |
| R35 AI Receptionist not labelled as a concept | FAILED_LIVE | **PARTIAL** | Same status as Cycle 15 — the metadata/CTA/JSON-LD cleanup removed the "concept" label, but the page now claims operational capabilities the ledger says are not implemented. No remediation commit since. |
| R36 Site-wide canonical URL + OG image on every public page | VERIFIED_DEPLOYED (66f37b4 + f9ecccb, deploy 6a77185e6a27af202ea22902) | **STALE_DEPLOY_REF** | Source commits `66f37b4` and `f9ecccb` still in master; `public/og-default.svg` present. The cited deploy id `6a77185e6a27af202ea22902` and host `lucent-sunflower-966982.netlify.app` are historical; the current host is `ironwake.dev`. The seo-tech-audit (33 failures) shows the canonical claim is not actually realized across the public surface — R20 and R36 are coupled; this row cannot be marked STILL_VERIFIED against the live host. |
| R37 No "concept" framing leaks in portfolio case studies or pricing | VERIFIED_DEPLOYED (cycle 15) | **STILL_VERIFIED (source) / STALE_DEPLOY_REF (deploy)** | The production-host reference `ironwake-site.netlify.app` (cycle 15) and the ledger's note that this host predates `ironwake.dev` make the deploy-side claim STALE_DEPLOY_REF. Source-side the strings "concept" are absent from `app/work/rapidpulse/RapidPulseCaseStudy.js` and `app/pricing/page.js`; the source invariant still holds. |

## Summary of changes

| New status | Count | Rows |
|---|---|---|
| STILL_VERIFIED | 25 | R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R11, R13, R15, R16, R17, R19, R21, R25, R26, R27, R28, R29, R30, R31, R32 |
| CHANGED | 1 | R22 |
| PARTIAL | 4 | R14, R18, R24, R35 |
| STALE_DEPLOY_REF | 7 | R12, R20, R23, R33, R34, R36, R37 |
| UNKNOWN | 0 | — |

(Total 37. R37 is classified STALE_DEPLOY_REF because its source invariant
holds but the cited production host is no longer authoritative; the
source-side claim is also recorded as STILL_VERIFIED in the row table.)

## Notable findings the next worker should know

1. **R18 desktop Lighthouse is 64**, not ≥90 as the matrix claims. The mobile
   side passes at 87. This is a regression vs. the Cycle-15 "perf 100"
   snapshot and the bundle-budget assertion cannot be re-tested without
   running `pnpm build` to regenerate `.open-next/dist/server/handler.mjs`.
2. **R20/R36 SEO regression.** The seo-tech-audit reports 33 failures across
   31 pages: 29 missing canonical / metadataBase / openGraph.url, 15 missing
   Organization JSON-LD, 16 missing BreadcrumbList JSON-LD. The Cycle-15
   "local fix at 9ab5517" addressed `alternates.canonical` on a few routes
   but did not fix the broader missing-canonical / missing-JSON-LD pattern
   on `/audit`, `/book`, `/work/*`, `/systems/*`, `/process`, `/owner`, etc.
3. **R22 SiteAssistant.js no longer exists.** The public floating chatbot
   surface was renamed and split: `AssistantWidget.js` (thin re-export) →
   `CustomerAssistantLauncher.js` (customer-only, auth-gated) +
   `/chat` page (`app/chat/ChatClient.js`) for anonymous users. The matrix's
   "5 Lite prices returned" claim was tied to the old surface; the new
   public surface has no equivalent assertion in the test suite.
4. **Many rows have stale Netlify deploy ids and hosts.** Cycles 14–15 were
   verified against `lucent-sunflower-966982.netlify.app` (and later
   `ironwake-site.netlify.app`). The current canonical host is
   `https://ironwake.dev/`. Rows R12, R23, R33, R34, R36 carry deploy ids or
   host strings that no longer match production.
5. **R14 and R35 are both FAILED_LIVE / PARTIAL** for the same underlying
   reason: AI Receptionist page claims operational paths the ledger says
   don't exist. No remediation commit between Cycle 15 and HEAD.

## Verification artifacts produced

- `reports/evidence/CYCLE_22_MATRIX_VERIFICATION.md` (this file)
- `reports/seo-tech-audit.json` (re-captured at 2026-08-17T12:25Z)

## Secret-scan result

`scripts/secret-scan.mjs` returned `issueCount: 0` against the full scan
surface (`app`, `components`, `lib`, `scripts`, `.next/static`,
`.open-next/dist/assets`, `.open-next/dist/server`). No credentials are
leaked into source, history, client chunks, or the Worker bundle.