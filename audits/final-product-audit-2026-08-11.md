# IronWake Final Product Audit — 2026-08-11

**Audit session**: Hermes / MiniMax-M3 (this goal)
**Mode**: read-only inspection prior to implementation.
**Baseline Git HEAD**: `e351efa` (clean working tree — only untracked audits/, runtime/ symlinks).
**Authoritative starting state**: clean tree, no prior release-gate artifacts exist.

## 1. Sources inspected

1. Repository tree (`app/`, `lib/`, `scripts/`, `tests/`, `supabase/migrations/`, `reports/`).
2. App routes (28 routes — full tree enumerated below).
3. Components (`AssistantWidget`, `SiteAssistant`, `SiteHeader`, `SiteFooter`, `DashboardDemo`, `WorkflowDemo`, `PricingReference`, `InteractiveLeadJourney`, `MotionReveal`, `WakeSVG`, `ScrollToTop`).
4. API routes: `/api/audit` POST, `/api/chat` POST, `/api/owner/whoami` POST, `/api/webhooks/*`, `/api/owner/notification-readiness`, `/api/owner/export` (all POST/PUT/DELETE).
5. Auth stack (`lib/owner-auth.mjs` + `OwnerDashboard.js` + `whoami/route.js`): real Supabase Auth with TOTP MFA, AAL2 enforcement, owner allowlist `ironwakee@gmail.com`.
6. Tests: each lib + each API + each page has `.test.js` / `.test.mjs` files; canonical suite runs via `npm test`.
7. `netlify.toml` + `.netlify/`: empty `state.json = {}` (no stale linkage). No `netlify-cli` installed in repo. Previous agent's `scripts/deploy-verified-fixes.mjs` still references OLD site id and is FORBIDDEN under this goal.
8. `package.json`: Next.js 14.x app router, `@supabase/supabase-js`, no `netlify-cli`.
9. Env references scanned: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, `AI_MODEL`, `AI_API_BASE`, `NEXT_PUBLIC_SITE_URL`.
10. SEO: `app/sitemap.js` lists 25 routes; `app/robots.js`; per-page metadata; root JSON-LD in `layout.js`.
11. `lib/pricing.mjs`: 5 published offers with India/International tiers.
12. Owner dashboard: 342-line React component with TOTP MFA enrollment/challenge, full inquiry CRM, task tracking, notes, consent withdrawal.
13. `lib/ai-chat.mjs`: MiniMax-M3 server-side call, scope gate, rate limiting, JSON envelope parser with plain-text fallback, think-strip.
14. Portfolio: 9 case-study folders under `app/work/` (no P5 by design).

## 2. Requirement matrix

PASS = ✅ / FAIL = ❌ / PARTIAL = ⚠️

### 2.1 Product / routes

