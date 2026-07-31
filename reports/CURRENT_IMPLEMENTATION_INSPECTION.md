# Current Implementation Inspection

**Status:** `MISMATCH — corrective rebuild required before visual acceptance`
**Inspected:** 2026-07-30

## Verified source of truth

- `stitch_ironwake_stitch_prompt_pack_v4 (2).zip` contains **30** desktop `code.html` / `screen.png` pairs.
- `/mnt/c/Users/vanth/Downloads/stitch_ironwake_design_system.zip` contains the approved `DESIGN.md`.
- `reports/SCREEN_ROUTE_MATRIX.md` accounts for all 30 screens and records the truthful production disposition of every prototype route.

## Current implementation

- Root `app/` contains a Next.js application with `/`, `/audit`, six generic informational slugs, an API route, and a custom 404.
- `website/` contains a separate static/hash-router prototype that repeats the same generic visual system.
- Both implementations use a lime-accent, sans-led, pill-control visual language which conflicts with the approved warm-ivory, copper, editorial, light-glass design system.
- The rendered home page contains only a header, hero, three cards, and footer. It does not represent the approved home screen’s information architecture or visual composition.
- The actual Stitch sources had not been used when the current implementation was created.

## Required correction

1. Retain `app/` as the single runtime implementation and remove/retire duplicate `website/` only after the replacement passes regression checks.
2. Rebuild the shared layout, typography, palette, navigation, section rhythm, cards, form treatment, and footer from the paired 30-screen references and the prompt-pack embedded `DESIGN.md` (which overrides the conflicting standalone ZIP where they differ).
3. Account for all 30 screens in a route/component matrix, while keeping routes with unapproved claims, prices, provider status, or legal content visibly deferred or truthful.
4. Do not copy the prototype Tailwind CDN, inline scripts, hotlinked assets, or quarantined claims.
5. Keep the verified server-side audit persistence path and change only its presentation until form/protection work is separately approved.

## Repository health findings

- `state/PROJECT_STATE.yaml` is stale: it still says public website implementation has not started and points to W03, while the working tree contains a new uncommitted Next.js/Supabase implementation.
- The working tree includes 25 modified tracked files and untracked application/runtime/generated files.
- `.ironwake/` is untracked and not ignored; generated runtime evidence triggered the secret-pattern scan and must not be committed without redaction review.
- An orphan Next preview listener on port 3004 was found and stopped during inspection.

## Next exact action

Implement the shared approved visual system in the existing Next.js application, beginning with the home and Business Leak Audit screens; then perform desktop/mobile visual comparison against the supplied references before expanding to remaining screen routes.
