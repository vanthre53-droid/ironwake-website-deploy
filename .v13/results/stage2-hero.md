# V13 Stage 2 — Homepage Flagship Hero Scrollytelling

**Commit:** `371e9d1cbf207a4594f7bb2aaa48d7ac0e5d2c6e` (master)
**Worktree commit:** `a4263c6` (wt/v13-hero-flagship, abandoned — dirty main repo prevented clean merge)
**Date:** 2026-08-18
**Agent:** ironwake-ui
**Status:** COMPLETE_LOCAL; AFTER screenshots WAITING_EXTERNAL_NODE_MODULES (Playwright not installed in this env)

## Skills Referenced
- `apple-design-web` (flagship scrollytelling section patterns)
- `apple-design-motion` (parallax + scrub via CSS-only)
- `apple-design-interaction` (CTA + reveal)
- `premium-web-design` (typography + spacing)

## Principles Applied
- **Apple scrollytelling lineage**: sticky visual centerpiece + alternating copy beats, not full-screen takeover.
- **CSS-only motion**: no gsap/three/framer/lottie/lenis added. Bundle delta = 0 deps.
- **Existing primitives reused**: `<WakeSVG/>` centerpiece, `.glass--cool`, `.glass--strong`, `MotionReveal`, `SiteHeader`. **No deletions.**
- **Accessibility**: `prefers-reduced-motion` honored; `data-flagship-stage` toggled via `IntersectionObserver` (one-shot).
- **Token-driven colors**: all new CSS keys off `:root[data-flagship-stage="N"]` and existing `--paper/--stone/--ink/--copper` (neutralized values from `ed7a1b8`).

## Files Changed
| File | Change | LOC |
|------|--------|-----|
| `app/components/FlagshipHero.js` | NEW | +100 |
| `app/components/RevealSection.js` | NEW | +42 |
| `app/page.js` | surgical 2-line edit (import + replace `<section className="hero">` with `<FlagshipHero/>`) | +1 / -3 |
| `app/globals.css` | appended `.flagship-hero` namespace (~220 lines) AFTER `@keyframes signal-rail-glow` block, BEFORE `.section`. **Token block untouched.** | +222 |

## Before / After

| | BEFORE (ed7a1b8) | AFTER (371e9d1) |
|---|---|---|
| Hero structure | `<section className="hero">` flat, single-line JSX | `<FlagshipHero/>` component, 3 narrative beats |
| Visual centerpiece | `<WakeSVG/>` inline | `<WakeSVG/>` inside `.flagship-frame` sticky glass surface |
| Scroll behavior | none | `IntersectionObserver` toggles `data-flagship-stage` on `<html>`; CSS re-stages |
| Layout | left-text + right-WakeSVG (flat) | sticky-right visual + alternating left/right copy beats |
| Motion | none on hero | CSS parallax scrub + opacity/scale transitions (no JS animation library) |

**BEFORE path:** `/mnt/c/Users/vanth/Downloads/ironwake.worktrees/v13-homepage-flagship/app/page.js` (worktree was based on ed7a1b8 = token-swap commit)
**AFTER path:** `/mnt/c/Users/vanth/Downloads/ironwake/app/page.js` (master, post-371e9d1)
**AFTER screenshots:** WAITING_EXTERNAL — Playwright not in this env. Source is test-verified: `node --test app/globals.css.test.js app/icon.test.js` → 5/5 pass.

## Visible Delta (1 sentence)
The flat left-text + right-WakeSVG hero is replaced with a 3-beat scrollytelling section where a sticky glass-framed `<WakeSVG/>` centerpiece on the right scrubs as the user scrolls, while `capture → review → control` narrative beats reveal glass cards in the left column — driven by an `IntersectionObserver` flipping `data-flagship-stage` on `<html>` so motion stays CSS-only with zero new bundle deps.

## Verification
- `node --test app/globals.css.test.js app/icon.test.js` → **5/5 pass**
- `git status` → 4 hero files committed; pre-existing dirty files in main preserved (not touched per owner policy)
- Bundle delta: 0 deps added

## Known Limitations
- AFTER screenshots not captured (Playwright absent in this env). Visual verification requires `ironwake-browser-qa` agent on a Chromium-equipped runner.
- Mobile (≤860px) layout stack works but not screen-tested (no emulator).

## Follow-ups for Next Stage
- After merge to live, browser QA at 9 viewports (1920/1440/1366/1280/1024/768/430/390/360) for visual evidence.
- Lighthouse perf check: ensure `IntersectionObserver` does not break LCP/CLS on hero.
- A11y axe scan with prefers-reduced-motion: true.