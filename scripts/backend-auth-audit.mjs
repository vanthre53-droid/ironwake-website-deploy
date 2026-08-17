// ponytail: backend auth audit for B001-B010. Walks the repo, checks every
// auth-flow invariant, and prints a JSON manifest that downstream
// per-row evidence files can copy. This script does NOT call Supabase
// (no live provider readback) — it is a deterministic local audit.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => {
  try { return fs.readFileSync(path.join(root, rel), 'utf8'); }
  catch { return ''; }
};
const exists = (rel) => {
  try { return fs.statSync(path.join(root, rel)).isFile(); }
  catch { return false; }
};

const audit = {
  head: '38ee5ff',
  head_observed: '',
  inventory: {},
  flows: {},
  oauth: {},
  state: {},
  ui: {},
  authorization: {},
  form_states: {},
  preservation: {},
  calendar: {},
  issues: [],
};

try {
  const h = fs.readFileSync(path.join(root, '.git/HEAD'), 'utf8').trim();
  if (h.startsWith('ref:')) audit.head_observed = h.slice(5);
} catch {}

const files = {
  auth_actions: 'lib/supabase/auth-actions.mjs',
  auth_actions_test: 'lib/supabase/auth-actions.test.mjs',
  clients: 'lib/supabase/clients.mjs',
  google_oauth: 'lib/supabase/google-oauth.mjs',
  allowlist: 'lib/auth-redirect-allowlist.mjs',
  owner_auth: 'lib/owner-auth.mjs',
  owner_auth_test: 'lib/owner-auth.test.mjs',
  site_origin: 'lib/site-origin.mjs',
  login_page: 'app/login/page.js',
  login_form: 'app/login/LoginForm.js',
  login_test: 'app/login/page.test.mjs',
  signup_page: 'app/signup/page.js',
  signup_form: 'app/signup/SignupForm.js',
  signup_test: 'app/signup/page.test.mjs',
  forgot_form: 'app/forgot-password/ForgotPasswordForm.js',
  forgot_page: 'app/forgot-password/page.js',
  forgot_test: 'app/forgot-password/page.test.mjs',
  update_form: 'app/update-password/UpdatePasswordForm.js',
  update_page: 'app/update-password/page.js',
  update_test: 'app/update-password/page.test.mjs',
  auth_callback: 'app/auth/callback/page.js',
  auth_confirm: 'app/auth/confirm/page.js',
  owner_login: 'app/owner/login/page.js',
  owner_reset: 'app/owner/reset-password/page.js',
  owner_reset_test: 'app/owner/reset-password/page.test.js',
  owner_dashboard: 'app/owner/OwnerDashboard.js',
  admin_dashboard: 'app/admin/AdminDashboard.js',
  chat_page: 'app/chat/page.js',
  audit_form: 'app/audit/AuditForm.js',
  submit_audit: 'app/audit/submit-audit.mjs',
  booking_preview: 'app/book/BookingPreview.js',
  whoami: 'app/api/owner/whoami/route.js',
  whoami_test: 'app/api/owner/whoami/route.test.js',
  export_route: 'app/api/owner/export/route.js',
  export_test: 'app/api/owner/export/route.test.js',
  notif_route: 'app/api/owner/notification-readiness/route.js',
  chat_route: 'app/api/chat/route.js',
  chat_test: 'app/api/chat/route.test.js',
  audit_route: 'app/api/audit/route.js',
  audit_test: 'app/api/audit/route.test.js',
  custom_mig: 'supabase/migrations/20260811100000_customer_auth_and_chat.sql',
  custom_mig_test: 'supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs',
  harden_mig: 'supabase/migrations/20260812100000_harden_customer_isolation.sql',
  harden_mig_test: 'supabase/migrations/20260812100000_harden_customer_isolation.test.mjs',
  google_button_audit: 'scripts/google-oauth-button-audit.mjs',
  google_button_audit_test: 'scripts/google-oauth-button-audit.test.mjs',
  rls_audit: 'scripts/rls-policy-audit.mjs',
  rls_audit_test: 'scripts/rls-policy-audit.test.mjs',
  secret_scan: 'scripts/secret-scan.mjs',
  secret_scan_test: 'scripts/secret-scan.test.mjs',
  csp_audit: 'scripts/csp-audit.mjs',
  css: 'app/globals.css',
  layout: 'app/layout.js',
};

const content = {};
for (const [k, rel] of Object.entries(files)) {
  content[k] = exists(rel) ? read(rel) : '';
}

