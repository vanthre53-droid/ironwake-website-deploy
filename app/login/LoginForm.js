'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction, signInWithGoogleAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteHeader } from '../components/SiteHeader';
import Field from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { GoogleIcon } from '../components/ui/GoogleIcon.jsx';

function EmailSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      loading={pending}
      block
      className="auth-submit"
      aria-label={pending ? 'Signing in, please wait' : 'Sign in with email'}
    >
      {pending ? 'Signing in…' : 'Sign in with email'}
    </Button>
  );
}

function GoogleButton({ onError }) {
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  return (
    <Button
      type="button"
      variant="primary"
      loading={pending}
      disabled={unavailable}
      block
      leadingIcon={<GoogleIcon />}
      className="button-google auth-google"
      aria-label="Continue with Google — single sign-on"
      onClick={async () => {
        setPending(true);
        const res = await signInWithGoogleAction('/account');
        setPending(false);
        if (res?.error) {
          setUnavailable(true);
          onError?.(res.error);
        }
      }}
    >
      {pending ? 'Opening Google…' : 'Continue with Google'}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(signInAction, {});
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleError, setGoogleError] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const emailLooksValid = mounted ? /.+@.+\..+/.test(email.trim()) : true;
  const passwordLooksValid = mounted ? password.length >= 1 : true;
  const formReady = mounted ? (emailLooksValid && passwordLooksValid) : true;
  const emailError = mounted && email.length > 0 && !emailLooksValid ? 'Enter a valid email address.' : null;
  const passwordError = mounted && password.length > 0 && !passwordLooksValid ? 'Enter your password.' : null;

  // The form status (server action result) and any Google error both
  // announce into the same live region so screen readers hear only the
  // most recent message, in the right priority.
  const liveMessage = state?.error || googleError;
  const liveTone = state?.error || googleError ? 'error' : null;

  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section" aria-labelledby="login-card-title">
      <div className={`auth-card${mounted ? ' is-entering' : ''}`} data-mounted={mounted}>
        <span className="eyebrow">Welcome back</span>
        <h1 id="login-card-title">Sign in to your IronWake account.</h1>
        <p className="auth-lede">Pick up a saved conversation, review past audits, or continue asking IronWake.</p>

        {/*
          aria-live="polite" + role="status" so screen readers announce the
          status without stealing focus. role="alert" on error tone makes
          the announcement assertive but only when there's actually a
          message (empty region would otherwise be announced as "alert").
        */}
        <div
          className={`auth-status${liveTone === 'error' ? ' auth-status-error' : ''}`}
          role={liveTone ? 'alert' : 'status'}
          aria-live={liveTone ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {liveMessage || ''}
        </div>

        <fieldset className="auth-methods">
          <legend className="iw-visually-hidden">Sign-in method</legend>
          <GoogleButton onError={setGoogleError} />

          <div className="auth-divider" role="separator" aria-label="or use email"><span>or use email</span></div>

          <form
            action={action}
            className="auth-form"
            noValidate
            aria-label="Sign in with email and password"
            aria-describedby="login-form-help"
          >
            <p id="login-form-help" className="iw-visually-hidden">
              Enter the email and password tied to your IronWake customer account.
            </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              className="auth-field"
              suffix={
                <button
                  type="button"
                  className="iw-field__pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  aria-pressed={showPw}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              }
            />
            <noscript>
              <p className="iw-field__help">JavaScript is disabled — the email form will submit without inline validation.</p>
            </noscript>
            <EmailSubmitButton disabled={!formReady} />
          </form>
        </fieldset>

        <p className="auth-switch">
          <a href="/forgot-password">Forgot password</a>
          {' · '}
          New here? <a href="/signup">Create account</a>
        </p>
        <p className="auth-aside-note">IronWake staff sign in at <a href="/owner/login">/owner/login</a>.</p>
      </div>
      <aside className="auth-aside" aria-labelledby="login-aside-title">
        <span className="micro">Returning customer?</span>
        <h2 id="login-aside-title" className="auth-aside-title">Pick up where you left off.</h2>
        <ul>
          <li><strong>Continue a saved conversation.</strong> Your previous Ask IronWake threads are right where you left them.</li>
          <li><strong>Review past audits.</strong> Read what IronWake flagged last time and what changed since.</li>
          <li><strong>Stay in context.</strong> We do not make you re-explain your business on every visit.</li>
        </ul>
      </aside>
    </section>
  </main>;
}
