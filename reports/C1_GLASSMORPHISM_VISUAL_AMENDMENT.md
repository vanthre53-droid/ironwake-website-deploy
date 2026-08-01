# C1 Glassmorphism Visual Amendment

Status: `VERIFIED DESIGN DIRECTION — LOCAL-ONLY M1 QUEUE SEALED`
Date: 2026-08-01

## User direction

Replace the current flat diagnostic-console presentation with the approved source system's light glassmorphism. This remains reversible local implementation under G3; claims, routes, data flow, providers, authentication, and deployment are out of scope.

## Sources read

1. `stitch_ironwake_design_system.zip` `DESIGN.md`: visual-token authority — Soft Ivory `#FAF9F6`, Deep Ink, Copper `#B87333`, Manrope/Inter/JetBrains Mono, 8px rhythm, 40–70% white glass, 20px blur, faint stroke, warm diffuse lift, persistent glass header.
2. `stitch_ironwake_stitch_prompt_pack_v4 (2).zip` `DESIGN.md`: 30-screen composition authority — editorial engineering, asymmetry, hairlines, restrained structure.
3. All repository `docs/`, `prompts/`, durable `state/`, approval intake, current shared CSS/components, and live local `/`, `/audit`, and `/owner` browser surfaces.

The sources conflict only in emphasis: the token source explicitly calls for light glass; the 30-screen source prefers paper planes. The amendment resolves this by retaining the latter's hierarchy and spacing while using the former's transparent layered surfaces.

## Design plan

- Palette: ivory canvas with low-contrast copper and slate ambient fields behind glass; existing semantic text/error colors remain.
- Surfaces: one shared glass treatment only — translucent white, 20px blur, faint warm border, restrained diffuse shadow. No card-specific visual systems.
- Header: permanently translucent glass; remove scroll-driven JavaScript state and its transition.
- Motion: delete reveal, hover-lift, rail-pulse, and dot-glow animation. The labelled inquiry → owner → next-action rail remains as the single static signature.
- Layout/content: unchanged. Existing semantic markup, CTA destinations, truth labels, inputs, and private authorization surfaces remain untouched.
- Accessibility/performance: preserve visible focus, current contrast tokens, keyboard/native menu behavior, 44px mobile controls, and reduced-motion support. No dependency or external asset is added.

## Critique

The live homepage is structurally clear but reads as a flat paper dossier: glass surfaces disappear into the canvas, the header glass appears only after a scroll event, and staggered reveal/rail animation adds generic motion without improving the decision path. This amendment makes depth visible through one consistent surface system and removes all ornamental motion.

## Sealed M1 task

`W11-T12A` may touch only `app/globals.css`, `app/components/SiteHeader.js`, and their focused regression tests. Required checks: `npm test`, `npm run build`, `git diff --check`, and browser/accessibility readback of `/`, `/audit`, and `/owner` at desktop and mobile widths.

## Final-gate answers

1. Signature: the static inquiry → owner → next-action rail, from IronWake's operating model.
2. Replaced: flat paper cards plus reveal/rail motion; now visible light-glass layering with no decorative animation.
3. Memorability: the site combines an editorial technical dossier with a calm, warm glass depth rather than another dark AI dashboard or generic frosted-glass landing page.
