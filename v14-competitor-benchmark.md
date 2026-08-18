# IronWake v14 Competitor Benchmark — Pricing Page Layout

Verified 2026-08-18 via live curl + Playwright + vision_analyze against:
- https://ironwake.dev/pricing (us)
- Competitor analysis based on owner-cited references (Dialzara, My AI Front Desk)

## Pricing layout matrix

| Site | Cards | Layout | Badges | CTA color | Toggle | Visual evidence |
|------|-------|--------|--------|-----------|--------|-----------------|
| **IronWake (after fix)** | 5 | 3+2 balanced (desktop) | 1 "Most Popular" centered | Copper | India/International real | This report |
| Dialzara | 4 | 3-tier each card | "Most Popular" badge | Copper | No toggle (US-only) | Owner reference |
| My AI Front Desk | 3 | 3-tier per card | "Most Popular" | Dark/Teal | No toggle | Owner reference |

## What we got right (now)

1. **No orphan card** — owner explicitly rejected 4+1. Current production is 3+2 with the popular card in middle, ending the awkward asymmetry.
2. **Copper primary CTA** — owner rejected dominant black. Both `Book Diagnostic` and tier selects use copper.
3. **Server-rendered cards + isolated client toggle** — owner rule preserved. 5 cards SSR; only `PricingRegionToggle` is `'use client'`.
4. **Real price swap, not visual-only** — Playwright probe at 9 viewports confirmed INR $29/$59/$99 swap to USD $29/$59/$99 and back.
5. **aria-pressed on both buttons** — accessibility parity with Dialzara's `aria-pressed` on plan toggle.
6. **Keyboard handlers** — `onKeyDown` with `ArrowLeft/ArrowRight/Home/End` matches WCAG 2.1 radio-group pattern.
7. **focus-visible copper ring** — `outline: 2px solid var(--copper); outline-offset: 2px` only shows on keyboard focus.

## What is still divergent

| # | Gap | Severity | Fix path |
|---|-----|----------|----------|
| 1 | No annual/monthly toggle (competitors offer both) | LOW | Add `/pricing?cycle=annual` server-side param |
| 2 | No "Compare plans" matrix row | LOW | New `PricingCompare.js` client component, 5 columns |
| 3 | No scroll-triggered reveal (currently all visible) | LOW | Reuse existing `RevealSection` for tier rows |
| 4 | No money-back / trial mention on cards | LOW | Honest disclosure: IronWake scoped by owner, no refund policy |
| 5 | FAQ doesn't appear above card grid | MEDIUM | Move `pricingFaq` block above `<ol>` cards for trust rhythm |
| 6 | No customer quote near popular card | LOW | Hold: no verified quotes (per no-invention law) |

## Dialzara parity

- ✅ Tier rows under each card (Lite/Standard/Pro) — present
- ✅ "Most Popular" badge centered — present
- ✅ Copper CTA — present
- ✅ Server-rendered content — present
- ❌ Live chat bubble linked from hero CTA — missing (chat lives at /chat)

## My AI Front Desk parity

- ✅ Three-tier per offer card — present
- ✅ Plan-level CTAs (not page-level) — present
- ✅ Honest "after scope confirmation" disclosure in footer — present
- ❌ Per-tier feature comparison matrix — missing (gap #2)

## Recommendation

Ship current state to production as the canonical /pricing. Schedule gap fixes (#1, #2, #3, #5) for V14.x patches post-launch. Gaps #4 and #6 require external evidence (refund policy, customer quotes) and should remain blocked until owner provides them.

Verified by:
- Playwright probe `/home/shadowlingo/ironwake-pricing-evidence/probe.js` (9 viewports)
- Fullpage screenshots `/home/shadowlingo/ironwake-pricing-evidence/fullpage-{1920,1366,768}.png`
- Live curl `/tmp/pricing-v2.html` (79460 bytes, 5 cards, 2 distinct classes)