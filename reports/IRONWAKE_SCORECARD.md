# IronWake Scorecard — 2026-08-06

## Scoring Rubric (100 points total)

| # | Category | Max pts | Description |
|---|----------|---------|-------------|
| 1 | Positioning & 5-second clarity | 8 | Can a visitor understand what IronWake does, for whom, and why it matters within 5 seconds? |
| 2 | Navigation & information architecture | 8 | Is the site structure logical, scannable, and does it guide the buyer journey? |
| 3 | Typography & readability | 8 | Is text readable at all sizes? Are headings dominant? Is line length appropriate? |
| 4 | Visual design system & perceived quality | 10 | Does the site feel premium, cohesive, and trustworthy? |
| 5 | Motion, interaction & system visualization | 10 | Do animations explain the system? Are interactions purposeful? |
| 6 | Portfolio proof & case-study depth | 12 | Are there convincing, detailed case studies with real outcomes? |
| 7 | Chatbot & interactive product demo | 10 | Can visitors interact with the product? Is the chatbot functional? |
| 8 | Pricing & offer clarity | 8 | Are prices visible? Is the offer understandable? |
| 9 | Conversion journey, forms & CTAs | 8 | Is the path to becoming a lead clear and low-friction? |
| 10 | SEO, content architecture & search intent | 8 | Is the site technically optimized for search? |
| 11 | Performance & accessibility | 5 | Does the site load fast? Is it accessible? |
| 12 | Trust, security & truthful disclosure | 5 | Are claims truthful? Are trust signals present? |

## IronWake Baseline Score (2026-08-06)

### 1. Positioning & 5-second clarity — 4/8
**Evidence**: Homepage hero says "Turn every serious enquiry into a clear next action." This is benefit-focused but vague. A visitor doesn't know what IronWake IS (software? service? agency?) within 5 seconds. The workflow demo helps but is below the fold.
**Screenshot**: baseline/home_1440.png
**Confidence**: High — objective observation from fresh-context review
**Type**: Judgement-based

### 2. Navigation & information architecture — 6/8
**Evidence**: Clear nav links (Systems, Work, Request Scope, Industries, Process, About). Logical structure. Missing: pricing page, clear buyer journey path.
**Screenshot**: baseline/home_1440.png
**Confidence**: High
**Type**: Objective

### 3. Typography & readability — 5/8
**Evidence**: Body text is 17px (acceptable). Headings use Newsreader serif (editorial, readable). Labels are 11px (slightly small — Stitch spec is 12px). Line lengths are appropriate. Some text still uses uppercase monospace at small sizes.
**Screenshot**: baseline/home_1440.png
**Confidence**: High — measured from CSS
**Type**: Measured

