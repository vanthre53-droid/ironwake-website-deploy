'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction, signInWithGoogleAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}

function GoogleButton() {
  const [pending, setPending] = useState(false);
  return <button
    type="button"
    className="button button-google auth-google"
    disabled={pending}
    aria-busy={pending}
    onClick={async () => {
      setPending(true);
      const res = await signInWithGoogleAction('/account');
      setPending(false);
      if (res?.error) alert(res.error);
    }}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.63z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.96 10.71a5.41 5.41 0 0 1 0-3.43V4.95H.96a9 9 0 0 0 0 8.08l3-2.32z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 .96 4.95l3 2.32C4.67 5.16 6.65 3.58 9 3.58z"/>
    </svg>
    {pending ? 'Opening Google…' : 'Continue with Google'}
  </button>;
}

export function LoginForm() {
  const [state, action] = useActionState(signInAction, {});
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section">
      <div className={`auth-card${mounted ? ' is-entering' : ''}`} data-mounted={mounted}>
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to your IronWake account.</h1>
        <p className="auth-lede">Pick up a saved conversation, review past audits, or continue asking IronWake.</p>

        {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}

        <GoogleButton />

        <div className="auth-divider" role="separator" aria-label="or use email"><span>or use email</span></div>

        <form action={action} className="auth-form" noValidate>
          <label className="auth-field">
            <span>Email</span>
            <input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-row">
              <input type={showPw ? 'text' : 'password'} name="password" required maxLength={200} autoComplete="current-password" />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
          </label>
          <SubmitButton />
        </form>

        <p className="auth-switch">
          <a href="/forgot-password">Forgot password</a>
          {' · '}
          New here? <a href="/signup">Create account</a>
        </p>
        <p className="auth-aside-note">IronWake staff sign in at <a href="/owner/login">/owner/login</a>.</p>
      </div>
      <aside className="auth-aside">
        <span className="micro">Returning customer?</span>
        <ul>
          <li><strong>Continue a saved conversation.</strong> Your previous Ask IronWake threads are right where you left them.</li>
          <li><strong>Review past audits.</strong> Read what IronWake flagged last time and what changed since.</li>
          <li><strong>Stay in context.</strong> We do not make you re-explain your business on every visit.</li>
        </ul>
      </aside>
    </section>
    <SiteFooter />
  </main>;
}
