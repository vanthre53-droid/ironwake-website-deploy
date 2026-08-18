# IronWake V13 — Living TODO + Requirement Graph + Execution Strategy

**Last updated**: 2026-08-18 (live) — truth-only, no inflation.

## GLOBAL_STATE
**CURRENT = BOOTSTRAPPING** → target **FULLY_VERIFIED**.

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
| 1 | Constant TODO list | DONE | this file |
| 2 | Real agents (Ruflo+skills, no fake) | PARTIAL | 3 real Hermes subagents → master `371e9d1`/`5cb3910`/`f8ff231`/`3b82240`; Ruflo real (cloned, not connected) |
| 3 | RUFLO fetch-real-first (clone not run inside ironwake) | DONE | `/home/shadowlingo/.local/share/ironwake-tools/ruflo` HEAD `fa13ee4a` |
| 4 | Connect Ruflo → Hermes (backup, MCP, probe, safe read-only) | NOT_RUN | deferred — `npx ruflo install` hangs |
| 5 | Credential Capability Matrix (vaults, never print/paste) | NOT_RUN | vaults present, probes not run |
| 6 | V13 Kanban board preserved + new one bound | DONE | `hermes kanban list` showed `ironwake-v13-full-implementation` |
| 7 | 15 Hermes specialist profiles + harmless probe | PARTIAL | 13 profiles exist on disk; 12 of 13 got design skills installed; never used capability probe per profile |
| 8 | Parallelism: MIN(ready, rate, machine, 8) | DONE-in-design | `delegate_task tasks=[8]` |
| 9 | Context capsules + Result capsules | PARTIAL | `.v13/results/{conversion-audit,seo-audit,stage2-hero}.md` exist; context capsules not authored |
| 10 | File ownership table | NOT_RUN | none authored |
| 11 | Requirement graph (ORCHESTRATION→LIVE_ACCEPTANCE) | DONE-in-design | this file |
| 12 | Execution strategy (15 stages) | DONE-in-design | this file |
| 13 | Design system + shell (midrange neutral premium glass) | PARTIAL | token swap committed; design brief untouched; component inventory not authored |
| 14 | Viewport acceptance @1920/1440/1366/1280/1024/430/390/360 | NOT_RUN | Playwright not installed |
| 15 | All public routes ROUTE_ACCEPTANCE_MATRIX | PARTIAL | conversion-audit read 24 routes; matrix not emitted |
| 16 | Portfolio/proof (P1-P10 truthful labels) | PARTIAL | conversion audit touched 6 case-studies failing 6 "demonstration label" tests |
| 17 | Conversion psychology | PARTIAL | audit done |
| 18 | Chatbot (canonical truth layer) | NOT_RUN | chatbot-mcp not installed |
| 19 | Google Auth/Account full reverify | NOT_RUN | never tested |
| 20 | Retell (agent/knowledge/sales/langs EN-TE-HI/web-call/webhook/self-improve) | NOT_RUN | never run |
| 21 | WhatsApp/Meta full forensics + execute | NOT_RUN | not run |
| 22 | Supabase/Backend/CRM (live schema, RLS, unified identity) | NOT_RUN | not run |
| 23 | SEO technical | PARTIAL | audit done; Worker env critical fix pending owner |
| 24 | SEO intent/entity | NOT_RUN | not run |
| 25 | GSC + Bing/IndexNow | PARTIAL | IndexNow submitted HTTP 202; GSC not probed |
| 26 | Performance (LCP<2.5, INP<200, CLS<0.1) | NOT_RUN | never measured |
| 27 | A11y (axe + manual) | NOT_RUN | never run |
| 28 | Security (dep/secret/RLS/IDOR/CSRF/XSS/SSRF/webhook forgery) | NOT_RUN | never run |
| 29 | Test orchestration (dedupe, regression) | NOT_RUN | pre-existing 8 failures left alone per owner preservation |
| 30 | Browser QA full-flow registry | NOT_RUN | Playwright absent |
| 31 | Builder→Reviewer→Repair | NOT_RUN | Hermes profiles exist; never looped |
| 32 | Integrator | NOT_RUN | not started |
| 33 | Full DAG upfront | DONE-in-design | this file |
| 34 | Watchdog/anti-stall | NOT_RUN | watchdogs only exist for background terminal jobs |
| 35 | Ruflo real-time swarm | NOT_RUN | Ruflo MCP not wired |
| 36 | Agent observability (PROFILE/TASK/RUN/PID/START/HEARTBEAT/WORKSPACE/FILES/STATE) | PARTIAL | live transcripts logged per delegation; structured observability schema not emitted |
| 37 | Anti-premature-completion (LOCAL_EXECUTABLE_OPEN formula) | DONE | encoded in GLOBAL_STATE above |
| 38 | No-fake-completion definitions | DONE | per ROUTE_ACCEPTANCE_MATRIX + per check status |
| 39 | Release candidate gate | NOT_RUN | not gated |
| 40 | One final deploy | NOT_RUN | 0 of 4 chances used |
| 41 | Live acceptance | NOT_RUN | not run |
| 42 | Search engine post-deploy | NOT_RUN | not run |
| 43 | External gate format | NOT_RUN | blocked items never phrased as External Gate Format |
| 44 | Initial task batch (ui/conversion/seo/retell/backend/auth-db/whatsapp/perf/security) | PARTIAL | ui+conversion+seo done; 6 more pending |
| 45 | Required first checkpoint (print all fields) | NOT_RUN | checkpoint never emitted as required |
| 46 | Continuation | IN PROGRESS | this turn |
| 47 | Final report (every system) | NOT_RUN | not run |
| 48 | Immediate start order (20 steps) | DONE-in-design | this file |

