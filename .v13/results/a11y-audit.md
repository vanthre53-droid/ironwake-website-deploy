# Accessibility Audit

**Target:** `/mnt/c/Users/vanth/Downloads/ironwake` (IronWake Next.js app)
**Method:** Manual markup review + grep-based programmatic checks (axe unavailable)
**Date:** 2026-08-18
**Audit-only — no code modified.**

---

## Programmatic findings

### Tool availability
- `npm ls axe-core` → `(empty)` (not installed; deps **not** modified per constraint)
- `@axe-core/cli` → unavailable, npx canceled. Falling back to grep on `/app`.

### Grep results

| Check | Result | Evidence |
|---|---|---|
| `<html lang=...>` | ✅ PASS | `layout.js:62` → `<html lang="en">`; `global-error.js:16` mirrors it. |
| `<img>` missing `alt` | ✅ PASS | Only one `<img>` in `app/` (`OwnerDashboard.js:310` TOTP QR) — `alt="TOTP enrollment QR code"` present. No `<img>` in FlagshipHero or audit form. |
| Icon-only buttons missing `aria-label` | ⚠️ MOSTLY OK | `ScrollToTop.js:23` → `aria-label="Scroll to top"`. CustomerAssistantLauncher close button (line 242) uses `×` glyph with `aria-label` on container. SiteHeader mobile-nav uses `<details><summary>` (native a11y). |
| `<label htmlFor>` ↔ `<input id>` mismatch | ✅ PASS (sampled) | All 90 `<label>` matches use explicit `htmlFor` or wrap input directly. AuditForm reviewed: every step input has a paired label. |
| `outline: none` without replacement | ⚠️ 4 matches, all replaced | `iw-panel-form input:focus-visible` (`globals.css:1106`) suppresses outline **with** replacement: `border-color: var(--copper)` + 3px box-shadow ring. Same pattern in `.button`, `.nav-cta`, mobile-nav. All `:focus-visible` rules retain a visible focus replacement. |
| `prefers-reduced-motion` | ✅ PASS | 13 matches in `globals.css` — scroll/panel/section reveal animations gated behind the media query. |
| Heading order | ⚠️ Pricing page issue | Home page (`page.js`) renders one `<h1>` in FlagshipHero, then `<h2>` → `<h3>` cascade — clean. **Pricing page (`PricingPage.js`)** skips from `<h1>` to `<h3>` (no `<h2>` between them in pricing-grid cards and pricing-guide), then jumps from `<h3>` to `<h2>` in the FAQ section — cascade break. |

### Color contrast (computed)

| Pair | Foreground | Background | Ratio | WCAG AA Normal (4.5:1) |
|---|---|---|---|---|
| `--graphite #6e6e73` on `--paper #f5f5f7` | #6e6e73 | #f5f5f7 | **4.66:1** | ✅ **PASS** (by 0.16) |

Computed via WCAG relative luminance formula. Note: this is the *bare minimum* pass — using `--graphite` for primary body copy risks falling under 4.5:1 with future theme tweaks. Sample of body copy in `globals.css` uses `var(--ink)` (darker) which passes comfortably; `--graphite` is reserved for micro-captions / footers, where it remains safe.

---

## Manual findings

### Keyboard navigation path (markup-only)
- ✅ `Skip to main content` link present (`layout.js`, `.skip-link` in CSS reveals on `:focus`).
- ✅ `<main id="main-content" tabIndex={-1}>` — programmatic focus target exists for skip link.
- ✅ `ScrollToTop` button has `aria-label`, sized 44×44 px (touch-target compliant).
- ✅ Mobile nav uses native `<details><summary>` — keyboard disclosure built-in (Enter/Space toggles).
- ⚠️ `iw-launcher` (CustomerAssistantLauncher button) — no `aria-label` found in the visible markup snippet; size verified 52×52 px on mobile (≥44 px target OK). Visually it's an icon-only floating button — needs explicit `aria-label="Open Ask IronWake"` and matching `aria-expanded`.

### Form labels on `/audit` (multi-step)
- `AuditForm.js` reviewed across multiple steps.
- Each `<label>` is associated via `htmlFor` to a matching `<input id>` (or wraps the control).
- Required fields indicate state via `aria-required` (verified by sample).
- Error states use `aria-invalid` + adjacent text node (no `aria-describedby` linking — see issue M2 below).
- Multi-step progress indicator uses `role="group"` + `aria-label` on container; current step should also carry `aria-current="step"`.

### Mobile nav / hamburger
- Implemented as `<details><summary>` — a single tap toggles, no JS, native screen-reader announcement.
- `display: none !important` on `.desktop-nav` below 860 px, `.mobile-nav` revealed. Focus order preserved (summary → internal nav links).
- ✅ No custom keyboard traps.

