# IronWake V14 Competitor Benchmark Matrix

**Date:** 2026-08-18
**Source:** live web research via web_search + web_extract on current AI receptionist / lead recovery market

---

## Competitors scored (same rubric, evidence-based)

| Competitor | Score | One-line position |
|---|---|---|
| My AI Front Desk (Frontdesk) | 9.5/10 | Lead-magnet audit funnel + workflow-by-industry silo |
| Dialzara | 9.0/10 | Interactive ROI calculator on pricing + "MOST POPULAR" middle card |
| Smith.ai | 8.5/10 | Strong trust signals, aggregate review badges post-hero |
| Goodcall | 6.5/10 | Good niche focus but pricing UX heavy and selector weak |

---

## High-leverage patterns identified

### From My AI Front Desk (9.5)
1. **Free Lead Leak Audit** as the primary lead magnet — replaces a generic contact form
2. Per-vertical landing pages (dental, plumbing, salon) — clean URL silo
3. Transparent per-call pricing in plain English

### From Dialzara (9.0)
1. **Interactive ROI/Usage calculator** directly on `/pricing` — converts a static price table into a self-serve tool
2. **"MOST POPULAR" badge** on exactly ONE plan card (the middle tier), not every card
3. **88-page vertical silo** + "vs X" comparison hub (e.g. "vs Smith.ai") — drives SEO + clarity

### From Smith.ai (8.5)
1. **Aggregate review badges in-band, post-hero** (G2/Capterra/Google stars), not buried in footer
2. Clear human-vs-AI pricing split
3. Strong about/mission page — trusts the visitor's intent

### From Goodcall (6.5)
- Niche focus is good, but pricing UX is heavy and the region/plan selector is weak — **what IronWake must NOT regress to**

---

## Actionable TODOs (mapped to IronWake V13 components)

| # | Pattern | Where it lives now | Action |
|---|---|---|---|
| 1 | Lead Leak Audit as lead magnet | /pricing has raw form | ✅ already routed to dedicated `/audit` (d2e1d56) |
| 2 | Interactive ROI calculator | not present | **TODO**: build `/tools/roi` mini-route OR add inline calculator to `/pricing` |
| 3 | "MOST POPULAR" on middle plan | not present | **TODO**: add single recommended-tier badge to one offer card |
| 4 | Per-vertical landing pages | not present | **TODO**: `/industries/dental`, `/plumbing`, `/salon` |
| 5 | Aggregate review badges in-band | not present | **TODO**: add review-badge band below hero on `/` |
| 6 | Pricing selector UI | ✅ copper pill working | verified |
| 7 | "vs X" comparison hub | not present | **TODO**: `/vs/smith-ai`, `/vs/dialzara`, `/vs/goodcall` |

---

## IronWake target

**Goal:** ≥ 9.5/10 OVERALL AND ≥ 9.5/10 RELIABILITY

Current IronWake dimension estimate (rough, from V13 work so far):
- Pricing UX: 9.0 (5-card grid, working selector, hero band)
- Visual polish: 8.0 (warm brand preserved, nav copper, but more routes still raw)
- Conversational: 8.5 (Retell 14/14 golden + canonical prompt)
- Reliability: 8.5 (47 WA tests + 14 RT tests + clean build, no deployment yet)
- SEO: 7.5 (sitemap/canonical/og in place but GSC submit pending)
- Mobile: 8.0 (responsive grids, no overflow)
- WhatsApp: 8.5 (always-actionable FAB, but real number not configured)

**Highest-leverage remaining TODOs (in order):**
1. **Deploy current state** to ironwake.dev so live evidence exists
2. **Real Google Search Console submission** post-deploy
3. **Add review-badge band** below homepage hero (low effort, high trust signal)
4. **Add "MOST POPULAR" badge** to exactly one offer card on /pricing
5. **Build one per-vertical page** (dental first — strongest existing portfolio match)
6. **Add ROI/usage calculator** to /pricing or new /tools/roi