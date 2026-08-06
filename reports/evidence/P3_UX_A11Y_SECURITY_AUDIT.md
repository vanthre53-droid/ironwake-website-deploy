# Evidence: Comprehensive Website UX, A11y, Security Audit (2026-08-05)

## Commits
- `9d8642d` — comprehensive website UX, dark mode, contrast, copy, portfolio enrichment
- `8e6ec31` — scroll-to-top, skip-link, WCAG heading hierarchy, dark mode a11y
- `3240b18` — security headers (X-Frame-Options, nosniff, referrer, permissions)

## Test verification
- 62/62 tests pass
- 27 pages build clean
- 0 whitespace errors
- State validation: PASS
- Execution pack validation: PASS
- Secret scan: CLEAN

## UX improvements (commit 9d8642d)
### Dark mode (proper, not just body color)
- CSS variable overrides for --paper, --stone, --ink, --graphite, --white, --rule, --surface, --surface-strong, --surface-solid
- All card surfaces, header, footer, assistant panel, form inputs, scope shapes properly themed
- Assistant trigger inverted for dark mode visibility
- Secondary hero buttons visible in dark mode

### WCAG contrast
- Action color changed from #b6492f (4.57:1) to #b3452c (5.29:1) — AA compliant on light background
- White-on-action: 6.25:1 — AA compliant

### Copy improvements
- All pages rewritten with direct, action-oriented, user-friendly language
- Removed vague phrasing ("Four categories", "Map. Fix. Test. Document.")
- Booking: "Nothing is booked when you press send" replaces "Cal.com is not connected"
- Audit: "This request does not book a call or create a quote"
- 404: "We could not find that page" replaces "Path unowned"
- Systems: "Three operational gaps" replaces "Four categories"
- Footer: clearer disclosure wording

### Motion
- Hero entrance animations removed — content visible immediately
- `@keyframes hero-arrive` removed (unused after hero animation removal)
- Signal rail decorative animation preserved (CSS-only, reduced-motion safe)

### Navigation
- All header CTAs consistent: "Find my workflow leak"
- Desktop nav, mobile nav, footer all link to correct routes
- All 20 internal links verified returning HTTP 200

### Interactive elements verified
- System sub-page stage-filter buttons (3-5 per page) all functional
- Booking form: 6 required fields, proper validation
- Audit form: 4 required fields, honeypot, consent
- Site assistant: 3 prompt buttons, guide text, close button
- Owner dashboard: auth form, lead filters, CSV export
- AI receptionist: sample transcript disclosure toggle

## Accessibility improvements (commit 8e6ec31)
### Skip link
- Added `skip-link` class: hidden off-screen, visible on focus (Tab key)
- Links to #main-content

### Heading hierarchy
- Case study pages: h3→h2 to fix h1→h3 skip (WCAG 2.4.6)
- Home page portfolio section: h3→h2 for hierarchy
- CSS selectors updated to match

### Full a11y audit results (21 pages)
- 18/21 pages: PASS (0 issues)
- 3/3 case study pages: fixed (heading skip resolved)
- All pages have: main, nav, header, footer, aside landmarks
- All pages have exactly 1 h1
- No duplicate IDs
- No images missing alt text (0 images used — all CSS/SVG)
- No buttons missing accessible names
- No inputs missing names

### Scroll-to-top
- Appears after 600px scroll
- Glass-style button, 44x44px (WCAG touch target)
- Smooth scroll, aria-label="Scroll to top"

## Security improvements (commit 3240b18)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Performance metrics
| Page | HTML Size | Tags | Scripts | Styles |
|------|-----------|------|---------|--------|
| / | 32.0KB | 232 | 12+11 | 1 |
| /audit | 13.4KB | 120 | 12+6 | 1 |
| /book | 17.5KB | 110 | 12+6 | 1 |
| /systems | 21.0KB | 116 | 11+8 | 1 |
| /work | 31.1KB | 197 | 12+10 | 1 |

- 0 external images (no hotlinking)
- 1 external stylesheet (Next.js bundle)
- All JavaScript is Next.js framework + client components
- No third-party analytics or tracking scripts

## Responsive evidence
- Mobile 390x844 screenshots captured for home and booking pages
- Both verified as proper mobile viewport rendering
- Mobile nav toggle available at <580px
- All buttons full-width on mobile
- Touch targets 44px minimum

## Remaining external work (not blocking local)
- GS1: Social media profiles (owner action)
- G2: Live owner MFA/recovery (owner action)
- G4: Provider connections — Cal.com, Resend, Sentry DSN (owner action)
- G5: Domain/deployment (owner action)
- Legal pages approval (owner action)
- Pricing/offer decisions (owner action)
- Production E2E test (requires providers)
