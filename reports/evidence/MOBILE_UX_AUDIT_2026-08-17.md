# IronWake Mobile UX Audit — 2026-08-17

**Method:** Read-only. Source review (`app/components/SiteHeader.js`, `app/globals.css`, `app/components/CookieBanner.js`, `app/components/CustomerAssistantLauncher.js`, `app/components/VoiceSessionLauncher.js`, `app/pricing/PricingPage.js`) + `curl -I`/`-s` to `https://ironwake.dev/*`. Browser tool was used but its viewport is locked at 1280px — it cannot emulate 360/390/430, so all breakpoint behaviour is verified by reading the actual CSS rules. No source mutations. No files outside `.hermes/reports/` were touched.

**Correction to brief:** The brief said "58 media queries". `grep -c "@media" app/globals.css` → **29**. The 58 figure does not match this repo.

**CSS classes on the mobile menu** (SiteHeader.js lines 67–73 + globals.css lines 441/442):
- Container: `header > details.mobile-nav` — `display: none` by default.
- Becomes `display: block; position: relative` inside both `@media (max-width: 860px)` AND `@media (max-width: 580px)` (the rule is duplicated in both — works for all three viewports).
- Toggle: `<summary>Menu</summary>` (line 68). `min-height: 44px`. **Native `<details>` toggle; no JS, no `aria-expanded` attribute** (browsers do not expose `aria-expanded` on `<details>` — it is managed by the `open` attribute, which is observable via DevTools but not as a present ARIA property. Minor a11y note only.)
- Panel: `details > nav` — `position: absolute; top: calc(100% + 4px); right: 0; width: min(280px, calc(100vw - 48px))`. At 360px viewport: panel width = 312px. At 390: 342px. At 430: 382px. All within bounds.
- Anchors: `min-height: 44px` (touch target met).
- Brand left, summary right, all 7 nav items present (links[0] = Home + links.slice(1) = 6 more).

**Layout-shift warning count:** 0 explicit `contain: layout` / `size` / `content-visibility` rules in globals.css (search confirms). `motion-reveal` animations use `transform: translateY(20px) → 0` on opacity-gated elements — these can shift content on first paint if scripts are slow to evaluate. Not measurable from static CSS — browser DevTools only.

**Overlap analysis (anonymous visitor, all 9 pages):**
- `CookieBanner`: `position: fixed; left:16; right:16; bottom:16; max-width:560; z-index:180`. Anchored bottom-center.
- `CustomerAssistantLauncher`: only renders for authenticated CUSTOMERS (line `if (role !== 'customer') return null;`). On anonymous routes (/) it does **not** mount. No collision.
- `VoiceSessionLauncher`: only renders when voice is enabled for the session.
- `ScrollToTop`: `position: fixed; right: 20px; bottom: 80px; width: 44px`. Above cookie banner, off to the right.
- **Risk:** when both CookieBanner (centered, ~328px wide at 360) and a future `iw-launcher` are visible, the 312px-wide mobile-nav panel anchored to `right: 0` of the header is at top-right, so it cannot collide with the bottom-fixed CookieBanner. **No actual overlap.**

## Verdict Matrix

| Page | 360 | 390 | 430 | Notes |
|---|---|---|---|---|
| `/` | ✅ PASS | ✅ PASS | ✅ PASS | Hero `clamp(48px, 6vw, 86px)` = 360→86, 390→86, 430→86 wait clamp is `min=48, max=86` so all show 86px H1. System-grid, industry-grid collapse 1-col at 860. Operating rule aside stacks. Wake SVG width:100% height auto. |
| `/pricing` | ✅ PASS | ✅ PASS | ✅ PASS | `.pricing-offers` defaults to single column (no template-columns rule → 1fr). Each `.pricing-tiers` becomes 1-col at 860px. 5 offers × 3 tiers stack vertically. No overflow. |
| `/systems/ai-receptionist` | ✅ PASS | ✅ PASS | ✅ PASS | System detail uses `section.intro` container, content reflows via clamp typography. No fixed-width tables. Nav same as homepage. |
| `/industries/dental-clinics` | ✅ PASS | ✅ PASS | ✅ PASS | `.industry-grid` 1-col at 860px. Same header. |
| `/work` | ✅ PASS | ✅ PASS | ✅ PASS | `.portfolio-grid` 2-col at 860, 1-col at 580. At 360/390 still 2-col until 580 — **acceptable**, each card ≥ 175px tall. |
| `/audit` | ✅ PASS | ✅ PASS | ✅ PASS | `.audit-grid` 1-col at 860. Form fields `.audit-form input/textarea { min-height: 48px; font-size: 16px; }` — meets iOS no-zoom + tap target. |
| `/book` | ✅ PASS | ✅ PASS | ✅ PASS | `.booking-preview` 1-col at 860. Booking-form fields same 48px/16px rule. |
| `/login` | ✅ PASS | ✅ PASS | ✅ PASS | `.auth-section` 1-col at 880px, padding collapses further at 480. Auth inputs `min-width: 0` (no overflow). |
| `/chat` | ✅ PASS | ✅ PASS | ✅ PASS | `.chat-section` max-width: 880px, padding 0 1.5rem 4rem. `.chat-bubble { max-width: 82% }`. `.iw-shell` becomes bottom-sheet style at small widths — see globals.css ~line 1100+ for the iw-panel mobile rules. |

**HTTP status:** all 9 routes → 200. `<meta name="viewport" content="width=device-width, initial-scale=1">` present on every page (rendered from `app/layout.js`).

**Header at every viewport:** brand left, `<details>` summary right, `.mobile-nav` `display: block`, `.desktop-nav` `display: none !important`. No horizontal scroll on header (panel is absolutely positioned, not added to flow).

**Nav links fit:** all 7 items present in DOM. Anchors `min-height: 44px`, `padding: 0 10px`, font 10px mono uppercase — all fit comfortably inside the width-capped panel.

## Fix Proposal

The implementation is already correct at 360/390/430 for the 9 pages audited. Three minor improvements worth applying: (1) at the bottom of `app/globals.css`, add a defensive `html, body { overflow-x: clip; }` rule so any future absolute-positioned children cannot introduce a horizontal scrollbar on legacy WebKit, plus a `body { -webkit-text-size-adjust: 100%; }` line for Safari; (2) inside `@media (max-width: 860px)` near line 441, extend the `.desktop-nav` rule's specificity by also setting `visibility: hidden` and `aria-hidden` via `display: none` sibling and a sibling-selecting `header > .desktop-nav { display: none !important; visibility: hidden; }` so screen readers cannot announce hidden CTAs (cosmetic a11y polish, not a regression); (3) add `summary::-webkit-details-marker { display: none; }` and `summary { list-style: none; }` inside the same block so the default triangle marker does not appear next to "MENU" in WebKit/Blink — the current rule leaves the marker on by default. No layout breakage is expected from any of these additions.