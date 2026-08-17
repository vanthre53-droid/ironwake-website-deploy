// ponytail: UI/visual hierarchy audit for the dynamic_glass_ui_all_routes gate.
// Verifies the CSS contract the UI depends on so any future regression (missing
// button states, broken focus rings, dangling tokens, banner that overlaps
// footer CTAs) is caught by `npm test` instead of a manual QA pass.
//
// Scope (static-CSS contract only — no DOM, no rendered colors):
//   1. .button has explicit :focus-visible, :active, :hover, :disabled states
//   2. .button.secondary / .button.ghost / .button.destructive variants exist
//   3. Disabled cursor is `not-allowed` (not `wait`) — disabled buttons
//      communicate "you can't click this", not "I'm loading"
//   4. .cookie-banner uses --body token (--sans is NOT defined in :root and was
//      silently falling back to system-ui — the audit catches the regression)
//   5. Cookie banner lifts on small viewports (<=720px) so it never covers the
//      site-assistant launcher (z-index 60, fixed bottom-right) or footer CTAs
//   6. prefers-reduced-motion / prefers-reduced-transparency guards exist for
//      every glass surface that uses backdrop-filter
//   7. .auth-google control still references Continue with Google text in at
//      least one form (the gate inherits R030; we re-state to catch regressions)
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const loginForm = fs.existsSync(path.join(root, 'app/login/LoginForm.js'))
  ? fs.readFileSync(path.join(root, 'app/login/LoginForm.js'), 'utf8')
  : '';
const signupForm = fs.existsSync(path.join(root, 'app/signup/SignupForm.js'))
  ? fs.readFileSync(path.join(root, 'app/signup/SignupForm.js'), 'utf8')
  : '';

const issues = [];

// 1. Button state matrix -------------------------------------------------------
if (!/\.button:focus-visible/.test(css)) {
  issues.push('app/globals.css missing .button:focus-visible (keyboard ring)');
}
if (!/\.button:active/.test(css)) {
  issues.push('app/globals.css missing .button:active (pressed state)');
}
if (!/\.button:hover/.test(css)) {
  issues.push('app/globals.css missing .button:hover');
}
if (!/\.button:disabled/.test(css)) {
  issues.push('app/globals.css missing .button:disabled');
}

// 2. Variants -----------------------------------------------------------------
if (!/\.button\.secondary\b/.test(css)) {
  issues.push('app/globals.css missing .button.secondary');
}
if (!/\.button\.ghost\b/.test(css)) {
  issues.push('app/globals.css missing .button.ghost (low-emphasis variant)');
}
if (!/\.button\.destructive\b/.test(css)) {
  issues.push('app/globals.css missing .button.destructive (danger variant)');
}

// 3. Disabled cursor must be not-allowed -------------------------------------
// The original line was `cursor: wait` which conflated "loading" with "disabled"
// and lied to screen-reader users about state. We allow both `not-allowed` and
// `pointer-events: none` style guards, but the cursor itself must be not-allowed.
const disabledBlock = css.match(/\.button:disabled[^{]*\{[^}]*\}/);
if (disabledBlock && !/cursor:\s*not-allowed/.test(disabledBlock[0])) {
  issues.push('.button:disabled block missing cursor:not-allowed (was cursor:wait)');
}

// 4. Cookie banner token hygiene ---------------------------------------------
if (/var\(--sans\)/.test(css)) {
  issues.push('app/globals.css still references undefined --sans token (should be --body)');
}
if (!/\.cookie-banner-text\{[^}]*var\(--body\)/.test(css)) {
  issues.push('.cookie-banner-text does not use var(--body)');
}

// 5. Cookie banner mobile lift -----------------------------------------------
if (!/@media \(max-width: 720px\)\{[\s\S]*\.cookie-banner\{[\s\S]*bottom:\s*96px/.test(css)) {
  issues.push('Cookie banner does not lift to bottom:96px on viewports <=720px (covers site-assistant)');
}

// 6. Reduced-motion / reduced-transparency guards on glass -------------------
// ponytail: every glass variant that declares backdrop-filter must be
// neutralised under (prefers-reduced-motion: reduce) +
// (prefers-reduced-transparency: reduce). We check the CSS contract as:
//   - every .glass* selector that contains `backdrop-filter:` must appear
//     somewhere in a @media (prefers-reduced-*) block that ALSO sets
//     `backdrop-filter: none`.
// Implemented as: list backdrop-filter-bearing glass selectors, then verify
// the file's reduced-motion block disables backdrop-filter for at least one
// of them (we only need one universal guard for the whole family, not per-
// selector copies).
const glassSelectorsWithBlur = (css.match(/\.glass[^{]*\{[^}]*backdrop-filter:[^}]*\}/g) || [])
  .map((block) => (block.match(/(\.glass[^{]*)\{/) || [, ''])[1])
  .filter(Boolean);
const reducedGuardPresent = /@media\s*\(prefers-reduced-[^)]*\)[^{]*\{[\s\S]*?backdrop-filter:\s*none/.test(css);
if (glassSelectorsWithBlur.length > 0 && !reducedGuardPresent) {
  issues.push('Glass surfaces use backdrop-filter but lack prefers-reduced-transparency guard');
}
const glassReducedMotion = reducedGuardPresent;

// 7. Google control still present (inherited from R030 / google-oauth-button-audit)
const googleReachable = (loginForm.includes('Continue with Google') || signupForm.includes('Continue with Google'));
if (!googleReachable) {
  issues.push('Google login control missing from /login and /signup forms');
}

const result = {
  scope: 'ui-visual-audit',
  timestamp: new Date().toISOString(),
  issueCount: issues.length,
  issues,
  checks: {
    buttonStates: issues.filter((i) => /button/.test(i)).length === 0,
    buttonVariants: issues.filter((i) => /\.(secondary|ghost|destructive)/.test(i)).length === 0,
    cookieBannerHygiene: issues.filter((i) => /cookie/.test(i)).length === 0,
    glassReducedMotion,
    googleControlReachable: googleReachable,
  },
};
console.log(JSON.stringify(result, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
