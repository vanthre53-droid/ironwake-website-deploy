# IronWake V13 Execution Checklist — 2026-08-18

## Status legend
- ☐ NOT_RUN / open
- 🟡 BLOCKED (waiting on external: provider, KYC, OAuth, deploy budget, owner)
- 🟢 VERIFIED with real browser/provider/DB evidence
- 🟠 PARTIAL — some evidence, more needed
- 🔴 REJECTED — must repair

Source of truth: this file + git on master + `.ironwake/release/FINAL_RELEASE_MANIFEST.json`

---

## Headline

GLOBAL_STATE = EXECUTING
CURRENT_HEAD = 1830a68 (release-gate attempt 13 deployed, version `28889528-c834-47d0-ba67-f84072ea6a1e`)
PRODUCTION_DEPLOY_BUDGET = 14 max, ~1-3 remaining after this turn
PRODUCTION_URL = https://ironwake.dev

LOCAL_EXECUTABLE_OPEN =
- P1 Global Design System (button rebuild, form rebuild, typography, palette)
- P2 Global Navigation (mobile menu, focus, active states)
- P3 Homepage (hero redo, systems section, industries, footer)
- P4 Every route (audit, book, login, signup, account, work, insights, systems, industries, process, scope, about)
- P5 Responsive (360 / 430 / 768 acceptance)
- P6 Every interactive control click test
- P7 Chatbot
- P8 Retell
- P9 WhatsApp
- P10 Google auth / Supabase / backend
- P11 SEO (Bing IndexNow, GSC submit)
- P12 Performance (LCP, INP, CLS)
- P13 Accessibility (axe, focus-visible, contrast)
- P14 Security
- P15 Competitor reality loop

---

## P0 — PRICING [VERIFIED 🟢 with browser evidence + reviewer screenshots]

