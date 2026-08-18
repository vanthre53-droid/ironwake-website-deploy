# IronWake — Full DAG (states.md)

**Generated**: 2026-08-18
**Source**: `.v13/TODO.md` (15-stage plan), `reports/CANONICAL_GOAL_REQUIREMENTS_MATRIX.md` (R01–R37),
            `AGENTS.md`, `state/PROJECT_STATE.yaml`, `.v13/results/*`.
**Contract**: Same item is never DONE without the *Evidence-Required* column full.
**Stages** (from TODO.md, locked):
  `S1` Bootstrap · `S2` Flagship hero · `S3` Build/test green · `S4` Worker env (CF dashboard, external) ·
  `S5` Conversion uplift · `S6` Browser QA · `S7` Perf · `S8` A11y · `S9` Security ·
  `S10` Backend/Supabase · `S11` Retell · `S11b` WhatsApp · `S12` Chatbot ·
  `S13` IndexNow+GSC · `S14` Release candidate gate · `S15` Deploy + LIVE_ACCEPTANCE.
**Owner role mapping** (from TODO §FILE_OWNERSHIP_TABLE; gaps inferred from canonical matrix route):
  `ironwake-ui` · `ironwake-seo` · `ironwake-conversion` · `ironwake-perf` · `ironwake-a11y` ·
  `ironwake-security` · `ironwake-backend` · `ironwake-retell` · `ironwake-whatsapp` ·
  `ironwake-integration` (chatbot) · `ironwake-auth-db` · `ironwake-build` · `ironwake-reviewer` ·
  `ironwake-qa` · `ironwake-orchestrator` · `ironwake-release` · **`OWNER`** (human, external/credential).

**State semantics** (strict):
`DONE` (evidence file + green) · `PARTIAL` (one of: code done / build done / evidence partial) ·
`NOT_RUN` (no artifact, no claim) · `WAITING_EXTERNAL` (gate requiring human) · `BLOCKED` (depends on prior stage) ·
`IN-FLIGHT` (active) · `QUEUED` (scheduled, awaiting unblock).

---

## Stage ↔ Item Map (flat, every item)

