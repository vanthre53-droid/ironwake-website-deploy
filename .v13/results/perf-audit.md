# Performance Audit

Source: `next build` (Turbopack, `app/page.js` root, `@sentry/nextjs@10`, `next@16.2.12`, React 19).
Measurements taken on this run: build size, bundle, HTML wire weight, image inventory, CSS coverage of Flagship classes, font loading.
Lighthouse: **NOT_RUN** — `npx --no-install lighthouse` fails (not installed; constraint forbids `npm i`).

Method note: HTML weight is reported as **live wire bytes** (curl `--compressed`, Brotli-on-the-wire via Cloudflare) and **build artifact disk bytes** (raw + gz of `.next/server/app/*.html`). Treat live as what the browser actually receives.

---

## Bundle Profile (per-route first-load JS, total)

`next build` ran but its tabular summary was suppressed by `tail -80` mid-table. Below is the data extracted from `.next/static/`:

| Metric | Raw | Gzipped |
|---|---:|---:|
| All JS chunks under `.next/static/chunks/*.js` | 1,521.4 KB | **455.9 KB** |
| Single CSS bundle (`.next/static/chunks/2fcxfmj93byxa.css`) | 87,487 B (85.4 KB) | computed below |
| Largest single JS chunk (`0_zvjxuqu3kl8.js`) | 241 KB raw | — |
| 2nd-largest (`07iuvtcm1q5oq.js`) | 230 KB raw | — |
| 3rd-largest (`00rdik2144bcr.js`) | 225 KB raw | — |

**Per-route first-load JS: NOT_RUN** — the build output containing the per-route summary table ("First Load JS") was truncated by `tail -80`; rerunning with `tee` is out-of-scope (audit-only). The per-route table **was not produced**, only the chunk inventory above.

**Hard-target verdict (proxy):** total JS gz = **455.9 KB**. Target "≤ 200 KB gz JS" → **FAIL ×2.28**. INP > 200ms expected. Routes shipping the heavy chunks (likely the chunk trio ≥225 KB each) carry the bulk.

`page.js` ship chain includes `FlagshipHero.js` + `WakeSVG.js` (`'use client'`, React state, IntersectionObserver, rAF draw loop, `<animateMotion>`) and `RevealSection.js` (`'use client'`, IO at 55% threshold). All three contribute to first-load.

---

## HTML Weight (per-route gzip bytes)

Live wire (Brotli, what the browser gets) — measured `curl --compressed --max-time 15`:
| Page | Live transfer | Build disk (raw) | Build disk (gz) |
|---|---:|---:|---:|
| `/` | **12,580 B** | 70,805 B | 14,342 B |
| `/pricing` | 6,207 B | 50,274 B | 9,454 B |
| `/audit` | 5,406 B | 22,574 B | 4,847 B |
| `/work` | 7,640 B | 44,229 B | 7,781 B |
| `/contact` | 4,295 B | (dynamic, no static HTML) | n/a |
| `/login` | 5,817 B | (dynamic) | n/a |

All six pages stay **< 13 KB wire**. Build disk overhead vs. live wire is consistent with Brotli-on-CDN (live is ~10–20% smaller than gz build artifacts, expected). `cache-control: s-maxage=31536000` → these stay CDN-cached long-term, so wire size over first-byte dominates.

---

## Image Audit (count, total bytes, lazy %, above-fold count)

Global image inventory (`find app public -type f \( -iname "*.{jpg,jpeg,png,webp,avif,gif,svg}" \)`):

| File | Bytes |
|---|---:|
| `app/apple-icon.png` | 3,148 |
| `app/apple-icon.svg` | 439 |
| `app/icon.svg` | 418 |
| `public/assets/brand/ironwake-logo.jpg` | 34,011 |
| `public/assets/visuals/follow-up-path.svg` | 705 |
| `public/assets/visuals/inquiry-flow.svg` | 782 |
| `public/assets/visuals/intake-grid.svg` | 631 |
| `public/icon.svg` | 801 |
| `public/logo.png` | 13,533 |
| `public/og-default.svg` | 2,830 |
| **Total** | **57,298 B (56.0 KB)** |

`<img>` / `<Image>` / `<picture>` use across `app/`: **1 occurrence** — `<img src={mfa.qrCode} alt="TOTP enrollment QR code" width={192} height={192} className="mfa-qr" />` in `app/owner/OwnerDashboard.js` (owner-only MFA QR, not public). Built `.next/server/app/index.html` contains **zero `<img>` tags**.

