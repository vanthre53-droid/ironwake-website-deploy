'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction, signInWithGoogleAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteHeader } from '../components/SiteHeader';
import Field from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { GoogleIcon } from '../components/ui/GoogleIcon.jsx';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" loading={pending} block className="auth-submit">
      {pending ? 'Signing in…' : 'Sign in'}
    </Button>
  );
}

function GoogleButton() {
  const [pending, setPending] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      loading={pending}
      block
      leadingIcon={<GoogleIcon />}
      className="button-google auth-google"
      onClick={async () => {
        setPending(true);
        const res = await signInWithGoogleAction('/account');
        setPending(false);
        if (res?.error) alert(res.error);
      }}
    >
      {pending ? 'Opening Google…' : 'Continue with Google'}
    </Button>
  );
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
          <Field
            id="login-email"
            name="email"
            type="email"
            label="Email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
            inputMode="email"
            className="auth-field"
          />
          <Field
            id="login-password"
            name="password"
            type={showPw ? 'text' : 'password'}
            label="Password"
            required
            maxLength={200}
            autoComplete="current-password"
            className="auth-field"
            suffix={
              <button
                type="button"
                className="iw-field__pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            }
          />
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
  </main>;
}