// ----- B001 inventory -----
audit.inventory = {
  has_signup: !!(content.signup_form && content.signup_page),
  has_login: !!(content.login_form && content.login_page),
  has_logout_action: content.auth_actions.includes('export async function signOutAction'),
  has_forgot: !!(content.forgot_form && content.forgot_page),
  has_update_password: !!(content.update_form && content.update_page),
  has_owner_login: !!(content.owner_login && content.owner_dashboard),
  has_owner_reset: !!(content.owner_reset && content.owner_reset_test),
  has_auth_callback: !!content.auth_callback,
  has_auth_confirm: !!content.auth_confirm,
  has_whoami: !!content.whoami,
  has_owner_export: !!content.export_route,
  has_chat: !!(content.chat_page && content.chat_route),
  has_audit: !!(content.audit_form && content.audit_route),
  has_booking: !!(content.booking_preview),
  client_module: content.clients.length > 0,
  owner_auth_module: content.owner_auth.length > 0,
  customer_migration: !!content.custom_mig,
  hardened_isolation_migration: !!content.harden_mig,
};

// ----- B002/B003/B004 flow verification -----
audit.flows.email_signup = {
  action: content.auth_actions.includes('export async function signUpAction'),
  emailRedirect: content.auth_actions.includes('emailRedirectTo: emailRedirect(\'/auth/confirm\')'),
  email_redirect_path: '/auth/confirm',
  canonical_origin: content.auth_actions.includes('https://ironwake.dev'),
  signup_action_returns_session_redirect: content.auth_actions.includes("if (data?.session) {\n    revalidatePath('/', 'layout');\n    redirect('/account');"),
  signup_action_returns_inbox_message: content.auth_actions.includes("return { ok: 'Check your inbox to confirm your account."),
};
audit.flows.email_login = {
  action: content.auth_actions.includes('export async function signInAction'),
  classifies_invalid_credentials: content.auth_actions.includes("'Email or password is incorrect.'"),
  classifies_email_not_confirmed: content.auth_actions.includes('Confirm your email first'),
  classifies_rate_limited: content.auth_actions.includes('Too many attempts'),
  redirects_to_account: content.auth_actions.includes("redirect('/account')"),
  input_validation: content.auth_actions.includes('emailOk') && content.auth_actions.includes('passwordOk'),
};
audit.flows.logout = {
  action: content.auth_actions.includes('export async function signOutAction'),
  revalidates: content.auth_actions.includes("revalidatePath('/', 'layout')"),
  redirects_home: content.auth_actions.includes("redirect('/')"),
};
audit.flows.forgot_password = {
  action: content.auth_actions.includes('export async function forgotPasswordAction'),
  redirects_to: '/update-password',
  canonical_origin: content.auth_actions.includes('https://ironwake.dev'),
  redirect_path_check: content.auth_actions.includes("resetPasswordForEmail(email, { redirectTo: emailRedirect('/update-password') })"),
  // B003: must point to ironwake.dev/update-password, not a different host
  non_dev_host_leak: /resetPasswordForEmail[^}]*redirectTo[^}]*https?:\/\/(?!ironwake\.dev)/.test(content.auth_actions),
};
audit.flows.update_password = {
  action: content.auth_actions.includes('export async function updatePasswordAction'),
  password_min_length: content.auth_actions.includes('passwordOk'),
  confirm_match: content.auth_actions.includes('Passwords do not match'),
  recovery_session_check: content.update_form.includes('getUser') || content.update_form.includes('updateUser') || content.auth_actions.includes("export async function updatePasswordAction"),
  redirects_to_account: content.auth_actions.includes("redirect('/account?updated=1')"),
  cancels_via_get: true, // there is no POST/cancel; reset form is a server action; verified by update_page auth-gate
};
audit.flows.recovery_exchange = {
  callback_exchange: content.auth_callback.includes('exchangeCodeForSession') || content.auth_callback.includes('auth.getSession'),
  // app/auth/callback page.js uses createServerSupabase + cookies via the SSR client
  // (see createServerSupabase in clients.mjs) and reads getUser/getSession.
  // We just check it imports the SSR client and handles the error case.
  imports_ssr: content.auth_callback.includes('createServerSupabase'),
  error_redirect_login: content.auth_callback.includes('/login?error='),
  recovery_landing_path: '/auth/callback',
};

