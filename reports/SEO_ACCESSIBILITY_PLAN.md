# C1 SEO, Accessibility, Performance, and QA Plan

- Prepared: 2026-07-27
- Status: implementation and release evidence pending; no production route is approved yet.

## SEO and content

- Give each approved indexable route one buyer intent, unique title, description, H1, canonical, and server-rendered useful content.
- Use crawlable internal links, valid sitemap and robots rules, real 404/redirect behavior, and noindex for private/staging surfaces.
- Add structured data only when visible content and the supported type justify it. Do not add fake reviews, ratings, local business, team, service-area, or result schema.
- Use owned/licensed local assets with dimensions and appropriate alt behavior. Do not hotlink Stitch imagery.
- Regional routes require meaningful scope/localization differences, explicit switching, and correct canonical/hreflang logic. Never IP-force a market.
- Articles require real author/owner, review date, original analysis, primary-source citations, and demonstration-versus-client-proof labels.

## Accessibility

Target WCAG 2.2 AA with semantic landmarks, skip link, logical headings, visible focus, keyboard-complete navigation, associated labels/errors, 44px touch guidance, contrast, non-color state meaning, accessible dialogs/menus/tabs, meaningful status announcements, captions/transcripts, and 320px reflow without essential horizontal scrolling.

Every async and form state must cover loading, empty, validation error, retry, success, provider failure, authorization denial, offline/reduced-motion fallback, and recovery without losing safe input.

## Performance and motion

Target mobile p75 LCP <= 2500 ms, INP <= 200 ms, and CLS <= 0.1 after real traffic. Use optimized local assets, explicit dimensions, minimal licensed fonts, server rendering where useful, code splitting for private/provider/optional-3D modules, and no blocking third-party scripts.

Motion must explain hierarchy, workflow, or state; use transform/opacity first, remain interruptible, and provide static/reduced-motion equivalence. 3D is optional progressive enhancement and never carries essential content or interaction.

## Acceptance evidence

Run production build, bundle review, rendered HTML/canonical/sitemap/robots checks, broken-link checks, Lighthouse or equivalent lab tests, automated accessibility scans, keyboard/manual reflow/reduced-motion checks, browser/E2E tests, and screenshots at 320/390/768/1024/1280/1440 px. Record deviations from Stitch as truthful, responsive, accessibility, or performance corrections.