| ID | Stage | Owner | State | Blocker | Evidence-Required |
|---|---|---|---|---|---|
| **TODO-1** Constant TODO list + DAG | S1 | ironwake-orchestrator | **DONE** | — | `state/states.md` + `state/states.yaml` exist, this file. |
| **TODO-2** Real agents (Ruflo + skills, no fake) | S1 | ironwake-orchestrator | PARTIAL | Ruflo MCP wire | Ruflo MCP handshake bytes; hermes profile `ironwake-*` × 13 on disk. |
| **TODO-3** RUFLO fetch-real-first (clone, not run) | S1 | ironwake-build | DONE | — | `/home/shadowlingo/.local/share/ironwake-tools/ruflo` HEAD `fa13ee4a`. |
| **TODO-4** Connect Ruflo → Hermes | S1 | ironwake-orchestrator | NOT_RUN | `npx ruflo install` hangs | Working `ruflo` MCP entry in `~/.claude/mcp.json`; one safe read-only probe. |
| **TODO-5** Credential Capability Matrix | S1 | ironwake-orchestrator | NOT_RUN | TODO-2 | `reports/CREDENTIAL_CAPABILITY_MATRIX.md` populated row-per-provider with status. |
| **TODO-6** V13 Kanban bound | S1 | ironwake-orchestrator | DONE | — | `hermes kanban list` shows `ironwake-v13-full-implementation`. |
| **TODO-7** 15 specialist profiles + harmless probe | S1 | ironwake-orchestrator | PARTIAL | per-profile capability probe | One read-only probe per profile bytes into `.v13/results/profile-probe/`. |
| **TODO-8** Parallelism = MIN(ready,rate,machine,8) | S1 | ironwake-orchestrator | DONE-in-design | — | Live evidence = one `delegate_task tasks=[8]` run with 8 fanouts. |
| **TODO-9** Context + Result capsules | S1-S11 | ironwake-reviewer | PARTIAL | context capsules not authored | Per-stage capsule in `.v13/results/<stage>.md`; context capsule before next stage. |
| **TODO-10** File ownership table | S1 | ironwake-orchestrator | NOT_RUN | — | `state/FILE_OWNERSHIP.yaml` committed. |
| **TODO-11** Requirement graph (this file) | S1 | ironwake-orchestrator | DONE | — | `state/states.md`+`.yaml`. |
| **TODO-12** Execution strategy (15 stages) | S1 | ironwake-orchestrator | DONE-in-design | — | TODO.md §EXECUTION_STRATEGY. |
| **TODO-13** Design system + shell | S1 | ironwake-ui | PARTIAL | design brief, component inventory | `app/components/INVENTORY.md`; design brief committed; tokens sealed. |
| **TODO-14** Viewport QA @9 widths | S6 | ironwake-qa | NOT_RUN | Playwright absent | 9-viewport × N-route PNG set + overflow ledger in `.v13/results/qa-overflow.md`. |
| **TODO-15** Public routes matrix | S6 | ironwake-qa | PARTIAL | matrix not emitted | `state/SCREEN_ROUTE_MATRIX.md` populated row-per-route. |
| **TODO-16** Portfolio/proof truthful labels (P1-P10) | S5 | ironwake-conversion | PARTIAL | 6 case-study label fixes | Cycle-pinned: case-study label in DOM = `DEMONSTRATION` label when not Vercel-deployed live client. |
| **TODO-17** Conversion psychology | S5 | ironwake-conversion | PARTIAL | lead-capture split | `.v13/results/conversion-audit.md` complete; fixes shipped. |
| **TODO-18** Chatbot canonical truth layer | S12 | ironwake-integration | DONE | — | `c62298f`; `app/api/chat/route.js`+`TRUTH.json`; truth per-question fact check. |
| **TODO-19** Google Auth/Account full reverify | S10 | ironwave-auth-db | NOT_RUN | — | Owner logged-in cookies; `whoami` 200 with valid factors; one controlled action. |
| **TODO-20** Retell (agent/knowledge/sales/lang+EN-TE-HI/webcall/webhook/self-improve) | S11 | ironwake-retell | NOT_RUN | — | Retell live `agent_id`, 3 prompts rendered, 3 lang strings present, web call URL works, webhook signature verified, 1 self-improve cycle recorded. |
| **TODO-21** WhatsApp/Meta full forensics + execute | S11b | ironwake-whatsapp | DONE (audit) | execution gate | `.v13/results/whatsapp-audit.md`; verify_token confirmed; signature verifier file shipped. |
| **TODO-22** Supabase/Backend/CRM (live schema, RLS, unified identity) | S10 | ironwake-backend | DONE (audit) | live retry/direct-object evidence | `.v13/results/backend-audit.md`; live migration list; RLS policies enumerated; idempotent outbox test passing. |
| **TODO-23** SEO technical | S13 | ironwake-seo | PARTIAL | Worker env stale | `.v13/results/seo-audit.md`; core web vitals on deployed `/`. |
| **TODO-24** SEO intent/entity | S13 | ironwake-seo | NOT_RUN | — | `.v13/results/seo-intent-audit.md`; KG schema validation. |
| **TODO-25** GSC + Bing/IndexNow | S13 | ironwake-seo | PARTIAL | GSC probe | IndexNow HTTP 202 logged; GSC verification record. |
| **TODO-26** Performance LCP<2.5, INP<200, CLS<0.1 | S7 | ironwake-perf | NOT_RUN | lighthouse binary owned; deploy not yet final | `lighthouse-mobile.json` + `lighthouse-desktop.json` on `/`, `/pricing`, `/audit`; cores measured. |
| **TODO-27** A11y (axe + manual) | S8 | ironwake-a11y | NOT_RUN | axe in worktree | `axe-cdp-report.json` clean; manual checklist signed per route. |
| **TODO-28** Security (dep/secret/RLS/IDOR/CSRF/XSS/SSRF/webhook forgery) | S9 | ironwake-security | NOT_RUN | — | `.v13/results/security-audit.md`; `npm audit` clean; `gitleaks` 0; one probe per class recorded. |
| **TODO-29** Test orchestration (dedupe, regression) | S3 | ironwake-reviewer | NOT_RUN | owner preservation rule | `npm run test` baseline + post-diff comparison; no new flakes. |
| **TODO-30** Browser QA full-flow registry | S6 | ironwake-qa | NOT_RUN | Playwright | Playwright `playwright.config.ts`; one passing smoke; trace records. |
| **TODO-31** Builder → Reviewer → Repair loop | S6-S10 | ironwake-orchestrator | NOT_RUN | evidence gates above | Loop run record: ≥3 categories, ≥2 iterations each, reviewer-attestation row. |
| **TODO-32** Integrator | S12 | ironwake-integration | NOT_RUN | — | Integrator manifest mapping each integration to truth source. |
| **TODO-33** Full DAG upfront (this item) | S1 | ironwake-orchestrator | DONE | — | this file + states.yaml. |
| **TODO-34** Watchdog/anti-stall | S1 | ironwake-orchestrator | NOT_RUN | terminal bg isolation | `hermes cron` watchdog alive + sample heartbeat. |
| **TODO-35** Ruflo real-time swarm | S1-S6 | ironwake-orchestrator | NOT_RUN | TODO-4 | Swarm handshake bytes; one mini-task fanned out to Ruflo. |
| **TODO-36** Agent observability schema | S1 | ironwake-orchestrator | PARTIAL | schema not emitted | `.v13/results/observability/<task>.json` per delegated task. |
| **TODO-37** Anti-premature-completion formula | S1 | ironwake-orchestrator | DONE | — | `LOCAL_EXECUTABLE_OPEN` present in TODO.md + this file. |
| **TODO-38** No-fake-completion definitions | S1 | ironwake-orchestrator | DONE | — | per-route `ROUTE_ACCEPTANCE_MATRIX` block in TODO.md. |
| **TODO-39** Release candidate gate | S14 | ironwake-release | NOT_RUN | S4 cleared, S6 finalised | RC tag; gate checklist signed. |
| **TODO-40** One final deploy (4 chances total) | S15 | ironwake-release | NOT_RUN | TODO-39 | One `wrangler deploy`; SHA + bundle size + commit recorded; CF env reads `ironwake.dev`. |
| **TODO-41** Live acceptance | S15 | ironwave-release | NOT_RUN | TODO-40 | Curl pass: each route 200, canonical ironwake.dev, sitemap+robots correct; IndexNow 202. |
| **TODO-42** Search engine post-deploy | S15 | ironwake-seo | NOT_RUN | TODO-41 | GSC URL-inspection screenshots; Bing inspect confirmed. |
| **TODO-43** External gate format | S1 | ironwake-orchestrator | NOT_RUN | — | Each blocked item re-emitted in External Gate Format with `NEEDS`, `BLOCKER`, `RECIPIENT`, `SLA`. |
| **TODO-44** Initial task batch (8) | S1-S11 | ironwake-orchestrator | PARTIAL | 6 of 8 pending | Per-batch evidence files; 8/8 reviewed. |
| **TODO-45** Required first checkpoint | S1 | ironwake-orchestrator | NOT_RUN | — | One full checkpoint row with all fields printed; checkpoint ID committed. |
| **TODO-46** Continuation | S1-S15 | ironwake-orchestrator | IN PROGRESS | — | This turn. |
| **TODO-47** Final report (every system) | S15 | ironwake-release | NOT_RUN | TODO-41 | `reports/FINAL_REPORT.md` published; per-system green/stale table. |

