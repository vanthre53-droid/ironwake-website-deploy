# DESIGN_LOCK_BLOCKED — HOMEPAGE GLASSMORPH ENHANCEMENT

**Symptom** (owner, verbatim):
> "there is no glasomorph feeling liken apples websites do jno premium"
> "buttons aree square boxes dumnb"
> "apple style frontend for each poart of our frontned fuly fiunctional"

**Diagnosis**:
Current locked `app/globals.css` already has Apple-quality glass on card
surfaces (`.system-card`, `.case-large`, `.case-stack article`,
`.audit-form`, `.flagship-card`, `.flagship-frame` all carry
`backdrop-filter: blur(20-28px) saturate(140-150%)` + layered shadows +
1px inner highlight + 70%+ white-translucent backgrounds). However the
HERO section background and most section bodies are flat `--paper`,
creating a visible disconnect — cards float over a flat page instead
of layering over a subtle tinted glass field. Owner reads this as
"no glass feel" even though the cards themselves are glass.

**Minimal surgical change** (single additive rule block, scoped, no
recolor, no recolor of any locked class, no restructure):

1. Add a hero-level `.flagship-hero` ambient glass layer
   (`::before` pseudo-element with low-opacity tinted blur) so the
   hero cards have something to refract against.
2. Add a `.section-glow` utility for the homepage section bodies —
   extremely subtle warm-tinted backdrop (no heavy effect, no dark
   panel) that gives the cards visible depth without changing color.
3. Tighten button `:hover` and `:focus-visible` states with an
   Apple-style lift + shadow shift + slight backdrop-filter
   brightness (matches apple.com CTA interaction model).
4. Add a `.h1-glass` modifier class is NOT needed — the H1 is text,
   text on glass needs no extra rule.
5. `prefers-reduced-motion` + low-power fallbacks already handled at
   the existing `@media` blocks at the bottom of the file.

**Scope**: `app/globals.css` only (already touched once via button
radius DESIGN_LOCK_BLOCKED). No edits to `app/page.js`,
`app/layout.js`, `app/components/FlagshipHero.js`,
`app/components/DashboardDemo.js`. No edits to any colour token. No
recolor. No new palette. No purple/blue/teal/dark SaaS look.

**Before/after**:

BEFORE — homepage hero `FlagshipHero.js` renders text directly on
flat `var(--paper)`. Cards in the centerpiece already have
`backdrop-filter: blur(28px)` but there's no glass field behind them
to blur against, so the effect reads as subtle shadow only.

AFTER — `.flagship-hero` gets a `::before` pseudo-element with a
warm-tinted low-opacity gradient + a 1px subtle inner edge so the
flagship-card backdrop-filter has actual content to refract. Owner
visits `/`, scrolls past hero → sees a clearly layered glass field
under the cards. Same content, same colours, same lock — visible
Apple-quality material feel.

**Acceptance**:
- CSS bundle on `/` contains new rule + still serves 200
- Hero card visible-backdrop-filter element reports non-zero
  rendered backdrop in browser inspector
- No colour regression on existing tokens
- No edit to any other locked file
- All 388 existing tests still pass
- Single deploy version bump, owner live verification

**Rollback**: revert the single patch block, redeploy. Hash recorded
in `lib/contradiction-gate.test.mjs` baseline promotion.