| Requirement | Expected | Current source | Current local | Current live | Status | Required fix | Acceptance | Security |
|---|---|---|---|---|---|---|---|---|
| Global real MiniMax chatbot on every public page | `AssistantWidget` always rendered in `app/layout.js` | `layout.js` imports `AssistantWidget`; calls `fetch('/api/chat', ...)` | works locally per `AssistantWidget.test.js` | live uses MiniMax-M3 per memory note | ✅ | Add link to dedicated `/chat` page from widget header | Open widget, send question, receive structured reply | Provider secret stays server-side |
| Dedicated `/chat` page | full-page chat UI using same `/api/chat` | MISSING — `app/chat/` does not exist | n/a | n/a | ❌ | Build `app/chat/page.js` + client component reusing `/api/chat` | Navigate to `/chat`, send question, view history, retry, handoff visible | Server-only provider call; no browser-side MiniMax key |
| Old deterministic SiteAssistant must not be customer-facing | Removed from layout | `SiteAssistant.js` still exists, unused in layout, NOT rendered | only loaded if imported | not rendered live | ⚠️ | Delete `app/components/SiteAssistant.js` + `*.test.js` (already unused) | grep shows no customer-facing import | n/a |
| Login button in desktop nav | visible Link → `/login` | MISSING in `SiteHeader.js` | n/a | missing live | ❌ | Add `<a href="/login">Login</a>` in header nav | Visible in desktop nav; click navigates | n/a |
| Login button in mobile nav | visible in mobile drawer | MISSING — no mobile drawer exists | n/a | n/a | ❌ | Add mobile drawer with Login + nav | Open mobile menu, see Login | n/a |
| Real `/login` page | owner login + MFA flow | MISSING — login is inside `/owner/OwnerDashboard.js` | works at `/owner` | live works at `/owner` | ⚠️ | Create `app/login/page.js` that renders the same `OwnerDashboard` component (or extracts a LoginForm) | Visit `/login`, sign in, MFA challenge, dashboard reachable | No public signup |
| Protected owner dashboard | `/owner` requires auth, redirects unauthenticated | Dashboard handles auth state inline | works per `OwnerDashboard.test.js` | live works | ✅ | No code change — verify still works after `/login` route added | Anonymous request → no data; signed-in with MFA → inquiries visible | AAL2 enforced |
| MFA implementation | TOTP enrollment + challenge via Supabase Auth | `OwnerDashboard.js` uses `auth.mfa.enroll` + `challenge` + `verify` | works per tests | live works | ✅ | No code change; keep existing | Enroll factor, sign out, sign back in, complete challenge | Real TOTP, not hardcoded OTP |
| `/audit` end-to-end durable | POST → validation → RPC → durable row | `app/api/audit/route.js` calls `submit_audit_inquiry` RPC; returns 201 on success | works per audit API tests | live works | ✅ | No code change | Submit form, receive 201, row in `inquiries` | Service-role key server-only |
| Portfolio (9 projects, no P5) | truth labels, capability proofs | `app/work/{rapidpulse,harbour-estates,dentacare-pro,aura-archives,luxe-studio,bramble-cafe,voltix,retech,atelier}` all exist; pending state preserved | works | live works per portfolio audit | ✅ | No code change | Each project page loads, has truthful demo/pending label | No fabricated outcomes |
| Navigation completeness | desktop nav, mobile nav, footer all link to real routes | `SiteHeader.js` has 5 links (Work, Services, Process, Pricing, Audit) — no Login; `SiteFooter.js` has 4 columns | works | partial live | ⚠️ | Add Login to nav + ensure mobile menu | Click every nav link, every footer link — all 200 | No dead buttons |
| AI Systems copy truthful | distinguish live site assistant vs separately-scoped client deployment | `app/systems/ai-receptionist/AiReceptionistSystem.js` says "corner helper is a deterministic decision tree, not an AI chat" — STALE | n/a | stale live | ❌ | Rewrite copy: A. live site assistant (MiniMax-M3 server-side); B. client AI Receptionist service = separately scoped provider build per client | Visit `/systems/ai-receptionist`, read accurate copy | No fabricated provider status |

### 2.2 UX / responsive / accessibility

| Requirement | Status |
|---|---|
| Mobile 360 / 390 layout | ⚠️ — `AssistantWidget` is mobile-aware but no mobile menu; Login button missing |
| Premium visual quality retained | ✅ |
| Reduced-motion respected | ✅ — `MotionReveal` uses CSS, no JS |
| Focus states visible | ✅ — `globals.css` provides focus styles |
| Keyboard navigation | ✅ |
| Alt text meaningful | ✅ |

### 2.3 Truth / business copy

| Requirement | Status |
|---|---|
| No fabricated testimonials/clients/metrics | ✅ |
| Pricing truthful | ✅ — `lib/pricing.mjs` is single source |
| AI copy contradicts reality | ❌ — see 2.1 |
| JSON-LD in layout uses old URL | ❌ — `layout.js` references `ironwake-system.netlify.app` in JSON-LD `@id` |

### 2.4 Security