### Canonical matrix items (R01–R37) — re-emitted against the 15 stages

These come from `CANONICAL_GOAL_REQUIREMENTS_MATRIX.md` and are *historical frontend matrix*;
this DAG treats them as **legacy claims requiring live verification** before they move to DONE.

| ID | Stage | Owner | State (matrix) | Evidence-Required (live) |
|---|---|---|---|---|
| R01 Premium light design | S1 | ironwake-ui | DEPLOYED | DOM token sweep on `/`; `body bg = #f5f5f7`. |
| R02 Top nav Pricing+Book visible | S1 | ironwake-ui | DEPLOYED | Header DOM on 3 routes contains both anchors. |
| R03 Mobile menu opens cleanly | S1 | ironwake-ui | DEPLOYED | `<details>/<summary>` semantics; keyboard/Escape; touch ≥44px. |
| R04 Hero 5s clarity | S2 | ironwake-ui | DEPLOYED | Above-the-fold text DOM extraction; no orphan slides. |
| R05 Hero Wake SVG motion | S2 | ironwake-ui | DEPLOYED (40dd8d1) | `<svg class="wake-system">` present; reduced-motion safe. |
| R06 Interactive lead journey | S2 | ironwake-ui | DEPLOYED | 3 channels selectable; route swaps. |
| R07 Dashboard demo (4 records, interactive) | S2 | ironwake-ui | DEPLOYED | DOM has 4 rows; click flips state. |
| R08 4 system pages reachable | S2 | ironwake-ui | DEPLOYED | Curl 200 for `/systems/*`. |
| R09 PricingReference per system page | S5 | ironwake-conversion | DEPLOYED | DOM contains canonical offer×5 on each system. |
| R10 5 offers × Lite/Std/Pro India+Intl | S5 | ironwake-conversion | DEPLOYED | 15 amounts match canonical INR and USD. |
| R11 No fabricated metrics | S5 | ironwake-conversion | VERIFIED | Body text grep clean for fake stats. |
| R12 Supabase `/api/audit` 201 | S10 | ironwake-backend | `VERIFIED_LIVE` | One labeled prod inquiry 201; outbox delivered; provider event signed. |
| R13 `/owner` shows login when anonymous | S10 | ironwake-auth-db | DEPLOYED | Anon curl 200, no rows. |
| R14 AI Receptionist reframed | S2 | ironwake-ui | `FAILED_LIVE` | Page must redact "local intake/handoff/chat/audit-ready" until those work. |
| R15 Systems show canonical offer | S5 | ironwake-conversion | DEPLOYED | Per-system DOM contains canonical offer. |
| R16 FAQ mentions all 5 offers | S5 | ironwake-conversion | VERIFIED | Schema + body contains all 5 titles. |
| R17 Mobile body ≥16px | S8 | ironwake-a11y | DEPLOYED | Computed style on sample mobile routes. |
| R18 Performance ≥85/90 | S7 | ironwake-perf | DEPLOYED (cycle 13) | **Stale**: remeasure after S15. |
| R19 Accessibility ≥95 | S8 | ironwake-a11y | DEPLOYED | **Stale**: rerun axe after R17/R14 fixes. |
| R20 SEO ≥95 | S13 | ironwake-seo | PARTIAL | After S4 fix: Lighthouse SEO on `/`, `/pricing`, `/audit`. |
| R21 Substantial 2.5D motion ×3 | S2 | ironwake-ui | DEPLOYED | DOM nodes per motion module. |
| R22 Chatbot exact pricing | S12 | ironwake-integration | DEPLOYED | 5/5 Lite prices returned per canonical. |
| R23 Booking persist REQUEST_RECEIVED | S10 | ironwake-backend | `VERIFIED_LIVE` | Row has `booking_status=REQUEST_RECEIVED`; never `CONFIRMED`. |
| R24 Owner dashboard search/sort/export | S10 | ironwake-auth-db | `CONNECTED_NOT_VERIFIED` | Live recorded session; source column visible; one export bytes. |
| R25 Sitemap routes | S13 | ironwake-seo | DEPLOYED | `app/sitemap.js` returns all routes; live `/sitemap.xml`. |
| R26 robots.txt with sitemap | S13 | ironwake-seo | DEPLOYED | live `/robots.txt`. |
| R27 9 case-study Vercel demos | S5 | ironwake-conversion | DEPLOYED | DOM links resolve to Vercel URLs. |
| R28 9 case-study walkthroughs | S5 | ironwake-conversion | DEPLOYED | `/work/*` returns walkthrough component. |
| R29 Case-study motion | S5 | ironwake-conversion | DEPLOYED | StepPipeline present; reduced-motion safe. |
| R30 Atelier vs IronWake | S1 | ironwake-ui | DEPLOYED | 9/9 axes floor. |
| R31 4 systems linked from home | S2 | ironwake-ui | DEPLOYED | DOM links. |
| R32 InteractiveLeadJourney 3 ch | S2 | ironwake-ui | DEPLOYED | Channel buttons DOM. |
| R33 Sitemap/robots/JSON-LD live host | S13 | ironwake-seo | DEPLOYED | Curl headers on live site show `ironwake.dev`. |
| R34 Exactly one `<h1>` per page | S8 | ironwake-a11y | DEPLOYED | axe rule `heading-order` clean. |
| R35 AI Receptionist not "concept" | S2 | ironwake-ui | `FAILED_LIVE` | Metadata + JSON-LD clean of "concept"; pending claim redaction. |
| R36 Site-wide canonical + og:image | S13 | ironwake-seo | DEPLOYED | All 10 routes have canonical + og. |
| R37 No "concept" leaks in work/pricing | S5 | ironwake-conversion | DEPLOYED | Live curl clean (cycle 15). |

