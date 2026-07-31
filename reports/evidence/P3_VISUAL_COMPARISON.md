# P3 Visual Comparison

Status: `VERIFIED — LOCAL DESKTOP RENDER; NOT A PRODUCTION/PUBLIC ACCEPTANCE`
Date: 2026-07-30T15:52:58Z

## Source authority

- Visual tokens: the reconciled external Stitch design ZIP.
- Composition/reference: audited 30-screen Stitch archive.
- Runtime: `app/` only; `website/` remains reference material.

## Desktop readback

A local production `next start` render at 1280px was inspected through the browser accessibility tree and screenshot.

- One visible H1; 22 keyboard-focusable elements.
- No horizontal overflow (`scrollWidth: 1280`, `innerWidth: 1280`).
- No observed overlap or unreadable text.
- Ivory/ink/copper hierarchy, technical status rail, demonstration labels, and static fallback art render without remote images or CDN dependencies.

## Deliberate exclusions

No external demos, social URLs, pricing, provider success, client results, booking success, payment state, or verified contact claim is presented as live.
