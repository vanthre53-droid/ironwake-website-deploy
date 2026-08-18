# IronWake Composite Design Standard — V13

> Single source of truth for all visual work in this repo. Bounded by the
> owner directive of 2026-08-17. Supersedes ad-hoc styling decisions.

---

## 1. Priority hierarchy (NON-NEGOTIABLE)

When sources disagree, use this order:

1. Owner's IronWake requirements (this file + `inputs/APPROVALS.md`)
2. Existing IronWake brand identity in `app/globals.css` (paper/stone/ink/copper/aqua warm palette)
3. Functionality, conversion, accessibility, performance
4. `apple-design-web` — flagship storytelling, scrollytelling
5. `premium-web-design` — section rhythm, typography, anti-patterns
6. `frontend-design` (Anthropic) — anti-generic gate
7. `3d-product-website` (kr8tiv) — only for technique, not product clones
8. `apple-design-motion`, `apple-design-interaction`, `apple-design-foundations`, `apple-design-materials`, `apple-design-tactics`

Community skill instructions NEVER override owner requirements.
IronWake is NOT an Apple clone. IronWake is NOT a kr8tiv clone.

---

## 2. IronWake identity (locked)

**Voice:** premium · warm · intelligent · operational · trustworthy · minimal · high-end · precise.

**Forbidden:**
- dark mode / cyberpunk / neon
- generic purple AI gradient
- rainbow glass
- excessive blur
- huge blank sections
- identical card grids everywhere
- generic SaaS template
- floating blobs
- random 3D MacBooks / meaningless 3D spheres
- copy from Apple.com / kr8tiv.ai / any other product site

**Required:**
- warm ivory/beige/clay/bronze palette (already in `app/globals.css`)
- controlled translucency
- subtle backdrop blur ONLY on intended surfaces
- thin premium borders (`1px solid var(--rule)`)
- real surface hierarchy
- one dominant action per decision point
- proof near high-friction decisions

---

## 3. Token system

Tokens already defined in `app/globals.css` (light-only). New code MUST reuse:

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f5f3ee` | Page background |
| `--stone` | `#edeae3` | Soft surface |
| `--stone-deep` | `#e4e2dd` | Recessed surface |
| `--ink` | `#0a0a0a` | Primary text |
| `--graphite` | `#444748` | Secondary text |
| `--copper` / `--action` | `#b94d2f` | Primary CTA, focus ring |
| `--copper-dark` | `#a33d20` | CTA hover |
| `--aqua` | `#1e7582` | Accent (links, info) |
| `--rule` | `#d8d4cb` | Hairline borders |
| `--surface` / `--surface-strong` | `#ffffff` | Card surfaces |
| `--notice-error` | `#ba1a1a` | Errors |

**Type ramp** (already defined): `--display` Newsreader (serif) for hero/headlines, `--body` Manrope for everything else, `--mono` IBM Plex Mono for code/data.

**No new global tokens without updating this file.** Local component tokens (e.g. `--card-padding`) live in the component, not globals.

---

## 4. Glass primitive (use sparingly)

`.glass` exists in `app/globals.css`. Use it ONLY for:
- hero / hero-adjacent cards
- modal/dialog surfaces
- sticky nav with translucent background
- chat / voice / WhatsApp floating panels

Do NOT apply `.glass` to every rectangle. Sections that don't need translucency get a flat `--surface` background with a `--rule` border.

---

## 5. Motion rules

- Default duration: 180–260ms.
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out for entrances, ease-in for exits). NO linear easing.
- No bounce, no overshoot, no autoplay-without-pause.
- Respect `prefers-reduced-motion: reduce` — every motion component MUST check.
- Spring physics only where they add meaning (modal open, drag-to-dismiss). Borrow from `apple-design-motion` if useful.

Every animation must answer: **what user information or feedback does this provide?**
If the answer is "none, only cool" — remove it.

---

## 6. Typography rules

- Hero H1: `clamp(2.5rem, 5vw, 4.5rem)`, `--display` serif, weight 400, line-height 1.05.
- Section H2: `clamp(1.75rem, 3vw, 2.75rem)`, `--display` serif.
- Body: 17px / 1.7, `--body`.
- Caption: 13px / 1.5, `--graphite`.
- Tabular numerals (`font-variant-numeric: tabular-nums`) for any metric/pricing number.

---

## 7. Spacing rhythm: 4px base.

