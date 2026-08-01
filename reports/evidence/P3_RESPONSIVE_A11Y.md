# P3 Responsive/A11y Evidence

Status: `PARTIAL — BROWSER ACCESSIBILITY VERIFIED; VISUAL RESPONSIVE PASS PENDING`

Date: 2026-07-31

## Browser verification (Hermes M2 session)

Routes verified via live browser accessibility snapshots:

| Route | Title correct | Navigation present | Semantic landmarks | Interactive elements labeled | Notes |
|-------|--------------|-------------------|-------------------|---------------------------|-------|
| `/` | IronWake — Systems that answer ✅ | Header nav + footer nav ✅ | main, sectionheader, sectionfooter, complementary ✅ | Links/buttons labeled ✅ | Demo labels present |
| `/audit` | Business Leak Audit — IronWake ✅ | Header + footer ✅ | main, form ✅ | All inputs labeled, honeypot present, consent checkbox ✅ | Form accessible |
| `/systems` | Systems — IronWake ✅ | Header + footer ✅ | main ✅ | Links labeled ✅ | Truthful content |
| `/work` | Work — IronWake ✅ | Header + footer ✅ | main ✅ | Links labeled ✅ | DEMONSTRATION labels |
| `/process` | Process — IronWake ✅ | Header + footer ✅ | main ✅ | Links labeled ✅ | No SLA/price claims |
| `/about` | About — IronWake ✅ | Header + footer ✅ | main ✅ | Links labeled ✅ | Founder attribution |
| `/book` | Book — IronWake ✅ | Header + footer ✅ | main, note ✅ | Links labeled ✅ | Cal.com placeholder |
| `/owner` | Owner CRM — IronWake (private) ✅ | None (auth-gated) ✅ | main, form ✅ | Email/password labeled ✅ | Auth gate correct |
| `/admin` | Notification status — IronWake (private) ✅ | None (auth-gated) ✅ | main, form ✅ | Email/password labeled ✅ | Auth gate correct |

## Dark mode

`globals.css` contains `@media (prefers-color-scheme: dark)` with semantic color tokens. No manual toggle dependency. Test `app/globals.css.test.js` verifies dark-theme variables exist.

## Keyboard/focus

`:focus-visible` rule present in globals.css with `outline: 2px solid var(--copper); outline-offset: 3px`. All interactive elements are native HTML (`a`, `button`, `input`, `textarea`, `select`) which receive keyboard focus by default.

## Limitations

- No pixel-level visual comparison against the 30 Stitch design screens was performed in this session.
- No reduced-motion or screen-reader-specific testing was performed.
- Responsive breakpoints (860px, 580px) exist in CSS but were not tested at each width via browser resize.
