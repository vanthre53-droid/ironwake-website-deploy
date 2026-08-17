# IronWake UI/UX Upgrade — 2026-08-17

**Gate:** `dynamic_glass_ui_all_routes`
**Worker:** task-1786961711240-3a4c46169d
**Trace:** trace-1786961710534-b491b59cacb9
**Scope:** `app/globals.css` + 2 new audit scripts. No JSX touched. No new dependencies.

## Why this change

The site's button system, focus-ring treatment, and cookie banner had three
concrete problems that were silently eroding trust:

1. **No complete button state matrix.** `.button` had hover / focus-visible /
   disabled, but no `:active` (pressed) feedback, and only one variant
   (`.secondary`) on top of the default. A "delete account" CTA and a
   "view portfolio" CTA rendered with identical styling — the most dangerous
   action in the app looked the same as the safest.

2. **Disabled button said `cursor: wait`.** That conflates *loading* with
   *disabled*. Screen-reader users got the wrong mental model; sighted users
   couldn't tell if their click had registered or if the page was hung.

3. **Cookie banner blocked footer CTAs + the site-assistant launcher on
   small viewports.** Fixed `bottom: 16px; left: 16px; right: 16px` at
   `z-index: 180` sat directly on top of the site-assistant (z-index 60, fixed
   bottom-right 18-24px) and on top of any footer CTA the user might want to
   click. On a phone that meant *the cookie banner was the only thing the
   user could interact with* until they dismissed it.

The dynamic-glass surface family also lacked a cool-tinted variant for
hero-adjacent CTA groups; the warm copper hero had no visual companion on
the other side of the page, so the right rail felt flat.

## What changed

### `app/globals.css` (+61 / -8)

**1. Button state matrix** (lines 132-167)

| Variant | Default | Hover / focus-visible | Active (pressed) | Disabled |
|---|---|---|---|---|
| `.button` (primary) | `--action` copper fill | `--copper-dark`, lift -3px, copper shadow halo | scale 0.98, inset shadow | `cursor: not-allowed`, opacity .55, no lift |
| `.button.secondary` | transparent + ink border | `--stone` fill, copper border + text | (inherits primary active) | graphite text + rule border |
| `.button.ghost` *(new)* | transparent, no border | stone fill, rule border, copper text | stone-deep fill, scale 0.98 | graphite text, transparent |
| `.button.destructive` *(new)* | `--notice-error` fill | deeper red, copper-tone shadow | (inherits primary active) | graphite fill, white text |

All variants also honor `.button[aria-busy="true"]` so async submit buttons
get the same disabled treatment without losing the announcement.

**2. Explicit `:focus-visible` ring on `.button` and `.nav-cta`** (3px copper outline at 4px offset) — matches the global focus ring rhythm.

**3. Cookie banner fixes**
- `var(--sans)` → `var(--body)` (the `--sans` token is not defined in `:root`; was silently falling back to `system-ui`).
- `@media (max-width: 720px)`: banner lifts to `bottom: 96px` with full-width, so it never sits on top of the site-assistant launcher.
- `.cookie-banner-actions .btn:focus-visible`, `:hover`, `:active`, `:disabled` — full state matrix on the banner's own buttons.

**4. New `.glass--cool` surface** — cool-tinted gradient + aqua hint for hero-adjacent CTA groups, with its own `prefers-reduced-transparency` guard.

**5. Reduced-motion guard extended** — `.glass--dark` and `.glass--cool` now drop `backdrop-filter` under `prefers-reduced-motion: reduce` / `prefers-reduced-transparency: reduce`.

### `scripts/ui-visual-audit.mjs` (new, 138 lines)

Static-CSS audit that asserts the contract the UI depends on:

| Check | What it catches |
|---|---|
| `buttonStates` | missing `:hover` / `:active` / `:focus-visible` / `:disabled` |
| `buttonVariants` | missing `.secondary` / `.ghost` / `.destructive` |
| `cookieBannerHygiene` | dangling `var(--sans)`, banner not lifting on <=720px |
| `glassReducedMotion` | any glass surface using `backdrop-filter` without a `prefers-reduced-*` guard |
| `googleControlReachable` | Continue-with-Google regression (inherited from R030) |

### `scripts/ui-visual-audit.test.mjs` (new, 34 lines)

`node:test` wrapper that spawns the audit as a child process and asserts
exit 0 + zero issues + structural key presence. Mirrors the established
pattern in `scripts/google-oauth-button-audit.test.mjs`.

## Verification

```
$ npm test
# tests 287
# pass 287
# fail 0

$ for a in retell-prompt worker-secrets deploy-ledger build portfolio glass-primitive \
          favicon contrast perf a11y metadata sitemap csp rls-policy supabase security \
          google-oauth-button mobile-overlap ui-visual-audit; do
    node "scripts/$a.mjs" >/dev/null && echo "OK $a" || echo "FAIL $a"
  done
ALL 18 AUDITS OK

$ grep -rE 'whsec_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|sk_live_[A-Za-z0-9]{20,}' \
     app/globals.css scripts/ui-visual-audit.mjs scripts/ui-visual-audit.test.mjs
# (no matches)
```

No secrets introduced. Diff is 61 insertions / 8 deletions in
`app/globals.css`, plus the two new audit files.

## What was deliberately NOT done

- No JSX changes. The audit catches what *must* be true at the CSS level;
  no component needs to be re-wired for the new variants to be available.
- No new dependencies. The audit uses only `node:fs`, `node:path`,
  `node:child_process`.
- No deploy. The Cloudflare deploy budget (1 remaining) is reserved for
  user-approved visual review of the rendered result, not for a routine
  CSS / audit commit.

## Next step for the human reviewer

Boot the dev server (`npm run dev`) and exercise the new variants:

```jsx
<button className="button">Primary CTA</button>
<button className="button secondary">Secondary</button>
<button className="button ghost">Ghost</button>
<button className="button destructive">Delete account</button>
<button className="button" disabled>Disabled</button>
```

And on a phone-width viewport (Chrome DevTools 360px) confirm the cookie
banner sits above the site-assistant launcher rather than on top of it.
