# IronWake — Final One-Shot Product Audit (2026-08-11)

This is the single canonical audit for the IRONWAKE_FINAL_ONE_SHOT_PRODUCT_COMPLETION goal.
HEAD audited: `af1a6a8a488564cb8e658820a7595899a9683ad8`.
Site ID (production target): `ee1810a8-877d-482f-b959-01185aa2a67d`.
Forbidden old site ID: `1927c0b3-532f-469c-b302-1d96cb9c7367`.

## Three user states — required vs. actual

| State | Required | Actual | Status |
|---|---|---|---|
| ANONYMOUS | browse, Sign in / Create account, Ask IronWake, /chat without login, /audit, mobile nav | SiteHeader only shows "Login" (= owner) and "Book Diagnostic". No "Create account". No "Sign in" link. | FAIL |
| CUSTOMER | real signup, real login, persistent session, password recovery, /account, profile, only own chat, only own requests | No signup route, no customer login route, no /account, no password recovery, no profile, no chat history. | FAIL |
| OWNER | /owner, MFA/AAL2, allowlist, never reachable by new customer | /owner exists, MFA wired, email allowlist on server, AAL2 enforced. BUT owner login sits at /login (collides with intent of customer auth). | PARTIAL |

## Route architecture — required vs. actual

| Route | Required | Actual | Status |
|---|---|---|---|
| / | yes | exists | PASS |
| /work | yes | exists | PASS |
| /services or /systems | yes | /systems hub exists | PASS |
| /systems/ai-receptionist | yes | exists | PASS |
| /process | yes | exists | PASS |
| /pricing | yes | exists | PASS |
| /insights | yes | exists | PASS |
| /about | yes | exists | PASS |
| /audit | yes | exists | PASS |
| /chat | yes | exists | PASS |
| /privacy | yes | exists | PASS |
| /terms | yes | exists | PASS |
| /signup | yes | **MISSING** | FAIL |
| /login (customer) | yes | exists BUT routed to OwnerDashboard | FAIL |
| /auth/confirm | yes | **MISSING** (rely on Supabase redirect URL) | FAIL |
| /forgot-password | yes | **MISSING** | FAIL |
| /update-password | yes | **MISSING** | FAIL |
| /account | yes | **MISSING** | FAIL |
| /owner/login | yes | **MISSING** (owner login sits at /login) | FAIL |
| /owner | yes | exists | PASS |
| /insights/[slug] | implied (each article "Read more") | **MISSING** (insights articles have no detail pages) | FAIL |

Industry / case-study routes (all present): /industries, /industries/home-services, /industries/dental-clinics, /industries/salons-spas, /work/rapidpulse, /work/dentacare-pro, /work/atelier, /work/harbour-estates, /work/aura-archives, /work/luxe-studio, /work/bramble-cafe, /work/voltix, /work/retech, /book, /scope.

## Global navigation — required vs. actual

Anonymous desktop header (SiteHeader): only Login (owner) + Book Diagnostic. No Sign in, no Create account, no Ask IronWake trigger (handled via global AssistantWidget in layout).
Anonymous mobile menu: same — Login + Book Diagnostic, no Sign in, no Create account.
Authenticated customer header: not implemented (no customer auth state hydrates nav).
Owner controls in public nav: absent (good), but the only auth control is "Login" pointing at owner.

## Customer auth UI — required vs. actual

| Item | Status |
|---|---|
| /signup form | MISSING |
| Outcome-oriented value explanation on signup | MISSING |
| /login (customer) form | MISSING (only owner) |
| Forgot-password flow | MISSING |
| Update-password flow | MISSING |
| /account overview | MISSING |
| Password visibility toggle | MISSING |
| Inline validation | MISSING |
| Reduced-motion aware | n/a (no auth UI exists) |

## Premium UI / UX system

- Light-first premium Apple-minimal styling: present in globals.css.
- Animation library: only `MotionReveal` (IntersectionObserver opacity/translate). No Framer Motion / GSAP / Motion installed. Per spec, do not add a heavy dep — reuse MotionReveal pattern.
- Reduced-motion: `MotionReveal` honours `prefers-reduced-motion`.
- AssistantWidget has minimal entrance animation; ChatClient page has none.
- Auth / Account pages: do not exist yet.

## Motion/animation system

