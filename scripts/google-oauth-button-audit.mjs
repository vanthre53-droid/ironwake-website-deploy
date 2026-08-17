// ponytail: assert Continue-with-Google button + Google action exist in
// /login, /signup, and the CSS. R030 (Google login control) is not
// satisfied by Supabase provider config alone — the rendered DOM must
// contain a real control wired to signInWithOAuth.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const loginForm = fs.readFileSync(path.join(root, 'app/login/LoginForm.js'), 'utf8');
const signupForm = fs.readFileSync(path.join(root, 'app/signup/SignupForm.js'), 'utf8');
const authActions = fs.readFileSync(path.join(root, 'lib/supabase/auth-actions.mjs'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');

const issues = [];

if (!loginForm.includes('signInWithGoogleAction')) {
  issues.push('app/login/LoginForm.js does not import signInWithGoogleAction');
}
if (!loginForm.includes('Continue with Google')) {
  issues.push('app/login/LoginForm.js does not render "Continue with Google" label');
}
if (!signupForm.includes('signInWithGoogleAction')) {
  issues.push('app/signup/SignupForm.js does not import signInWithGoogleAction');
}
if (!signupForm.includes('Continue with Google')) {
  issues.push('app/signup/SignupForm.js does not render "Continue with Google" label');
}
if (!authActions.includes('export async function signInWithGoogleAction')) {
  issues.push('lib/supabase/auth-actions.mjs does not export signInWithGoogleAction');
}
if (!authActions.includes('signInWithOAuth')) {
  issues.push('lib/supabase/auth-actions.mjs does not call Supabase signInWithOAuth');
}
if (!authActions.includes("provider: 'google'") && !authActions.includes('provider:"google"')) {
  issues.push('lib/supabase/auth-actions.mjs does not pass provider:"google" to Supabase');
}
if (!css.includes('.auth-google')) {
  issues.push('app/globals.css missing .auth-google styles');
}

const result = { issueCount: issues.length, issues };
console.log(JSON.stringify(result, null, 2));
process.exit(issues.length === 0 ? 0 : 1);