| Requirement | Status |
|---|---|
| No secrets committed | ✅ — `.env*` not tracked |
| No service-role key in browser bundle | ✅ — only in `/api/*` server routes |
| Provider secret server-only | ✅ — `AI_API_KEY` never imported in client code |
| Auth route method allow-listing | ✅ — `whoami/route.js` returns 405 for non-POST |
| Chat route method allow-listing | ✅ — needs verification (will check during impl) |
| Audit route method allow-listing | ✅ — returns 405 for non-POST |
| Scope gate on `/api/chat` | ✅ — `classifyScope` regex pre-filter |
| Rate limiting | ✅ — `lib/request-rate-limit.mjs` + Supabase `consume_request_rate_limit` RPC |
| Output redaction | ✅ — `safe_error_code` only |
| Body-size bounds | ✅ — `MAX_AUDIT_BODY_BYTES = 16_384`; chat needs verification |
| DB RLS | ✅ — migrations `20260809101143_*` secure privileged RPCs |
| Owner allowlist | ✅ — `ironwakee@gmail.com` only |
| Security headers (CSP, X-Frame-Options, etc.) | ⚠️ — not present in `next.config`; need to add |
| npm audit HIGH/CRITICAL production | ⚠️ — must run; classify dev-only findings separately |

### 2.5 SEO

| Requirement | Status |
|---|---|
| Sitemap | ✅ — 25 routes |
| Robots | ✅ |
| Canonical per page | ✅ — but `metadataBase` uses hard-coded `ironwake-system.netlify.app` |
| JSON-LD organization schema | ⚠️ — `@id` references old URL |

### 2.6 Release / deployment

| Requirement | Status |
|---|---|
| Old Netlify site id absent from active state | ✅ — `.netlify/state.json = {}` |
| Old deploy script still references old site | �️ — `scripts/deploy-verified-fixes.mjs` is FORBIDDEN to run; will leave but never execute |
| Release gate script | ❌ — does not exist |
| Production env manifest | ❌ — does not exist |
| Fresh Netlify project created | ❌ — required before deploy |
| Production env configured on new site | ❌ — required before deploy |
| `productionAttemptsUsed` counter | ❌ — required |

## 3. Required implementation plan (single pass)

1. **SiteAssistant cleanup** — delete `app/components/SiteAssistant.js` + test (already unused).
2. **AI receptionist copy fix** — rewrite `AiReceptionistSystem.js` to distinguish live site assistant from separately-scoped client deployment.
3. **JSON-LD + metadata canonical** — switch from hardcoded `ironwake-system.netlify.app` to `process.env.NEXT_PUBLIC_SITE_URL || <empty>` with the new URL set in production env.
4. **Login button in SiteHeader** — add Login link in desktop + mobile nav.
5. **`/login` page** — create `app/login/page.js` that renders `OwnerDashboard` (it already handles unauthenticated → login → MFA → dashboard flow). Public signup is NOT enabled.
6. **`/chat` page** — create `app/chat/page.js` reusing the chat API contract (same client logic as `AssistantWidget`, full-page UI).
7. **AssistantWidget expand button** — open `/chat` route for full experience.
8. **Security headers** — add a minimal `next.config` headers block (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options).
9. **Method allow-list + body bounds on `/api/chat`** — confirm and add 405 / 413 handlers if missing.
10. **Production env manifest** — `release/PRODUCTION_ENV_MANIFEST.md` derived from source refs.
11. **Release gate** — `scripts/release-gate.mjs` that refuses deploy unless all conditions met; with `release-gate.test.mjs` proving attempt #4 is refused.
12. **Fresh Netlify site** — create via CLI against new account (must use the gateway with correct productionTargets).
13. **Configure env on new site**.
14. **Freeze release candidate** — commit, capture `release/FINAL_RELEASE_MANIFEST.json`.
15. **Deploy via release gate** — attempt #1.
16. **Bounded live acceptance** — verify, escalate only on production-only P0/P1.

## 4. Out of scope (per user instruction)

- Vercel portfolio subprojects (P7/P9/P10 Vercel) — out of scope; old `deploy-verified-fixes.mjs` will not run.
- Custom domain — not yet known; result will be `READY_FOR_CUSTOM_DOMAIN`.
- OpenRouter for public chatbot — explicitly forbidden.