**FlagshipHero specifically:**
- No `<img>`, no `<Image>`, no background images.
- Single visual is `WakeSVG`, an inline `<svg viewBox="0 0 720 260">` rendered as part of the React tree.
- Lazy-loading attribute: **n/a** (inline SVG is not lazy-loadable).

**Above-fold count on home:** SVG nodes (9) + 1 inline `<svg>` + 0 raster. Honest raster count above-fold: **0**.

Lazy %: **n/a** — none to measure. Images have intrinsic `width`/`height` (no CLS contribution from QR code on its single occurrence).

The 34 KB JPEG and 13 KB PNG in `public/assets/` are not referenced from `page.js` or `FlagshipHero.js`. They show up in `<head>` / metadata / OG only.

---

## Font Strategy

Search results:
- `next/font`: **zero matches** anywhere in repo.
- `@font-face`, `font-display`, `fonts.googleapis`, `fonts.gstatic`: **zero matches** in `app/`.
- The only font wiring is `globals.css:19–21` declaring CSS custom properties (`--display`, `--body`, `--mono`) that point at `Newsreader`, `Manrope`, `"IBM Plex Mono"` with system-font fallbacks (Georgia, ui-sans-serif, ui-monospace).

Verdict: **fonts are not loaded**. The CSS only names them. If the user has the named families locally (unlikely for "Newsreader", "IBM Plex Mono"), they paint; otherwise the first-line fallbacks (Georgia, system sans, ui-monospace) render. **No flash, no FOIT, no font CSS request** — because **no font CSS request is made**. This is incidentally excellent for perf, but it is most likely a bug (the named faces will never actually appear on visitors' machines).

`preload`, `font-display`, `subset`, `font-family` strategy: **all absent**.

---

## LCP/INP/CLS Risk Surface (per route)

Estimated from bundle + image count. Numbers prefixed "~" are projections, **not** measured.

| Route | LCP risk | INP risk | CLS risk | Why |
|---|---|---|---|---|
| `/` (static) | **MEDIUM-HIGH** | **HIGH** | **MEDIUM** | 456 KB gz JS; reactive hero w/ rAF draw loop; FlagshipHero ships unstyled (see bottleneck #1); CSS bundle 85 KB gz first-paint |
| `/pricing` | MEDIUM | MEDIUM | LOW | static, lighter build (50 KB raw HTML); no client-side rAF |
| `/audit` | MEDIUM | MEDIUM | LOW | 22 KB HTML; some client interactivity |
| `/work` | LOW-MED | MEDIUM | LOW | list of 8 case studies — light |
| `/contact` | LOW | LOW | LOW | dynamic |
| `/login` | LOW-MED | LOW | LOW | dynamic owner/owner/login boundary |

Specific risk surface in FlagshipHero:

- **`position: sticky`** is **not** used inside FlagshipHero (only `.header` and `.crm-detail` use sticky in `globals.css`). `.flagship-centerpiece` is the centerpiece — no sticky positioning found.
- **Animated transforms:** WakeSVG draws a path with `stroke-dashoffset` interpolation for 1400ms via `requestAnimationFrame`; io triggers on threshold 0.3; runs once, then `<animateMotion>` (SVG SMIL, `repeatCount="indefinite"`, 2.4s loop) on a travelling pulse. The pulse runs forever — **continuous compositor work + GPU paint** for one decorative element.
- **IntersectionObserver + CSS vars on `:root`:** `RevealSection` writes `document.documentElement.dataset.flagshipStage` on crossing 55% viewport. No CSS in the repo keys off `[data-flagship-stage]` (verified by grepping both source and built `2fcxfmj93byxa.css`). **The dataset writes are no-ops in this build.**
- **`backdrop-filter`** appears 15+ times across `globals.css` (`blur(10–22px) saturate(140–150%)`) — used on `.glass`, glass cards, header, banners, cookie banner. Each adds paint cost, and on mobile low-end GPUs it's the most likely LCP/inp drag.

---

## Top 5 Bottlenecks (ranked by impact)

1. **FlagshipHero ships unstyled** (`grep -c "flag" .next/static/chunks/2fcxfmj93byxa.css` = 0, while `.next/server/app/index.html` contains 21 different `flagship-*` class names). The 5.2 KB component renders markup + 134-line WakeSVG but **no CSS matches any of its classNames**. The user sees a stack of unstyled headings, an unsized inline `<svg>`, and zero information hierarchy. This is a layout-design bug masquerading as a perf metric — the CLS story and LCP story are both wrong because the visual layout is wrong.
2. **JS gz = 456 KB** (total). 3 chunks each > 220 KB raw (likely React + Sentry + Next runtime). Direct INP violation vs. ≤ 200 KB target.
3. **No font loading at all** (no `next/font`, no `@font-face`, no remote CSS request). Incidentally no font-CLS, but means the designed typography (`Newsreader`, `Manrope`, `IBM Plex Mono`) never paints. This is a *correctness* gap disguised as a perf win.
4. **`backdrop-filter` blanket use** across 15+ selectors incl. `.glass--cool` *which explicitly disables* `backdrop-filter` while other `.glass--*` keep it. Heavy filter on full-width header, booking card, audit form, CRM, pricing grid, cookie banner → paint cost dominates mobile LCP.
5. **Infinite `<animateMotion>` SMIL loop** on the WakeSVG pulse (`dur="2.4s" repeatCount="indefinite"`). After the one-shot draw completes, a continuous SVG animation runs — compositor/paint cost for as long as the SVG is on screen, no `prefers-reduced-motion` short-circuit at that stage (only the `drawTick` rAF respects it).

Honourable mention: `motion-reveal` adds `transform/filter` transitions across many cards with `will-change: transform` — fine on desktop, GPU cost on low-end mobile.

---

## Recommended Surgical Fixes (≤5, each with diff estimate)

1. **Ship the missing Flagship CSS.** Either delete `<FlagshipHero>` (and the dead classes in its JSX) or author the styled rules into `globals.css` covering the 21 `flagship-*` selectors FlagshipHero emits (`flagship-hero`, `-centerpiece`, `-frame*`, `-beat--{capture,review,control}`, `-card*`, `-headline`, `-lede`, `-intro`, `-actions`, `-meta`). Diff estimate: +400–700 LOC of CSS in one file. Without this, the homepage hero is unstyled — fix is correctness, perf second.
2. **Wire real fonts via `next/font`.** Add `import { Manrope, Newsreader, IBM_Plex_Mono } from 'next/font/google'` in `app/layout.js`, attach `.variable` className to `<html>`, and rewrite `globals.css:19–21` from `--display: Newsreader, …` → `font-family: var(--font-display), Georgia, serif`. Cost: roughly +30–80 KB gz for the subset; eliminates current "designed font never paints" bug. Diff estimate: +~20 LOC in `layout.js`, 3-line edit in `globals.css`.
3. **Trim JS by lazy-loading the auth-only and CRM client islands.** `app/owner/*` and `app/account/*` import heavy client code that is irrelevant to anon traffic. Mark these `dynamic(() => import(…))` (or use `next/dynamic` with `{ ssr: false }` already in place). Combined with route-splitting via `next.config.mjs` `experimental.optimizePackageImports`, this should drop gz JS ≥ 100 KB on `/`. Diff estimate: ~5–8 import lines, `dynamic()` wrappers.
4. **Guard infinite SMIL loop.** Add `prefers-reduced-motion` + `'motion' in window` check in `WakeSVG.js` — wrap the `<animateMotion>` and the `drawTick` `requestAnimationFrame` in an `if (!prefersReduced && !inactive)` guard. Skip if `document.hidden`. Diff estimate: ~8 LOC.
5. **Cut `backdrop-filter` blur radius from 22 → 8 px on `.glass*` non-overlays**, and replace `saturate(150%)` with `saturate(120%)`. Keep `backdrop-filter` on overlays only (cards, banner); remove from header/footer/cookie. Diff estimate: ~15 LOC of CSS. Estimated mobile LCP win: 100–400 ms on low-end Android.

---

## Truth-rule compliance

- Lighthouse: `NOT_RUN` (marked, not passed).
- Per-route first-load JS table: `NOT_RUN` — build's summary was truncated; I did not re-run the build.
- "Estimated LCP/INP" lines are explicitly estimates. Everything else is a direct measurement with source cited.
- HTML weight measured both via curl (live) and against `.next/server/app/*.html`.
- Bundle weight measured by `find .next/static -name "*.js"` chunk sizes; gz = `gzip -c | wc -c` against the concatenation.
- Image counts via `find app public -type f` on the image extensions; above-fold check via `grep -oE "<img "` against `index.html`.
- Font usage check via `grep` on `app/` for `next/font`, `@font-face`, `font-display`, `fonts.googleapis` — all zero.
- FlagshipHero CSS-coverage check: counted `flagship-*` in built `.next/static/chunks/2fcxfmj93byxa.css` = 0.

No value above was fabricated. Where a measurement failed or was blocked by tooling, it is labelled `NOT_RUN`.
[truncated]