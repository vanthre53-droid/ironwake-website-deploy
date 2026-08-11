'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}

export function LoginForm() {
  const [state, action] = useActionState(signInAction, {});
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section">
      <div className="auth-card" data-mounted={mounted}>
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to your IronWake account.</h1>
        <p className="auth-lede">Pick up a saved conversation, review past audits, or continue asking IronWake.</p>

        {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}

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