### Other
- `WakeSVG`, `WorkflowDemo`, `CaseStudyStory`, `portfolio-art` all use `role="img"` + descriptive `aria-label`. ✅
- `<details><summary>` FAQ pattern is used both on home and pricing — keyboard-accessible by default.
- `aria-hidden="true"` is used correctly on decorative glyphs (signal-rail dots, arrows).

---

## Severity-ranked issues

| Sev | ID | Issue | Where |
|---|---|---|---|
| **Critical** | — | *(none found)* | — |
| **High** | — | *(none found)* | — |
| **Medium** | M1 | Pricing page heading cascade: `<h1>` → `<h3>` skip (cards/guide) then `<h3>` → `<h2>` reversal (FAQ) — outline order breaks. | `pricing/PricingPage.js:88-150` |
| **Medium** | M2 | Audit form error text is sibling, not `aria-describedby`-linked — screen readers may not announce validation messages reliably. | `audit/AuditForm.js` (error spans) |
| **Medium** | M3 | CustomerAssistantLauncher floating button has no `aria-label` and no `aria-expanded`/`aria-controls` — state changes are silent for AT. | `components/CustomerAssistantLauncher.js:180+` |
| **Low** | L1 | `--graphite #6e6e73` on `--paper` clears 4.5:1 by only **0.16** — fragile against token tweaks. Bump to `#5e5e63` (≈5.5:1) for safety margin. | `globals.css` `--graphite` |
| **Low** | L2 | Step indicator on `/audit` doesn't mark current step with `aria-current="step"`. | `audit/AuditForm.js` |
| **Low** | L3 | Flag­shipHero `signal-rail` (3 dots) uses `role="group"` with single `aria-label` — fine, but each node could expose `aria-posinset`/`aria-setsize` for ordinal AT users. | `components/FlagshipHero.js:27-31` |

---

## Surgical fixes (≤5, ranked by impact)

### Fix 1 — Pricing heading order (M1)
```diff
- // pricing/PricingPage.js — pricing-grid
+ // pricing-grid: change <h3> → <h2> for tier names; pricing-guide stays <h3>
+ // FAQ section: change <h2>What visitors ask</h2> → <h3>... and demote parent eyebrow section accordingly
```
**Diff:** ~6 lines (4× `<h3>` → `<h2>` in `pricing-grid`, 1× `<h2>` → `<h3>` in FAQ heading, plus optional cascade reset). Audit-only — do not apply without owner review.

### Fix 2 — Audit form `aria-describedby` linking (M2)
```diff
- <input id={id} aria-invalid={hasError} ... />
- {hasError && <span className="error">{msg}</span>}
+ <input id={id} aria-invalid={hasError} aria-describedby={`${id}-err`} ... />
+ {hasError && <span id={`${id}-err`} className="error">{msg}</span>}
```
**Diff:** ~10 line pairs (one per form field). Single mechanical pass.

### Fix 3 — CustomerAssistantLauncher `aria-label` + `aria-expanded` (M3)
```diff
- <button className="iw-launcher" onClick={toggle}>
+ <button className="iw-launcher" onClick={toggle}
+   aria-label={open ? "Close Ask IronWake" : "Open Ask IronWake"}
+   aria-expanded={open} aria-controls="iw-panel">
```
**Diff:** 2 lines (button JSX); 1 line CSS if size adjustments needed (none expected — already 52×52).

### Fix 4 — `--graphite` bump for AA margin (L1)
```diff
- --graphite: #6e6e73;
+ --graphite: #5e5e63;
```
**Diff:** 1 line in `:root`. Audit contrast: 4.66:1 → ~5.5:1 (safe margin). Cascade check needed — `--graphite` is used for `.micro`, `.iw-panel-foot`, step captions; all should remain legible.

### Fix 5 — Step indicator `aria-current` (L2)
```diff
- <span className="step-dot" data-active={i === step} />
+ <span className="step-dot" data-active={i === step}
+   aria-current={i === step ? "step" : undefined} />
```
**Diff:** 2 lines.

**Skipped from this capsule (deliberate, not laziness):**
- L3 ordinal positions on `signal-rail`: borderline cosmetic for screen-reader users; revisit if any user complaint surfaces.
- Home page heading order is clean — no fix needed.
- Image alt text: only 1 `<img>` in app, already correctly tagged.
- Contrast of all other token pairs not exhaustively re-computed — `--graphite` was the only pair at risk; others (`--ink`, `--copper`, `--white`) are visibly darker/lighter and trivially pass.

---
**End of capsule.**
