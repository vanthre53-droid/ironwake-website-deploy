# IronWake Design Plan — Prototype Upgrade

Status: `INTERNAL DESIGN DIRECTION — NOT PUBLIC APPROVAL`

## Grounding

- Business: IronWake is an agency-led systems practice for service businesses with inquiry, booking, follow-up, and reception leaks.
- Page job: make the visitor recognise an operational leak and request a Business Leak Audit.

## Direction

- Concept: a calm diagnostic console on paper, not a futuristic dashboard.
- Palette: paper `#f4f3ee` (technical worksheet), ink `#171916` (high-contrast text), graphite `#555a52` (secondary copy), line `#d8d9d1` (rules), signal `#c8f04a` (verified action), white `#ffffff` (input surfaces).
- Type: local system sans for readable body copy; condensed fallback display stack (`Arial Narrow`, `Helvetica Neue`, sans-serif) for a technical wordmark feel. No remote font dependency.
- Signature: a small animated `signal rail` that moves from `INQUIRY` to `OWNER` to `NEXT ACTION`; it expresses the product's operating logic rather than decoration.
- Motion: one hero rail animation only; card hover is a static border/translate cue; `prefers-reduced-motion` disables animation.
- Layout: asymmetric hero with a diagnostic rail, then a varied three-column evidence band. Mobile collapses to one column with 44px controls.

## Critique

- Removed the repeated wallpaper rhythm by giving the first card a stronger role and varying card density.
- Avoided the banned dark-glow, gradient headline, glassmorphism, stock imagery, and scroll-fade patterns.
- Kept copy truthful: no client outcomes, live provider claims, or invented metrics.

## Release gate answers

1. Signature element: the signal rail, derived from IronWake's inquiry → ownership → next-action operating model.
2. First-draft drift: repeated generic cards and default Arial; replaced with a diagnostic rail, role-based typography, and varied section rhythm.
3. Memorability: visitors see a service-operations diagnostic, not a generic AI agency landing page, because the central visual is a concrete leak-to-owner workflow.
