# P1 UX and Conversion Research

- Retrieval date: 2026-07-28
- Scope: original conversion principles derived from current official technical guidance and category observations; no layout/copy/asset is copied.
- Current-source status: refreshed through Composio Search session `word` on 2026-07-28; recommendations remain pending G1 approval.

## Approved-direction recommendations pending G1

| Visitor question | Proposed interaction | Truth and recovery rule | Measurement after launch |
|---|---|---|---|
| "What is failing?" | Outcome-first entry: missed inquiries, booking control, follow-up discipline, reception, or trust | Do not lead with a provider/model claim; use plain language and one primary next action | Selection completion by outcome |
| "What should I do first?" | One-screen-at-a-time five-question service selector | Show a recommendation as a scope hypothesis, never an instant quote; let the visitor change answers | Step drop-off and recommendation-to-request rate |
| "Did you receive this?" | Server-confirmed audit request acknowledgement with reference ID | State `received; awaiting confirmation`, not booked/assigned/sent, unless durable commit and provider state support it | Durable-record success; acknowledgement error/retry rate |
| "Can I trust this work?" | Proof card with explicit `DEMONSTRATION`, `PROVIDER PROOF PENDING`, or `VERIFIED LIVE` label | Hide unsupported results, testimonials, logos, prices, and provider states | Proof-card engagement; qualified inquiry rate |
| "Will this work on my phone?" | Short inputs, visible labels/errors, keyboard-safe next action, no motion-only meaning | Preserve entered data only with approved consent/security; make error recovery available | Mobile form completion and field-error rate |

## Information architecture

Use a single public conversion spine: outcome page → audit explanation → request form → received/awaiting-confirmation state. Keep independent system pages for intent, but merge/defer any route without original approved content. Portfolio cards link only to truthful proof pages; missing projects stay hidden or marked neutral pending approval.

## Design and technical constraints

- The public content should be server-rendered/indexable where practical; Google explicitly advises crawlable links, distinct URLs, DOM-visible content, and a sitemap for discoverability ([Google developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)).
- Next.js' current production guidance highlights shared layouts, optimized fonts/images/scripts, accessible UI, CSP, and production build/bundle checks ([Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)).
- The release target is LCP ≤2.5 s, INP <200 ms, CLS <0.1; these are user-experience thresholds, not a ranking guarantee ([Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)).
- Motion may explain workflow/state only; it must be interruptible, reduced-motion-safe, and never gate a CTA.

## Current-source readback

- [Google: Get your website on Google](https://developers.google.com/search/docs/fundamentals/get-on-google) — fetched 2026-07-28; indexing is not guaranteed, and crawlable, useful content remains the relevant foundation.
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) — fetched 2026-07-28; the 2.5-second LCP and 200-millisecond INP targets remain appropriate release budgets alongside CLS.
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist) — fetched 2026-07-28; current page metadata reported version 16.2.12 and a 2026-03-10 update date.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — fetched 2026-07-28; W3C Recommendation dated 2024-12-12 remains the accessibility target reference.

## Anti-patterns excluded

No countdown, false scarcity, preselected paid option, invented social proof, fake dashboard, mock provider-success state, obscured cancellation, generic "AI" superlative, or nonfunctional CTA. The initial form asks only for information required to assess the request; medical/payment/credential data is excluded.