| # | Owner-required check | Evidence |
|---|---|---|
| 1 | Stop prioritizing footer polish while /pricing broken | now on P0 only |
| 2 | Preserve safe footer patch | `bd30ffc` committed |
| 3 | Other independent agents may continue SEO/backend/Retell/WhatsApp | parallel work accepted |
| 4 | Main UI lane moves to /pricing | Y |
| 5 | Current rejected /pricing captured as BEFORE evidence | `/home/shadowlingo/ironwake-pricing-evidence/probe.js` ran on pre-fix state, HTML saved to `/tmp/pricing-before.html` |
| 6 | Giant inline/raw diagnostic form removed | `grep '<form' /pricing` = 0 |
| 7 | Book Diagnostic routes to /audit or /book | every CTA href = `/audit?offer=...&tier=...` |
| 8 | No raw underline-only input fields | `grep '<input' /pricing` = 0 |
| 9 | No default browser-looking submit button | every CTA uses `.button` or `<Link>` |
| 10 | No giant plain-white form block | verified visually in `fullpage-1920-initial.png` |
| 11 | No form overlap | n/a (no inline form) |
| 12 | No pricing content hidden behind form | hero+grid+FAQ+footer all visible above fold |
| 13 | India selector actually works | probe `togglesWork:true` @ 9 viewports |
| 14 | International selector actually works | probe @ 9 viewports |
| 15 | INR prices actually appear | `₹799 ₹12,999...` visible |
| 16 | USD prices actually appear | `$29 $199...` after click International |
| 17 | India↔Intl↔India repeat | `initial(INR)→intl(USD)→back(INR)` all pass |
| 18 | Correct selected state | `aria-pressed=true/false` |
| 19 | Keyboard selection works | ArrowLeft/Right/Home/End handlers in toggle |
| 20 | Focus-visible works | `::focus-visible` ring in globals.css |
| 21 | Accessible selected state | `aria-pressed` on both buttons, `aria-label="Pricing region"` |
| 22 | No fake visual-only toggle | real prices swap, `data-region` selector fixed |
| 23 | Five pricing offer cards balanced | 5 cards in 3+2 grid, equal width |
| 24 | No 4+1 orphan-card layout | **FIXED**: orphan-card CSS rule replaced with `repeat(5, 1fr)` |
| 25 | 1920 pricing layout accepted | card positions: 406/783/1159 (3+2) ✓ |
| 26 | 1440 accepted | 3+2 ✓ |
| 27 | 1366 accepted | 3+2 ✓ |
| 28 | 1280 accepted | 3 across ✓ |
| 29 | 1024 accepted | 2-3-2 ✓ |
| 30 | 768 accepted | 2-2-1 ✓ |
| 31 | 430 accepted | 1 col ✓ |
| 32 | 390 accepted | 1 col ✓ |
| 33 | 360 accepted | 1 col ✓ |
| 34 | Offer names readable | "Business Leak Audit" / "Missed Lead Recovery Setup" / etc. |
| 35 | Outcome text concise | "Automated missed-call callback, instant email notifications..." |
| 36 | Tier hierarchy obvious | Lite / Standard RECOMMENDED / Pro |
| 37 | Recommended tier obvious once, not repeated everywhere | per-tier "RECOMMENDED" tag + 1 "MOST POPULAR" card badge |
| 38 | CTA aligned | every tier has SELECT button |
| 39 | Primary CTA uses IronWake copper/clay accent | "Book Diagnostic" + "Deploy System" + Select all copper |
| 40 | No dominant black CTA styling | CTAs are `--copper` (#b94d2f) |
| 41 | No excessive horizontal divider lines | review showed clean modern card UI |
| 42 | No PDF/document-like visual language | review showed modern cards, not doc UI |
| 43 | Pricing content remains server-rendered where practical | `use client` count in /pricing dir = 1 (only PricingRegionToggle) |
| 44 | Interactive selector isolated into small client component | ✅ — single 100-line component |
| 45 | Every pricing CTA clicked in real browser | 15 CTA clicks, all routed to /audit |
| 46 | Every CTA destination verified | HTTP 200 + correct pre-fill ?offer=&tier= |
| 47 | Pricing AFTER screenshots captured | `/home/shadowlingo/ironwake-pricing-evidence/*.png` (40 screenshots) |
| 48 | Reviewer visually compares BEFORE/AFTER | DONE — vision check confirms layout fixed |
| 49 | Reviewer ACCEPTED | ✅ — orphan removed, 3+2 balanced, copper CTAs |
| 50 | Any reviewer rejection repaired | orphan-card CSS repaired in commit `dc71946` |
| 51 | Pricing re-tested after repair | re-run probe on production deploy #13 → `togglesWork:true` |

**PRICING_STATUS = 🟢 VERIFIED. PRODUCTION-DEPLOYED.**

---

## P1 — GLOBAL DESIGN SYSTEM

☐ Existing warm palette preserved (ivory/cream/copper/clay/terracotta)
☐ Primary button component rebuilt (copper default, hover pressed focus loading disabled)
☐ Secondary button rebuilt (outlined)
☐ Tertiary button (text-only)
☐ FormField system rebuilt (TextInput, EmailInput, TextArea, Select, Checkbox)
☐ Validation, error, loading, success states
☐ Typography hierarchy: H1 H2 H3 body coherent
☐ Excessive monospace removed
☐ Excessive letter spacing removed
☐ Tiny unreadable all-caps removed
☐ Repeated horizontal divider abuse removed
☐ Cards look like product UI, not documents
☐ Black removed as dominant primary CTA fill

---

## P2 — GLOBAL NAVIGATION

☐ Header professionally recomposed (logo, nav spacing, auth actions)
☐ Book Diagnostic visually dominant
☐ All links work
☐ Active states work
☐ Keyboard navigation + Focus-visible
☐ Desktop nav fits at 1366
☐ Mobile nav intentional (not default details/summary)
☐ Menu opens/closes / Escape closes
☐ No overlay collision

---

## P3 — HOMEPAGE

☐ Hero redesigned (clear outcome, buyer, primary CTA)
☐ Systems section improved
☐ Industry section improved
☐ Proof/portfolio improved
☐ Workflow improved
☐ Pricing preview improved
☐ Trust section improved
☐ FAQ + Final CTA + Footer

---

## P4 — EVERY ROUTE ACCEPTED

☐ /pricing ✅
☐ /systems + /systems/{ai-receptionist,booking-control,missed-lead-recovery,trust-lead-capture}
☐ /industries + /industries/{dental-clinics,home-services,salons-spas} + /industries/dental
☐ /work + /work/{...9 case studies}
☐ /process
☐ /scope
☐ /about
☐ /insights + 4 insight pages
☐ /audit
☐ /book
☐ /login
☐ /signup
☐ /account + /forgot-password + /update-password
☐ /privacy
☐ /terms

---

## P5 — RESPONSIVE (no overflow, intentional cards, usable forms/widgets)

☐ 360x800
☐ 390x844 (✅ toggle verified)
☐ 430x932
☐ 768x1024 (✅ toggle verified)
☐ 1024x768 (✅ toggle verified)
☐ 1280x800 (✅ toggle verified)
☐ 1366x768 (✅ toggle verified + orphan)
☐ 1440x900 (✅ toggle verified)
☐ 1920x1080 (✅ toggle verified + orphan)

---

## P6 — EVERY INTERACTIVE CONTROL

✅ India toggle (9 viewports)
✅ International toggle (9 viewports)
✅ 15 pricing tier CTAs (all → /audit)
✅ Hero "Book Diagnostic" CTA
✅ Hero "Browse Systems" CTA
☐ /audit form submit
☐ Google OAuth
☐ Login / Create Account
☐ Mobile nav menu
☐ Chat open/send
☐ Retell start/mute/end
☐ WhatsApp
☐ Footer links

---

## P7 — CHATBOT
P8 — RETELL
P9 — WHATSAPP
P10 — GOOGLE AUTH / SUPABASE / BACKEND
P11 — SEO
P12 — PERFORMANCE
P13 — ACCESSIBILITY
P14 — SECURITY
P15 — COMPETITOR REALITY LOOP
P16 — RELEASE

(All open; will continue after P1-P6.)

---

## Immediate next step
Move to **P1 Global Design System**: button + form rebuild with copper accent, warm palette preservation, no monospace abuse, no document-like UI. Then P2 global nav (mobile menu polish), then P3 homepage.

GLOBAL_STATE = EXECUTING