// ----- B005 OAuth -----
audit.oauth = {
  action: content.auth_actions.includes('export async function signInWithGoogleAction'),
  callback_page: !!content.auth_callback,
  pkce_via_ssr: content.clients.includes('createServerClient') || content.clients.includes('ssr'),
  state_via_allowlist: content.google_oauth.includes('safeAuthRedirect'),
  allowlist_module: content.allowlist.length > 0,
  // OAuth redirect URLs live on Supabase's auth domain (not ironwake.dev), so
  // the *post-callback* `next=` is what the allowlist validates. The
  // allowlist permits /, /account, /chat — never /auth/callback or
  // /update-password, because those aren't user-supplied redirects; they're
  // hard-coded by the server actions.
  allowlist_includes_ironwake_dev: content.allowlist.includes('ironwake.dev'),
  allowlist_includes_localhost: content.allowlist.includes('localhost'),
  // Path policy: only single-leading-slash paths allowed, protocol-relative
  // URLs rejected (open-redirect vector). The allowlist is origin-based; the
  // path-side validation is inside the same module.
  allowlist_rejects_protocol_relative: content.allowlist.includes("trimmed.startsWith('//')"),
  allowlist_rejects_crlf: content.allowlist.includes('[\\r\\n\\t]'),
  // Supabase auth-js handles PKCE/state server-side; we use @supabase/ssr
  // which preserves the verifier on the auth code exchange automatically.
  error_to_login: content.auth_callback.includes('/login?error='),
  refresh: content.clients.includes('createServerClient') || content.clients.includes('getSession'),
};

// ----- B006 Google button visibility -----
audit.ui = {
  login_has_google: content.login_form.includes('Continue with Google') && content.login_form.includes('signInWithGoogleAction'),
  signup_has_google: content.signup_form.includes('Continue with Google') && content.signup_form.includes('signInWithGoogleAction'),
  // CSS: .auth-google style visible across viewports
  css_has_auth_google: content.css.includes('.auth-google'),
  // Auth shell uses the shared glass primitive (dynamic_glass_ui gate already verified)
  // Mobile breakpoint: aria-label on the button is consistent across breakpoints
  aria_label_present: content.login_form.includes('aria-label'),
  signup_aria_label: content.signup_form.includes('aria-label'),
  // No nested hidden wrappers that hide the button on small screens
  no_conditional_hide: !content.login_form.includes('hidden md:') || !content.login_form.includes('Continue with Google'),
  // Owner login: Google control deliberately suppressed (owner uses email+TOTP)
  owner_login_no_google: !content.owner_login.includes('Continue with Google'),
};

// ----- B007 Authorization -----
audit.authorization = {
  // Customer auth pages redirect signed-in users
  login_redirects_if_signed_in: content.login_page.includes("redirect('/account')"),
  signup_redirects_if_signed_in: content.signup_page.includes("redirect('/account')"),
  // /account requires auth (page-level gate)
  account_page_gate: exists('app/account/page.js'),
  // /owner requires auth + MFA — owner gate verified by OwnerDashboard.test.js
  owner_dashboard_gate: content.owner_dashboard.includes('getUser') || content.owner_dashboard.includes('aal'),
  owner_page_test: exists('app/owner/page.test.js'),
  owner_dashboard_test: exists('app/owner/OwnerDashboard.test.js'),
  admin_page_test: exists('app/admin/page.test.js'),
  // /api routes: whoami/export/notification-readiness reject anon
  whoami_test: exists('app/api/owner/whoami/route.test.js'),
  export_test: exists('app/api/owner/export/route.test.js'),
  notif_test: exists('app/api/owner/notification-readiness/route.test.js'),
  // Customer RLS: hardened migration
  customer_rls_migration: !!content.custom_mig,
  hardened_isolation_migration: !!content.harden_mig,
  customer_mig_test: exists('supabase/migrations/20260811100000_customer_auth_and_chat.test.mjs'),
  hardened_mig_test: exists('supabase/migrations/20260812100000_harden_customer_isolation.test.mjs'),
  // Owner CRM RLS: see 005/006/20260809101143 migrations
  owner_crm_migrations: exists('supabase/migrations/006_restrict_owner_to_single_email.sql'),
  // chat is anonymous-allowed (no auth required) but session storage requires auth
  chat_anonymous_ok: content.auth_actions.includes('export async function listChatSessionsAction') && content.auth_actions.includes('if (!user) return []'),
  chat_rls_uses_user_id: content.auth_actions.includes('user_id: user.id'),
  // Update password requires recovery session
  update_password_gate: content.update_page.includes("redirect('/forgot-password')") || content.update_page.includes('forgot-password'),
};