### 4. Visual design system & perceived quality — 6/10
**Evidence**: Light bone canvas (#f5f3ee) matches Stitch spec. Hairlines instead of shadows. Clean card system. However: no hero imagery, no product screenshots, no visual proof of the system working. Cards are text-heavy. Missing visual depth.
**Screenshot**: baseline/home_1440.png
**Confidence**: High
**Type**: Judgement-based

### 5. Motion, interaction & system visualization — 4/10
**Evidence**: Signal rail animation exists (dots glow in sequence). Workflow demo shows 3-step process with icons. Scroll reveals via MotionReveal. However: no hero visualization, no interactive system demo, no dashboard preview, no workflow playback. Motion is minimal — mostly fades.
**Screenshot**: baseline/home_1440.png
**Confidence**: High
**Type**: Judgement-based

### 6. Portfolio proof & case-study depth — 3/12
**Evidence**: 9 case studies exist but are primarily text with SVG backgrounds. No real screenshots, no metrics, no before/after, no interactive demos. Case studies say "PORTFOLIO DEMONSTRATION" which is honest but weakens proof. No client logos, no testimonials.
**Screenshot**: baseline/work_1440.png
**Confidence**: High
**Type**: Objective

### 7. Chatbot & interactive product demo — 4/10
**Evidence**: Decision-tree assistant exists with 3 business types and guided flow. Functional and honest ("guided decision tree, not a live AI"). However: no interactive product demo, no live system walkthrough, no dashboard preview. Chatbot is text-only, no visual elements.
**Screenshot**: baseline/home_1440.png
**Confidence**: High
**Type**: Measured

### 8. Pricing & offer clarity — 2/8
**Evidence**: No public pricing page. "Request Scope" page exists but no prices visible. Five locked offers exist in the research but are not published on the website. Buyer has no idea what anything costs.
**Screenshot**: baseline/scope_1440.png
**Confidence**: High — objective finding
**Type**: Objective

### 9. Conversion journey, forms & CTAs — 5/8
**Evidence**: Clear primary CTA "Find the leak in my workflow" → audit form. Secondary CTA "See how the systems work" → systems page. Audit form exists with validation. Booking form exists. However: no pricing CTA, no clear entry offer, form is long.
**Screenshot**: baseline/audit_1440.png
**Confidence**: High
**Type**: Judgement-based

### 10. SEO, content architecture & search intent — 4/8
**Evidence**: Sitemap.xml exists with 27 routes. JSON-LD structured data (Organization, WebSite, Service). OG/Twitter metadata. Robots.txt. However: noindex is active (not deployed to production domain). No blog/content pages. No industry-specific landing pages. No FAQ schema.
**Screenshot**: N/A
**Confidence**: High — verified from source
**Type**: Measured

### 11. Performance & accessibility — 3/5
**Evidence**: 73/73 tests pass. Skip link exists. Focus-visible styles. Reduced-motion support. However: Lighthouse not run on deployed site. No ARIA landmarks audit. No screen-reader testing.
**Screenshot**: N/A
**Confidence**: Medium — not fully verified
**Type**: Partial

### 12. Trust, security & truthful disclosure — 4/5
**Evidence**: All claims are truthful. No fake testimonials. No invented metrics. "DEMONSTRATION" labels on portfolio. Privacy/terms pages exist (draft gates). Security headers present. However: no trust badges, no compliance claims, no client logos.
**Screenshot**: baseline/home_1440.png
**Confidence**: High
**Type**: Objective

---

## Total: 44/100

### Category breakdown:
| # | Category | Score | % of max | Status |
|---|----------|-------|----------|--------|
| 1 | Positioning & clarity | 4/8 | 50% | ❌ Below 75% |
| 2 | Navigation & IA | 6/8 | 75% | ✅ At threshold |
| 3 | Typography & readability | 5/8 | 63% | ❌ Below 75% |
| 4 | Visual design system | 6/10 | 60% | ❌ Below 75% |
| 5 | Motion & interaction | 4/10 | 40% | ❌ Below 75% |
| 6 | Portfolio proof | 3/12 | 25% | ❌ Below 75% |
| 7 | Chatbot & demo | 4/10 | 40% | ❌ Below 75% |
| 8 | Pricing clarity | 2/8 | 25% | ❌ Below 75% |
| 9 | Conversion journey | 5/8 | 63% | ❌ Below 75% |
| 10 | SEO & content | 4/8 | 50% | ❌ Below 75% |
| 11 | Performance & a11y | 3/5 | 60% | ❌ Below 75% |
| 12 | Trust & disclosure | 4/5 | 80% | ✅ Above 75% |

### Critical gaps (below 75% in 10 of 12 categories):
1. **Portfolio proof (25%)** — needs real screenshots, metrics, interactive demos
2. **Pricing clarity (25%)** — needs visible prices on the website
3. **Motion & interaction (40%)** — needs meaningful animations, system visualization
4. **Chatbot & demo (40%)** — needs interactive product demonstration
5. **Positioning (50%)** — needs clearer "what is this" within 5 seconds
6. **SEO (50%)** — needs content pages, industry landing pages
7. **Typography (63%)** — needs label size increase, consistent hierarchy
8. **Visual design (60%)** — needs hero imagery, product screenshots
9. **Conversion (63%)** — needs pricing CTA, clearer entry offer
10. **Performance (60%)** — needs Lighthouse audit, full a11y testing

### Benchmark comparison needed:
IronWake must score ≥90/100 overall and ≥75% in every category before entering owner approval.
