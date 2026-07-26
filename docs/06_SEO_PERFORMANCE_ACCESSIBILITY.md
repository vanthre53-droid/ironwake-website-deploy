# SEO, Performance, Accessibility, and Motion

## Search objective

Build the strongest truthful search foundation possible. Do not promise the highest rank. Technical SEO makes the site eligible and understandable; ranking also requires authority, useful content, links/mentions, history, demand, competition, and ongoing measurement.

## Search architecture

Each indexable route must own one distinct buyer intent. Merge, noindex, or defer pages that cannot provide original useful content.

Required:

- server-rendered/indexable primary content;
- clean stable slugs and redirect map;
- unique approved title, description, H1, and visible intent;
- canonical URLs and correct trailing-slash policy;
- XML sitemap containing only canonical indexable URLs;
- robots rules that block private/staging areas without relying on robots for security;
- authenticated dashboard protected by authorization and `noindex`;
- internal links based on user intent, not keyword stuffing;
- breadcrumbs where hierarchy benefits users;
- Open Graph/social previews from approved assets;
- structured data only when page content and Google-supported type justify it;
- no fake review/rating/local-business/team/service-area markup;
- image dimensions, descriptive filenames where useful, appropriate alt behavior;
- real 404 and redirect/canonical tests;
- Search Console and analytics setup guide after domain ownership;
- content freshness/claim review dates.

## Regional pricing/search

Use separate regional URLs only when content/scope is meaningfully localized. If `/in/` and `/global/` versions exist, define self/alternate canonicals and hreflang based on actual targeting. Do not auto-redirect solely by IP. Offer a visible switcher and remember the user's explicit selection.

Do not create city pages for locations IronWake does not genuinely serve with unique content. Do not invent addresses or Google Business Profiles.

## Content evidence

Articles and insight pages need:

- real author/owner and reviewed date;
- first-hand project evidence or cited primary sources;
- original analysis tied to a buyer task;
- no invented study/audit sample sizes;
- links to relevant system and case study;
- update/review policy;
- clear demonstration versus client proof.

The Stitch article claiming audits of 42 platforms, 18% retention improvement, or similar metrics must remain quarantined unless evidence is supplied.

## Performance budgets

Measure mobile and desktop. Target field/Core Web Vitals at the 75th percentile after real traffic:

- LCP ≤ 2.5s;
- INP ≤ 200ms;
- CLS ≤ 0.1.

Development budgets are set after baseline, but must cover:

- route JS and total transfer size;
- image/video/3D weight;
- font files/subsets/preload count;
- long tasks and hydration cost;
- third-party scripts;
- server response and API p95;
- animation frame stability;
- cache behavior and invalidation.

Implementation rules:

- self-host/subset fonts if license and architecture approve; minimize weights;
- responsive modern image formats, explicit dimensions, correct priority/lazy loading;
- no giant blurred backgrounds or decorative video above the fold;
- server components/static rendering where interactive state is not needed;
- code-split optional 3D, charts, dashboards, and provider SDKs;
- defer analytics/chat until consent/interaction when appropriate;
- transform/opacity animation first; avoid layout-thrashing scroll handlers;
- prefetch deliberately, not every route;
- complete static fallback for reduced motion, no WebGL, and slow devices.

## Accessibility target

Target WCAG 2.2 AA, combining automation and manual testing.

Required:

- semantic landmarks and logical heading hierarchy;
- visible skip link and keyboard-complete navigation;
- focus order follows visual/logical order;
- visible focus not obscured by sticky UI;
- 44px target guidance for primary touch controls;
- labels/instructions/errors associated programmatically;
- errors summarized, preserved, and recoverable;
- no color-only or motion-only meaning;
- contrast tested in all states;
- dialogs, menus, tabs, accordions, carousels, filters use correct patterns;
- live regions only for meaningful async status;
- data tables preserve headers; responsive transformation retains relationships;
- alt text describes purpose; decorative images use empty alt;
- captions/transcripts for approved audio/video;
- zoom/reflow at 320 CSS px with no essential horizontal scrolling;
- reduced motion removes non-essential movement without hiding content;
- auth, booking, provider failure, and payment error paths are accessible.

## Motion and 2D/3D system

Every animation record includes:

```yaml
name:
business_meaning:
trigger:
element:
duration:
easing:
interruptible:
reduced_motion:
performance_cost:
test:
```

Preferred visual concepts are original lead-path/state transitions, system topology, layered evidence sheets, queue/status changes, and portfolio workflow walkthroughs. Decorative motion is limited. Do not use generic floating blobs, fake dashboards, or ungrounded AI imagery.

3D must never carry essential copy, CTA, proof, or navigation. It cannot block first paint, input, scrolling, or screen readers. Provide static/SVG fallback and device/performance cutoff.

## Evidence

Release evidence includes crawl/index checks, rendered HTML review, canonical/sitemap/robots, structured-data validation, broken links, mobile screenshots, Lighthouse/lab reports, bundle analysis, real-device/CPU-throttled checks, automated accessibility scans, keyboard/screen-reader manual checklist, reduced-motion screenshots, and residual limitations.