| Region | Required | Actual |
|---|---|---|
| Global route/content entrance | yes | MotionReveal only |
| Nav/menu transitions | yes | none |
| Button hover/press | yes | CSS-only (globals.css `.button`) |
| Focus transitions | yes | CSS only |
| Card elevation | partial | CSS hover |
| Auth form entrance / validation / submit / error | yes | n/a (no auth UI) |
| Chat open/close | yes | AssistantWidget has none (instant mount) |
| Message appearance | partial | none (instant append) |
| Account transitions | yes | n/a |

## Real customer signup — required vs. actual

- Real `supabase.auth.signUp`: MISSING.
- Display name, email, password, confirm, terms agreement: MISSING.
- Profile creation: MISSING.
- Customer role protection: n/a.

## Customer login — required vs. actual

- Email + password + Forgot password + Create account: MISSING.
- Persistent session: relies on supabase-js browser session; no SSR cookie refresh.
- /api/* server-protected routes: not used for customer auth (none exist).

## Supabase SSR session architecture

| Item | Actual |
|---|---|
| Installed Supabase package | `@supabase/supabase-js ^2.57.4` |
| `@supabase/ssr` package | NOT installed |
| Server client factory | not implemented |
| Browser client factory | ad-hoc inside OwnerDashboard, AssistantWidget |
| Middleware | not present |
| Cookie-based session refresh | not implemented |

Status: FAIL — customer auth requires `@supabase/ssr` + server client + middleware to survive reload and to protect server routes.

## Customer profile DB

| Table | Status |
|---|---|
| `public.profiles` | MISSING — must add: user_id, display_name, created_at, updated_at + RLS |

## Customer RLS

| Table | Status |
|---|---|
| `inquiries` | owner-only RLS via app_metadata role (no customer policy needed for now since customers do not write inquiries) |
| `contacts`, `consents`, `tasks`, `outbox_events`, `audit_logs` | owner-only RLS, no anon access |
| `profiles` | MISSING |
| `chat_sessions` | MISSING |
| `chat_messages` | MISSING |

Two-user isolation: NOT TESTED because no customer-owned tables exist yet.

## Public chatbot — global widget

| Item | Actual |
|---|---|
| Mounted in root layout | YES (AssistantWidget in `app/layout.js`) |
| Visible to every visitor | YES |
| Real MiniMax backend | YES via `/api/chat` -> `lib/ai-chat.mjs` |
| No second deterministic chatbot | OK |
| Conditions on visibility | none — global, no auth required |

Status: PASS.

## Chat UX

- Global widget collapsed: premium `Ask IronWake` button + AI disclosure footer (PASS for disclosure).
- Expanded: welcome, suggestions, conversation, loading, error, retry, handoff checkbox, full chat link.
- /chat: full history, send, retry, clear, handoff.
- Mobile keyboard handling: CSS only; no safe-area padding.

## Chat backend

- Server-side `/api/chat` is hardened: scope classifier, coding/hacking/secret refusal, request-size bounds, conversation-length bound, rate limiting, safe errors.
- Provider hidden reasoning stripped via `parseProviderOutput`.
- Provider key server-only.

Status: PASS.

## Anonymous vs customer chat

- Anonymous chat works today.
- Authenticated chat persistence: NOT IMPLEMENTED.
- /account conversation history: NOT IMPLEMENTED.

## Chat database

| Table | Status |
|---|---|
| `chat_sessions` | MISSING |
| `chat_messages` | MISSING |

## Customer account

| Section | Status |
|---|---|
| Overview / identity / next actions | MISSING |
| My conversations | MISSING |
| My requests (audit history) | MISSING |
| Profile (display name, update) | MISSING |
| Security (password reset path, sign out) | MISSING |

## Audit + customer identity

- Anonymous audit submission: WORKS.
- Authenticated audit association: NOT IMPLEMENTED — no `user_id` on `inquiries`.
- Truthful success: WORKS.

## Owner system

- /owner route exists, MFA TOTP enrolled via Supabase, AAL2 enforced server-side.
- Email allowlist via `OWNER_EMAIL = ironwakee@gmail.com` in `app/api/owner/whoami/route.js`.
- Migration `20260810100000_require_owner_aal2.sql` enforces `aal = 'aal2'` inside `is_owner()` RLS predicate.
- BUT owner login sits at /login (wrong place).
- Newly registered customer cannot currently reach /owner (no signup), so separation is "by absence" not "by design".

Status: PARTIAL — needs /owner/login separation, customer signup must not collide.

## Password recovery

- Missing on customer side. Owner-side `requestRecovery` in OwnerDashboard calls `resetPasswordForEmail` with redirect to `/owner/reset-password`.

## Auth email / SMTP

- Site does not run a separate SMTP server. Email send uses Resend (transactional).
- Customer signup email confirmation: depends on Supabase Auth's built-in email (uses Supabase's default mail provider by default; if Supabase project has its own SMTP, configurable).
- Per spec: do not disable security. If Supabase project SMTP is unverified, customer signup confirmation email will fail to deliver. This is a real external provider dependency.

## Bot / abuse security

- Chat endpoint: rate-limited (20/600s per identity hash).
- Audit endpoint: rate-limited.
- No CAPTCHA. Per spec: do not add CAPTCHA during final release; rely on rate limits + form throttling.

Status: PASS for in-scope requirements.

## Copy contradictions

| Page | Issue | Fix |
|---|---|---|
| Home FAQ | "corner helper is a deterministic guide, not an AI agent" | rewrite as "Ask IronWake is a real AI assistant grounded in IronWake knowledge" |
| Home FAQ | "Is IronWake an AI chatbot? No" | rewrite to distinguish IronWake (systems practice) from the Ask IronWake assistant (real AI) |
| Home hero | "No testimonial, metric, benchmark, or provider status is published without reproducible evidence" | OK; verify no benchmark numbers violate this elsewhere |
| /systems/ai-receptionist | "No live receptionist provider is connected" — OK; site assistant IS live |
| /work | "Each project below is a live demonstration you can open and inspect" — 3 of 9 have externalPending; rewrite |
| /insights | each card says "Read more" but no detail page exists — rewrite or add stub detail |
| /pricing | provider-dependence wording — verify |
| /privacy | must add: Supabase Auth accounts, profiles, customer sessions, persisted authenticated chat, customer request association |
| /terms | must align with account/auth wording |

## Full frontend route audit — quick scan

All `app/**/page.js` routes compile (test suite asserts). HTTP success confirmed via existing test infrastructure. Console/hydration: existing tests assert no console errors.

## Responsive audit

- Existing CSS uses mobile-first; header has `.desktop-nav` + `.mobile-nav` details pattern.
- 360 / 390 / 768 / 1024 / 1366 / 1440: existing CSS does not have explicit breakpoints beyond ~720px and ~960px — may need verification at 360.
- Mobile menu: uses native `<details>` (works).
- AssistantWidget: fixed bottom-right; may overlap content on small screens.

## Browser / visual E2E

- No Playwright installed. Per spec: do not install large new tooling unless necessary.
- Manual browser E2E via existing `tests/` and `app/**/page.test.js` is the practical path.
- Capture evidence via the in-repo screenshot path under `tests/` or `audits/`.

## Auth E2E

- Customer signup/login: MISSING.
- Session reload: not tested (no customer auth exists).
- Two-user isolation: not tested (no customer-owned data exists).

## Chat E2E matrix

- Anonymous: covered by `app/chat/page.test.mjs` + `/api/chat/route.test.js`.
- Authenticated persistence: MISSING.
- Safety refusals: covered by `lib/ai-chat.test.mjs`.

## Backend API audit

| Endpoint | Method allow | Auth | Body limit | Validation | Safe errors |
|---|---|---|---|---|---|
| /api/chat | POST only (others 405) | none | 8KB | messages array, role, content | YES |
| /api/audit | POST only | none | 16KB | zod parseAuditPayload | YES |
| /api/owner/whoami | POST only | bearer token | n/a | email allowlist + AAL2 | YES (private headers) |
| /api/owner/notification-readiness | exists | bearer token | n/a | n/a | YES |
| /api/owner/export | exists | bearer token | n/a | n/a | YES |
| /api/webhooks/resend | exists | webhook signature | n/a | n/a | YES |

No IDOR, no leaked secrets in responses. RLS on tables that exist.

## Security pass

- npm audit --omit=dev: pending (run before deploy).
- No `service_role` key in client bundle (used only in /api/audit).
- No MiniMax key in client bundle.
- No Netlify PAT in runtime.
- Web headers (next.config.mjs): X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy.
- No CSP yet. Should add.

## SEO

- metadataBase: driven by NEXT_PUBLIC_SITE_URL with localhost fallback.
- Sitemap.js: produces 30 routes.
- robots.js: allows all, references sitemap.
- Login/owner routes: /login has noindex; /owner has no noindex (should add).
- /account, /signup, /forgot-password, /update-password, /owner/login, /chat: should be noindex.
- canonical: `./` per route.

## DB migrations

- 17 migration files already applied to Supabase project (per prior cycles).
- Required new migrations:
  1. `public.profiles` table + RLS
  2. `public.chat_sessions` + RLS
  3. `public.chat_messages` + RLS
  4. `public.inquiries` add `user_id uuid null references auth.users(id)`
  5. Optional: `customer_inquiries_select_own` RLS policy

## Production env

Required per `lib/release-config.mjs`:
NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY, AI_API_BASE, AI_API_KEY, AI_MODEL, EMAIL_PROVIDER, EMAIL_NOTIFICATION_RECIPIENT, EMAIL_FROM, RESEND_API_KEY, RESEND_WEBHOOK_SECRET.

All 12 currently uploaded to Netlify new site context (per .ironwake/release/NETLIFY_RELEASE_STATE.json env_status).

## Production-equivalent build

- `npm run build` (Netlify build command runs `verify-release-config.mjs && next build`).
- Required manifest: /signup, /login, /forgot-password, /update-password, /account, /chat, /owner/login, /owner, /audit, /api/chat, /api/audit, auth handlers.

## Outstanding mandatory defects (P0/P1)

| # | Defect | Severity |
|---|---|---|
| 1 | No customer auth UI (signup/login/forgot/update/account) | P0 |
| 2 | Owner login at /login collides with customer auth intent | P0 |
| 3 | No persistent authenticated chat | P0 |
| 4 | No customer-owned Supabase tables (profiles/chat_sessions/chat_messages) | P0 |
| 5 | SiteHeader exposes no Sign in / Create account | P0 |
| 6 | Home FAQ claims Ask IronWake is "not an AI agent" while /api/chat uses MiniMax-M3 | P0 |
| 7 | /work claims every project is "a live demonstration you can open and inspect" but 3 are pending | P0 |
| 8 | /insights "Read more" links have no destination | P0 |
| 9 | /privacy / /terms do not mention Supabase Auth accounts or persisted authenticated chat | P0 |
| 10 | No `@supabase/ssr` cookie-based session | P0 |
| 11 | /owner not noindex | P1 |
| 12 | No CSP | P1 |
| 13 | No /auth/confirm handler | P1 (can rely on Supabase redirect; route can be a passthrough) |
| 14 | No safe-area / mobile composer polish | P1 |
| 15 | No global chat entrance animation | P2 |
| 16 | No account transition animation | P2 |

## Completion contract gates (will be checked)

- [x] full route audit (this file)
- [ ] all dead links removed
- [ ] all public buttons functional
- [ ] anonymous Sign in visible desktop
- [ ] anonymous Sign in visible mobile
- [ ] Create account visible desktop
- [ ] Create account visible mobile
- [ ] real customer signup
- [ ] real customer login
- [ ] session persistence
- [ ] password recovery
- [ ] customer account
- [ ] customer profile
- [ ] customer RLS
- [ ] cross-user isolation
- [ ] owner/customer separation
- [ ] owner MFA/AAL2
- [ ] Ask IronWake visible to every visitor
- [ ] Ask IronWake visible to customer
- [ ] global chatbot animated and responsive
- [ ] full /chat animated and responsive
- [ ] anonymous chat works
- [ ] customer chat persists
- [ ] chat history loads
- [ ] account conversation history works
- [ ] audit flow works
- [ ] privacy correct
- [ ] terms correct
- [ ] stale AI copy removed
- [ ] portfolio wording truthful
- [ ] benchmark claims defensible
- [ ] insights links functional/truthful
- [ ] pricing/provider wording aligned
- [ ] desktop visual QA
- [ ] mobile visual QA
- [ ] keyboard accessibility
- [ ] reduced motion
- [ ] no hydration errors
- [ ] no console errors
- [ ] API security
- [ ] RLS security
- [ ] dependency security
- [ ] no leaked secrets
- [ ] production env complete
- [ ] fresh production-equivalent build
- [ ] clean release HEAD
- [ ] ONE final production deploy
- [ ] bounded real production acceptance