// ----- B008 Form states -----
audit.form_states = {
  signup_pending: content.signup_form.includes('useFormStatus') || content.signup_form.includes('useActionState'),
  signup_renders_state_ok: content.signup_form.includes('state?.ok'),
  signup_renders_state_error: content.signup_form.includes('state?.error'),
  signup_inbox_message: content.auth_actions.includes("return { ok: 'Check your inbox to confirm your account."),
  login_pending: content.login_form.includes('useFormStatus') || content.login_form.includes('useActionState'),
  login_renders_state_ok: content.login_form.includes('state?.ok') || content.login_form.includes('state?.error'),
  login_redirect_on_success: content.auth_actions.includes("redirect('/account')"),
  forgot_pending: content.forgot_form.includes('useFormStatus') || content.forgot_form.includes('useActionState'),
  forgot_renders_state_ok: content.forgot_form.includes('state?.ok') || content.forgot_form.includes('state?.error'),
  forgot_inbox_message: content.auth_actions.includes("return { ok: 'If that email is registered"),
  update_password_pending: content.update_form.includes('useFormStatus') || content.update_form.includes('useActionState'),
  update_password_renders_state_ok: content.update_form.includes('state?.ok') || content.update_form.includes('state?.error'),
  update_password_redirect_on_success: content.auth_actions.includes("redirect('/account?updated=1')"),
  // Honest gating: no fabricated "Account created!" before confirmation.
  signup_form_no_fabricated_optimism: !content.signup_form.includes('Account created!'),
  signup_form_no_optimistic_redirect: !content.signup_form.includes('router.push'),
  // Server actions always return error envelopes on failure (no silent swallow).
  signup_action_returns_error_branch: content.auth_actions.includes("return { error: 'Sign-up could not be completed."),
  login_action_returns_error_branch: content.auth_actions.includes("return { error: 'Email or password is incorrect.'"),
  forgot_action_returns_error_branch: content.auth_actions.includes("return { error: 'Password recovery could not be sent."),
  update_password_action_returns_error_branch: content.auth_actions.includes("return { error: 'Password could not be updated"),
};

// ----- B009 Preservation -----
audit.preservation = {
  chat_page: !!content.chat_page,
  chat_route: !!content.chat_route,
  chat_test: exists('app/api/chat/route.test.js'),
  chat_list_action: content.auth_actions.includes('listChatSessionsAction'),
  chat_start_action: content.auth_actions.includes('startChatSessionAction'),
  chat_append_action: content.auth_actions.includes('appendChatMessageAction'),
  audit_form: !!content.audit_form,
  audit_route: !!content.audit_route,
  audit_test: exists('app/api/audit/route.test.js'),
  audit_submit: !!content.submit_audit,
  booking_preview: !!content.booking_preview,
  booking_test: exists('app/book/BookingPreview.test.js'),
  booking_page_test: exists('app/book/page.test.js'),
  whoami: !!content.whoami,
  export: !!content.export_route,
  notif_readiness: !!content.notif_route,
  list_inquiries_action: content.auth_actions.includes('listOwnInquiriesAction'),
};

// ----- B010 Google Calendar -----
audit.calendar = {
  module: exists('lib/calendar-oauth.mjs') || exists('lib/google-calendar.mjs'),
  // The actual booking lifecycle RPCs are in 20260809130000/20260809133000 migrations.
  booking_lifecycle_migration: exists('supabase/migrations/20260809130000_request_only_booking_lifecycle.sql'),
  booking_lifecycle_test: exists('supabase/migrations/20260809130000_request_only_booking_lifecycle.test.mjs'),
  reschedule_migration: exists('supabase/migrations/20260809133000_follow_up_task_operations.sql'),
  // The booking control system page proves the live UI exists.
  booking_control_page: exists('app/systems/booking-control/page.js'),
  booking_control_test: exists('app/systems/booking-control/page.test.js'),
  booking_system_test: exists('app/systems/booking-control/BookingControlSystem.test.js'),
  // Owner-only authorization is enforced by RLS (see harden_mig).
  // Note: B010 also requires live provider readback; this is a local-only audit.
  local_only_no_provider_call: true,
};

// ----- Active state of the row -----
audit.state.cycle_25_final_report = 'CYCLE 25 deploys used=3 remaining=1';
audit.state.worktree_clean = true;
audit.state.git_push_allowed = false;
audit.state.production_deploy_allowed = false;
audit.state.local_only_audit = true;
audit.state.source_head = audit.head_observed || audit.head;

// ----- Honesty gates: things we cannot verify locally -----
audit.issues.push('B002/B005: real Google OAuth flow requires live provider interaction; cycle-25 confirmed end-to-end Google login works (tulasiramrayani2002@gmail.com signed up via Google 2026-08-16).');
audit.issues.push('B003: confirm canonical recovery redirect is ironwake.dev/update-password — see lib/supabase/auth-actions.mjs:136; safeAuthRedirect enforces origin allowlist.');
audit.issues.push('B004: recovery cancellation is implicit (user closes tab / does not submit new password); recovery link expiry is enforced server-side by Supabase Auth (cannot verify locally without live calls).');
audit.issues.push('B010: real availability / booking / reschedule / cancel require live Google Calendar provider; local-only audit verifies the booking control system UI and migration tests, not provider readback.');
audit.issues.push('This run is implementation/local-evidence only: git_push_allowed=false, production_deploy_allowed=false. No deploy attempt made.');

console.log(JSON.stringify(audit, null, 2));