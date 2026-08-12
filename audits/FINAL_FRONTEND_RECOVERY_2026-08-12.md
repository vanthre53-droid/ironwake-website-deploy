# IRONWAKE — FINAL FRONTEND RECOVERY AUDIT
**Date**: 2026-08-12
**Baseline HEAD**: 39eb1076057e9a2ae3a975b9686c49c501224c68 (rollback SHA)
**Live site (canonical)**: https://ironwake-system.netlify.app (Netlify site ee1810a8-877d-482f-b959-01185aa2a67d)
**Local production-equivalent serve**: http://localhost:4321 (next start on built `.next`)
**Local screenshots captured**: /tmp/shots/ (84 baseline captures across 14 routes × 6 viewports)
**Local visual audit dumps**: /tmp/audit/ (15 routes × JSON)
**Console/page errors captured**: /tmp/shots/console.log

---

## 1. PROTECTED BASELINE AT 39eb107 (recorded before any edit)

| Check | Result |
| --- | --- |
| `git status` | clean (no working tree changes) |
| HEAD | `39eb1076057e9a2ae3a975b9686c49c501224c68` |
| `npm test` (full canonical suite) | **218/218 passing** |
| `npm run build` (production build) | **PASS** — 47 routes built including /signup /login /forgot-password /update-password /account /auth/confirm /chat /owner /owner/login /owner/reset-password /audit /api/chat /api/audit /api/owner/whoami /api/owner/export /api/owner/notification-readiness /api/webhooks/resend /insights/[slug] /sitemap.xml /robots.txt |
| Route inventory | /, /work, /work/<9 cases>, /systems, /systems/{ai-receptionist,booking-control,missed-lead-recovery,trust-lead-capture}, /process, /pricing, /insights, /insights/[slug], /about, /industries, /industries/{dental-clinics,home-services,salons-spas}, /audit, /book, /scope, /login, /signup, /forgot-password, /update-password, /account, /auth/confirm, /chat, /owner, /owner/login, /owner/reset-password, /admin, /privacy, /terms, /api/{chat,audit,owner/*,webhooks/resend}, /sitemap.xml, /robots.txt, /manifest.json, /icon.svg |

Netlify site ID (authorised): **ee1810a8-877d-482f-b959-01185aa2a67d** ← confirmed via .netlify/state.json
Forbidden site (must not touch): 1927c0b3-532f-469c-b302-1d96cb9c7367

---

## 2. VISUAL BASELINE — ACTUAL RENDERED PRODUCT (anonymous, all routes)

Inspection method:
- Started production-equivalent local server (`npx next start -p 4321`) against the existing `.next` build.
- Used headless Chromium (puppeteer-core + Playwright-shipped chrome binary at `~/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`).
- Captured 84 viewport screenshots across 14 routes × {1440, 1366, 1024, 768, 390, 360}.
- Captured 15 page-level JSON dumps (computed styles, layout rects, headings, link counts, errors, scroll dimensions, floating widget presence).
- No console errors observed on any anonymous public route during baseline capture.

---

## 3. FRONTEND DEFECT LEDGER

Severity scale: P0 (broken/blocks task), P1 (visibly wrong on primary path), P2 (visible inconsistency), P3 (polish).

| ID | Route | Viewport | Auth state | Defect | Severity | Root cause | Fix | Regression risk | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | ALL | desktop | anonymous | **Floating chatbot widget is not actually floating**: the `.assistant-widget` and `.assistant-launch` CSS rules only define `animation`/`transition` — no `position: fixed`, no `bottom`/`right` on desktop. The button renders as an `inline-block` 130px×35px pill at the very END of the body (y≈8264px on home, y≈8300px on most pages). On the visible viewport above the fold, the user sees nothing. Only on mobile (≤640px) the `bottom`/`right` declaration kicks in, but even then there's no `position: fixed` so it's still static positioning relative to flow. | P0 | globals.css missing positioning rules for `.assistant-widget`, `.assistant-launch` on desktop | Replace widget positioning rules; build proper round floating icon (Phase E) | None: animation already wrapped, fixing position only makes it visible | OPEN |
| F-002 | ALL | desktop | anonymous | **Chatbot shown to anonymous visitors**: goal §8 requires NO persistent floating chatbot for unauthenticated visitors. Current layout mounts `<AssistantWidget />` for everyone (root layout) and shows "Ask IronWake" pill at bottom of body for all states. | P0 | root `app/layout.js` unconditionally renders AssistantWidget for all visitors; widget is anonymous-friendly by design ("No login required") | Make widget mount ONLY when an authenticated CUSTOMER session exists; remove unconditional rendering; gate by server-side cookie/session | Low: server actions and /api/chat already accept anonymous callers — but goal requires customer-only widget | OPEN |
| F-003 | ALL | desktop | anonymous + authenticated | **No round IronWake-branded floating icon**. Current launcher is a rectangular pill ("Ask IronWake", 130×35) with `border-radius: 0`. Goal §8 explicitly requires ROUND branded icon, 52-60px desktop / 48-56px mobile, with IronWake identity. | P0 | F-001 + widget design uses text label, not icon | Replace launcher with circular icon (SVG mark preferred) | None — purely visual | OPEN |
| F-004 | ALL | all | anonymous | **Animation not visibly working in production**: `.assistant-widget`, `.assistant-panel`, MotionReveal, .motion-reveal keyframes exist in CSS, but MotionReveal starts at `transform: translateY(22px)` + `filter: saturate(.9)` and only adds `.is-visible` via IntersectionObserver. If JS hydrates late or the observer doesn't fire, content sits offset and desaturated. Hero has `animation: hero-enter` on `.hero h1` only — once. | P1 | MotionReveal hides content until visible; failure mode keeps it hidden. No fail-safe motion rule in place. | (a) Make initial state visible (`opacity: 1; transform: none; filter: none`) and animate IN from a less-extreme state, (b) or guarantee observer fires synchronously, (c) test in built `.next` | Low: visual change, no logic | OPEN |
| F-005 | /login, /signup, /forgot-password | desktop + mobile | anonymous | **Auth pages feel developer-form-y**: `.auth-shell` + `.auth-card` use generic card-on-shell composition. Form hierarchy not visually premium. Copy adequate but spacing/typography inconsistent. Goal §7 demands "premium IronWake customer surface." | P1 | Existing styles use generic padding/radius; no brand-specific treatment for auth | Phase D — refine `.auth-shell`, `.auth-card`, `.auth-field`, `.auth-strength`, submit button | Low | OPEN |
| F-006 | /signup | all | anonymous | **Two password fields**: signup form asks for both `password` and `confirm`. Common pattern, but goal §7 says "compact benefits, do not bury the form under excessive marketing copy." Combined with the aside, layout is busy. | P2 | Confirm-password field is present (legitimate) | Keep functionality; review spacing/composition | None | OPEN |
| F-007 | /account | desktop | authenticated | **Account dashboard presentation**: tested only via route existence. Goal §10 requires OVERVIEW / CONVERSATIONS / REQUESTS / PROFILE / SECURITY hierarchy. Need to verify visual hierarchy matches. | P1 | Pre-existing — need visual inspection when authenticated | Phase D | None | OPEN |
| F-008 | /chat | all | authenticated | **Chat page presentation**: full-page chat uses ChatClient. Need to inspect for premium conversation layout. | P1 | Pre-existing | Phase F | None | OPEN |
| F-009 | ALL | 360, 390 | anonymous | Need to inspect mobile menu, footer, cards, and verify no horizontal scroll, no clipped CTAs. | P2 | Pre-existing | Phase I | None | OPEN |
| F-010 | ALL | all | anonymous | **Footer contains "Ask IronWake" link** in addition to widget button — duplicates purpose, clutters footer for anonymous visitors. | P2 | Footer hardcoded link in SiteFooter | Phase C — footer polish | None | OPEN |
| F-011 | Header | all | both | Header has 9 nav links + Sign in/Create/Book Diagnostic. On mobile (≤640px) it's hidden behind `<details>`. Need to verify mobile menu UX. | P2 | Pre-existing | Phase C | None | OPEN |
| F-012 | Footer | 360 | anonymous | Footer has 12 links crammed into potentially few columns. Need to verify mobile wrap. | P2 | Pre-existing | Phase C | None | OPEN |
| F-013 | /pricing | all | anonymous | Need visual inspection — pricing cards consistency. | P2 | Pre-existing | Phase H | None | OPEN |
| F-014 | /work, /work/[case] | all | anonymous | 9 case-study pages — verify visual consistency, hero, structure. | P2 | Pre-existing | Phase H | None | OPEN |
| F-015 | /insights, /insights/[slug] | all | anonymous | 4 insight articles — verify typography, readability, layout. | P2 | Pre-existing | Phase H | None | OPEN |
| F-016 | /systems, /systems/[slug] | all | anonymous | 4 system pages — verify cards consistency, CTA prominence. | P2 | Pre-existing | Phase H | None | OPEN |
| F-017 | /owner/login | desktop | owner | Owner login — verify visually quiet per goal §7. | P2 | Pre-existing | Phase H | None | OPEN |
| F-018 | /about, /process | all | anonymous | Need visual inspection. | P2 | Pre-existing | Phase H | None | OPEN |
| F-019 | Performance | all | — | Need to measure baseline. Page document height on home is 8300px — quite long. Confirm not heavy. | P3 | Pre-existing | Phase I | None | OPEN |

---

## 4. ROOT CAUSE: F-001 + F-002 + F-003 (intertwined)

The current AssistantWidget design contradicts goal §8 in three independent ways:

1. **Wrong shape**: text pill, not round.
2. **Wrong position**: `position: static` (no `position: fixed` anywhere on desktop), so it falls inline at the bottom of the document.
3. **Wrong audience**: mounted for everyone, including anonymous, contradicting "ANONYMOUS visitor: NO persistent floating chatbot."

Root cause in globals.css:
- Line 717: `.assistant-widget { animation: assistant-enter .25s ease-out; }` — no position.
- Line 718: `.assistant-launch { transition: transform .15s ease, background .2s ease; }` — no position, no round shape.
- Line 724 (mobile-only): `.assistant-launch { bottom: ...; right: ...; }` — sets offset but `position` is still default `static`, so `bottom`/`right` have no effect on layout.

**Plan**:
- Delete unconditional `<AssistantWidget />` from `app/layout.js`.
- Add a new client component `app/components/CustomerAssistantLauncher.js` that:
  - Reads Supabase session via `createBrowserSupabase` (already used by SiteHeader).
  - Renders nothing for anonymous visitors, owner visitors (account_kind === 'owner'), and during initial hydration (no layout flash).
  - When authenticated customer: renders a round floating button (IronWake monogram SVG, 56px desktop, 52px mobile) at `bottom-right`, safe-area aware.
  - On click: opens a polished floating chat panel (preserved design from AssistantWidget but new component or restructured).
- Chat panel + chat session state lifted into a small store or context so navigation doesn't destroy active chat (goal §8 "Do not duplicate chat sessions").
- Auth: keep `/api/chat` working for anonymous too — just don't show widget.

This satisfies:
- Goal §3: don't break working API.
- Goal §8: customer-only round icon, no anonymous widget.
- Goal §2: backend untouched.

---

## 5. ANIMATION ROOT-CAUSE PLAN (F-004)

- `.motion-reveal` initial state hides content (transform + filter). If observer misses, content is broken.
- Hero entrance relies on `.hero h1` animation but only `from { opacity: 0 }` to `to { opacity: 1 }` — works only once and only if CSS loads.
- No fail-safe: if JS fails, hidden state persists.

Fix:
- Default `.motion-reveal` to **visible** (`opacity: 1; transform: none; filter: none`). Animation only adds subtle entrance enhancement when `.is-visible` triggers.
- Hero entrance: keep but ensure h1 isn't `opacity: 0` permanently if animation doesn't run.
- Test in production build, not just dev.

---

## 6. PHASE PLAN

| Phase | Scope | Status |
| --- | --- | --- |
| A | Visual capture + frontend flaw inventory | **IN PROGRESS** (this file) |
| B | Design-system normalization (tokens, components) | pending |
| C | Navigation/global layout polish | pending |
| D | Login/Signup/Password/Account UX | pending |
| E | Customer-only floating ROUND IronWake chatbot | pending |
| F | Full /chat experience polish | pending |
| G | Production animation root-cause + correction | pending |
| H | Remaining route polish | pending |
| I | Responsive/accessibility/performance closure | pending |
| J | Security/customer-data regression | pending |
| K | Complete visual/product regression | pending |
| L | Final release freeze | pending |
| M | ONE final production deployment | pending |

---

## 7. STRIX PLAN

Will be invoked in PHASE J only, AFTER all frontend changes are complete.
- Model: `chatgpt/gpt-5.6-sol` (no fallback)
- Mode: `--scan-mode quick --scope-mode diff --diff-base 39eb107`
- Scope: customer-data isolation only (cross-customer leaks, IDOR, session leaks, XSS exposing customer data, auth-state confusion). Not a full pentest.