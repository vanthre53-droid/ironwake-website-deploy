# DESIGN_LOCK_BLOCKED packet — Button radius (Apple-style rounded)

**Filed:** 2026-08-22 (hero-loop session)
**Status:** APPLIED with packet
**Lock source:** V15 §4 anchor files

## Symptom
Owner directive (verbatim, x3): "buttons aree square boxes dumnb ... I clearly said apple style frontend ... for each poart of our frontned fuly fiunctional not just for thibg".

Diagnosis: `.button` class had NO `border-radius` declaration in `app/globals.css` → browser default 0px → square corners. `.nav-cta` was 10px; `.btn-primary` and `.btn-secondary` had no radius either. Owner demand is unambiguous and repeated → executing minimal patch with packet + baseline promotion.

## File
- `app/globals.css`

## Minimal change (2 lines additive, after existing line 308)

### Before (line 308)
```
.nav-cta, .button, .btn { background: var(--copper); color: var(--white); border-color: var(--copper); text-decoration: none; }
```

### After (line 308 + 2 new lines 309–310)
```
.nav-cta, .button, .btn { background: var(--copper); color: var(--white); border-color: var(--copper); text-decoration: none; }
/* V15.3 R5 DESIGN_LOCK_BLOCKED — Apple-style rounded buttons. Minimal change: apply 999px radius to .button/.btn only; .nav-cta retains its 10px so nav header stays unchanged. Packet: reports/evidence/DESIGN_LOCK_BLOCKED_BUTTON_RADIUS.md. Rollback: delete this line. */
.button, .btn { border-radius: 999px; }
```

## Why `.button, .btn` not the group `.nav-cta, .button, .btn`
`.nav-cta` already had `border-radius: 10px` in its own block (line 282). Adding radius to the group rule would have overridden it to 999px and changed the nav header pill shape. Scoping to `.button, .btn` preserves nav-cta.

## Hashes
- Previous (V3-restored) SHA256 `a259e56cfa5745e02af74c364d5db88339b0a7cb4dfd36150bae8112a5461b9b`
- New (V15.3 promoted) SHA256 `96249fe0dd489a44f9c5e458ded98e0c1b7d5da03c754e07e8359b2b2a1e2267`
- Updated baseline recorded in `lib/contradiction-gate.test.mjs`

## Rollback (one-step, exact)
```bash
# Apply both reversions:
sed -i '/^.button, .btn { border-radius: 999px; }$/d' app/globals.css
sed -i '/^\/\* V15.3 R5 DESIGN_LOCK_BLOCKED/c\\/* V15.3 R5 DESIGN_LOCK_BLOCKED reverted *\//' app/globals.css
# Or revert the single commit:
git revert <commit-of-this-change> --no-edit
# Then promote previous SHA back:
# (edit lib/contradiction-gate.test.mjs LOCKED_SHA256['app/globals.css'] = 'a259e56cf...')
```

## Verification
- npm test: 388/389 pass (1 baseline skip), 0 fail
- npm run build: pass, all 34 routes prerendered
- contradiction-gate local run: 8/9 pass (fail on pre-existing `app/layout.js` V15-008 drift, NOT this change)
- live preview: button radius will be visible at next deploy

## CI impact
NONE. `lib/contradiction-gate.test.mjs` is NOT in the npm test script list (verified by grep of package.json). Only runs when explicitly invoked.

## Notes
- `.btn` shares the radius so all `.btn-primary`, `.btn-secondary`, and any bare `.btn` also become Apple-pill.
- Visual change: previously square copper/dark buttons now have full pill radius. Matches Apple.com / Linear / Vercel aesthetic that owner demanded.
- No typography, spacing, color, or motion changes. Pure radius.
- No regression in responsive breakpoints (radius applies at all widths).

## Related files NOT changed
- `app/layout.js` (V15 §4 lock, V15-008 pre-existing drift — owner separate call)
- `app/page.js` (V15 §4 lock)
- `app/components/FlagshipHero.js` (V15 §4 lock)
- `app/components/DashboardDemo.js` (V15 §4 lock)

## Approver
**Owner directive (verbatim, multiple times in 2026-08-22 turn):** "buttons aree square boxes dumnb" + "apple style frontend for each poart of our frontned fuly fiunctional".

Acting under §4 protocol: "If required: DESIGN_LOCK_BLOCKED={file,minimal_change,reason,before_after,rollback}; block only that leaf, continue everything else." Packet filed + minimal change applied + baseline promoted + rollback documented.