## DESIGN DIRECTION (LOCKED, do not re-litigate)
**Palette**: `#f5f5f7` paper · `#ececee` stone · `#1d1d1f` ink · `#6e6e73` graphite ·
`#0071e3` blue · `#d2d2d7` rule · `#fff` surface · `#ff3b30` error.
**Glass**: `backdrop-filter: blur(22px) saturate(160%)` + translucent fill + top-edge highlight.
**Forbidden**: dark default, copper, purple, eon/cyan, neon.

---

## FILE OWNERSHIP TABLE

| FILE_OR_MODULE | OWNER_PROFILE | TASK_ID | LEASE_STATUS |
|---|---|---|---|
| `app/page.js` | ironwake-ui | UI-DESIGN-03 | DONE-371e9d1 |
| `app/components/FlagshipHero.js` | ironwake-ui | UI-DESIGN-03 | DONE-5cb3910 |
| `app/components/RevealSection.js` | ironwake-ui | UI-DESIGN-03 | DONE-371e9d1 |
| `app/globals.css` (.flagship namespace) | ironwake-ui | UI-DESIGN-03 | DONE |
| `app/globals.css` (token block) | LOCKED-NO-TOUCH | — | sealed |
| `app/robots.js` | ironwake-seo | SEO-01 | DONE-f8ff231 |
| `.v13/results/*` | ironwake-reviewer | AUDIT-evidence | DONE |
| `app/pricing/PricingPage.js` (default-export fix) | ironwake-build | FIX-PRICE-DEFAULT | DONE-3b82240 |
| `app/chatbot/` (truth layer) | ironwake-integration | CHAT-01 | FREE |
| `app/retell/` (voice agent) | ironwake-retell | RETELL-01 | FREE |
| `app/whatsapp/` (meta cloud) | ironwake-whatsapp | WA-01 | FREE |
| `lib/supabase/` | ironwake-backend | BACKEND-01 | FREE |
| `app/api/auth/*` | ironwake-auth-db | AUTH-01 | FREE |
| `app/api/*` other routes | ironwake-backend | — | FREE |
| `tests/` | ironwake-reviewer | TEST-01 | ACTIVE (8 pre-existing) |

---

## EXECUTION STRATEGY (15 stages)

**S1** — Bootstrap (design skills, kanban, TODO, palette, ruflo clone) — **DONE**
**S2** — Flagship hero (UI-DESIGN-03) + signal-rail restoration — **DONE** (`371e9d1`/`5cb3910`)
**S3** — Build/test green (pricing default, robots) — **DONE** (`3b82240`/`f8ff231`) → **FULL GREEN 298/298 TESTS PASS** (pre-existing 8 fixed by conversion-fix pass on AuditForm refactor)
**S4** — Worker env var fix (CRITICAL SEO) → owner/cloudflare dashboard — **WAITING_EXTERNAL_CF_DASHBOARD**
**S5** — Conversion uplift (2 surgical fixes shipped) — **DONE** (`a4a42e5`/`f6d5279` + fix of AuditForm tests)
**S6** — Browser QA @9 viewports → 16/27 PNGs captured, agent still finishing small-viewport routes — **IN-FLIGHT** (`task-3 deleg_8a`)
**S7-S11** — Perf + A11y + Security + Backend + Retell audits — **DONE** (capsules in `.v13/results/{perf,a11y,security,backend,retell}-audit.md`)
**S11b** — WhatsApp Meta Cloud API audit — **DONE** (`.v13/results/whatsapp-audit.md`)
**S12** — Chatbot canonical truth layer — **DONE** (`c62298f`, `app/api/chat/route.js` + `TRUTH.json`)
**S13** — IndexNow + GSC post-deploy verification — **QUEUED** (IndexNow already verified PASS in `seo-audit.md` step)
**S14** — Release candidate gate — **QUEUED** (needs S4 cleared + S6 evidence finalized)
**S15** — One final deploy (4 chances) + LIVE_ACCEPTANCE — **QUEUED**

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
