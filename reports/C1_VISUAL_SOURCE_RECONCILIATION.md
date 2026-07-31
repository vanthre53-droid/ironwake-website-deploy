# C1 Visual Source Reconciliation

Status: `VERIFIED — M1 visual work is resealed; public implementation remains blocked`
Date: 2026-07-30

## Decision

Use the supplied Stitch sources in separate roles:

1. `/mnt/c/Users/vanth/Downloads/stitch_ironwake_design_system.zip` is the visual-token authority: warm ivory, ink, copper, Manrope, Inter, JetBrains Mono, 12-column layout, restrained light-glass surfaces, and soft-precision controls.
2. `stitch_ironwake_stitch_prompt_pack_v4 (2).zip` is the 30-screen route, composition, interaction-state, and information-architecture reference.
3. `reports/SCREEN_ROUTE_MATRIX.md`, the claim ledger, and approved gates decide what content is truthful enough to render.

## Why this correction is required

The current `app/` and duplicate `website/` prototype use a lime diagnostic-console system. That system is not grounded in either supplied Stitch source. It must not be extended.

## Sealed M1 boundary

- Keep `app/` as the only runtime application.
- Preserve the verified audit API, validation, migration, and tests.
- Do not copy Stitch HTML, Tailwind CDN setup, inline scripts, hotlinked images, prototype prices, metrics, provider states, or success claims.
- Rebuild shared presentation from the reconciled source system, starting with `/` and `/audit` only when W03/W04/GS1 and G3 permit public implementation.
- Retire `website/` only after the Next implementation has equivalent truthful routes and regression/visual evidence.

## Required evidence before visual acceptance

- `npm test`, `npm run test:website`, and `npm run build` pass.
- `git diff --check` passes.
- Desktop and mobile comparison at 320, 390, 768, 1024, 1280, and 1440px against the supplied screen references.
- Route, claim, and asset ledgers remain reconciled.
- No visual state implies provider, booking, payment, or client success without evidence.

## Gate status

`G1` and demonstration-only `G1.5` are recorded. `GS1` and `G3` remain pending. This correction seals the design direction but does not authorize public release, social publication, provider connection, or deployment.