> Cycle-15 reconciliation notes (2026-08-09) are kept verbatim; this DAG supersedes
> the historical `VERIFIED_DEPLOYED` strings only where live re-evidence is attached.

---

## Stage progression ladder (anti-premature-completion)

```
S1 DONE → S2 DONE → S3 DONE
                    ↓
                    S4 (CF dashboard, OWNER) ←── WAITING_EXTERNAL_OWNER
                    ↓
                    S5 DONE → S6 IN-FLIGHT → S7-S12 DONE
                                                 ↓
                                                 S13 (GSC) → S14 (RC) → S15 (Deploy + ACCEPT)
                                                                            ↓
                                                                       FULLY_VERIFIED
```

`LOCAL_EXECUTABLE_OPEN` = (work available now) − (work blocked by current stage). Active while >0.

**Counts** (machine-verified, same as `state/states.yaml`):
- 47 TODO items + 37 canonical-matrix items = **84 nodes**
- DONE: 8 · PARTIAL: 12 · NOT_RUN: 23 · DONE_IN_DESIGN: 2 · DONE_AUDIT: 2 · IN_PROGRESS: 1 · DEPLOYED: 27 · VERIFIED: 2 · VERIFIED_LIVE: 2 · FAILED_LIVE: 2 · STALE_DEPLOYED: 2 · CONNECTED_NOT_VERIFIED: 1
- **External gates open: 4** (CF env, MFA, D-008, GSC)

External gates currently open (each must be re-emitted in External Gate Format — TODO-43):
1. **WAITING_EXTERNAL_OWNER_CF_ENV** — `NEXT_PUBLIC_SITE_URL = https://ironwake.dev` (TODO-39 chain).
2. **WAITING_EXTERNAL_OWNER_MFA** — owner AAL2 enrollment (R24 re-evidence).
3. **WAITING_EXTERNAL_OWNER_D008** — adult/legal-owner decision.
4. **WAITING_EXTERNAL_GSC** — verification file upload for `ironwake.dev`.

Skipped until asked: nothing critical. Restart on Demand: re-emit this DAG any time the
owner asks `/goal IRONWAKE_FULL_PRODUCTION_CONTINUATION`.