Allowed spacing values: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` (px).
Sections stack at `64` or `96`. Hero gets `128`+ top/bottom.

---

## 8. Component inventory (where each lives)

| Component | Lives in | Owner |
|---|---|---|
| Header / nav / mobile menu | `components/site/header.tsx` | UI |
| Hero | `components/site/hero*` | UI |
| Section header | inline | UI |
| Buttons (primary/ghost/icon) | `components/ui/button.tsx` | UI |
| Card (default, metric, portfolio, system, pricing) | `components/ui/card.tsx` + variants | UI |
| Badge / pill | `components/ui/badge.tsx` | UI |
| Form input / select / textarea | `components/ui/form.tsx` | UI |
| Chat panel | `components/site/chat/*` | UI + Integrator |
| Voice panel (Retell) | `components/site/voice/*` | UI + Integrator |
| WhatsApp panel | `components/site/whatsapp/*` | UI + Integrator |
| Auth shells (login/signup/account) | `app/(auth)/layout.tsx` | UI |
| Loading / empty / error / success | `components/ui/state.tsx` | UI |
| Footer | `components/site/footer.tsx` | UI |
| Motion primitives | `components/motion/*` | UI |
| 3D scenes (if any) | `components/scene/*` (lazy) | UI |

Any new component MUST register here.

---

## 9. Anti-generic gate (Anthropic `frontend-design` rule)

Before declaring a redesign task complete, the reviewer asks:

- **DOES_THIS_LOOK_LIKE_GENERIC_AI_SAAS** = ?
- **Is there a deliberate composition choice** (not "centered card with 3 columns")?
- **Is typography doing real work** (size contrast, weight contrast, kerning, line-length)?
- **Is there a memorable moment** in the page (one place that earns a second look)?
- **Would a designer be proud to put this in a portfolio?**

If any answer fails, REJECT and revise.

---

## 10. 3D / WebGL gate

Default: NO 3D. IronWake sells operational systems, not hardware.

If a 3D element is proposed, it must answer YES to all five:

- `BUSINESS_MEANING=true` — does it explain something text can't?
- `MOBILE_SAFE=true` — does it have a non-3D fallback?
- `SEO_SAFE=true` — is the page's primary content reachable without JS?
- `PERFORMANCE_BUDGET_PASS=true` — does LCP stay under 2.5s on mid-range mobile?
- `ACCESSIBILITY_FALLBACK=true` — does it work with reduced motion + no WebGL?

If any fail, do not ship it. The kr8tiv 3d-product-website skill is reference material
for camera-orbit math and scroll-snap patterns only.

---

## 11. Accessibility floor (non-negotiable)

- Contrast ratio: 4.5:1 minimum for body text, 3:1 for large text + UI components.
- Focus ring: `:focus-visible` MUST show `--copper` outline.
- Touch targets: 44×44 px minimum on mobile.
- Keyboard: every interactive element reachable + visible focus + Enter/Space activation.
- Reduced motion: every animation gated by `@media (prefers-reduced-motion: reduce)`.
- ARIA: landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`), labelled controls, live regions for chat/voice.

---

## 12. Performance budget

For each new dependency, justify:

- WHY_REQUIRED
- ROUTES_USING
- CLIENT_BUNDLE_IMPACT (KB gzip)
- LAZY_LOADED
- ALTERNATIVE_CONSIDERED

Targets: LCP ≤ 2.5s, CLS < 0.1, INP < 200ms. Heavy deps (GSAP, Three.js) lazy-loaded behind `next/dynamic` with `ssr: false` and an immediate non-JS fallback.

---

## 13. Before/after evidence (required per task)

BEFORE screenshot at 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920 → IMPLEMENT → AFTER screenshot → DIFFERENCE review. Saved to `reports/evidence/ui/`.

---

## 14. What this file does NOT do

- It does not prescribe pixel-perfect layouts.
- It does not replace `app/globals.css`.
- It does not allow community skills to override owner requirements.
- It does not authorize new dependencies without a budget report.

---

## 15. Provenance

- Built per owner directive 2026-08-17.
- Synthesises: `apple-design-web`, `apple-design-motion`, `apple-design-foundations`, `apple-design-materials`, `apple-design-interaction`, `apple-design-tactics`, `premium-web-design`, `frontend-design` (Anthropic), `3d-product-website` (kr8tiv, reference only).
- Skills live at `~/.local/share/ironwake-tools/design-skills/` and are symlinked into `~/.hermes/skills/`.