'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpAction, signInWithGoogleAction } from '../../lib/supabase/auth-actions.mjs';
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
      aria-label={pending ? 'Creating your account, please wait' : 'Create account with email'}
    >
      {pending ? 'Creating account…' : 'Create account with email'}
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

export function SignupForm() {
  const [state, action] = useActionState(signUpAction, {});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pwStrength = mounted ? (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'strong' : password.length >= 8 ? 'ok' : 'weak') : 'idle';
  const match = mounted ? (confirm.length > 0 && password === confirm ? 'match' : confirm.length > 0 ? 'mismatch' : 'idle') : 'idle';
  const emailValid = mounted ? /.+@.+\..+/.test(email.trim()) : true;

  const pwMessage = pwStrength === 'idle' ? '' : pwStrength === 'weak' ? 'Use at least 8 characters.' : pwStrength === 'ok' ? 'OK — consider mixing case and digits.' : 'Strong.';
  const matchMessage = match === 'idle' ? '' : match === 'mismatch' ? 'Passwords do not match.' : 'Passwords match.';
  const nameError = mounted && displayName.length > 0 && displayName.trim().length < 2 ? 'Enter at least 2 characters.' : null;
  const emailError = mounted && email.length > 0 && !emailValid ? 'Enter a valid email address.' : null;
  const formReady = mounted ? (
    displayName.trim().length >= 2 &&
    emailValid &&
    password.length >= 8 &&
    password === confirm &&
    terms
  ) : true;

  // Server action and Google errors share one live region; success
  // (state.ok) goes into a separate "status" tone so it's read politely.
  const errorMessage = state?.error || googleError;

  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section" aria-labelledby="signup-card-title">
      <div className={`auth-card${mounted ? ' is-entering' : ''}`} data-mounted={mounted}>
        <span className="eyebrow">Create account</span>
        <h1 id="signup-card-title">Create your IronWake account.</h1>
        <p className="auth-lede">Save your Ask IronWake conversations, track your audit and request history, and pick up where you left off without re-explaining your project.</p>

        <div
          className={`auth-status${errorMessage ? ' auth-status-error' : state?.ok ? ' auth-status-ok' : ''}`}
          role={errorMessage ? 'alert' : state?.ok ? 'status' : 'status'}
          aria-live={errorMessage ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {errorMessage || state?.ok || ''}
        </div>

        <fieldset className="auth-methods">
          <legend className="iw-visually-hidden">Sign-up method</legend>
          <GoogleButton onError={setGoogleError} />

          <div className="auth-divider" role="separator" aria-label="or use email to sign up"><span>or sign up with email</span></div>

          <form
            action={action}
            className="auth-form"
            noValidate
            aria-label="Create account with email and password"
            aria-describedby="signup-form-help"
          >
            <p id="signup-form-help" className="iw-visually-hidden">
              Create an IronWake customer account. Display name, email, and password are all required. You must agree to the privacy and terms.
            </p>
            <Field
              id="signup-display-name"
              name="display_name"
              label="Display name"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={nameError}
              className="auth-field"
            />
            <Field
              id="signup-email"
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
              id="signup-password"
              name="password"
              type={showPw ? 'text' : 'password'}
              label="Password"
              required
              minLength={8}
              maxLength={200}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              help={pwMessage}
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
            <Field
              id="signup-confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              label="Confirm password"
              required
              minLength={8}
              maxLength={200}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              help={matchMessage}
              error={match === 'mismatch' ? 'Passwords do not match.' : null}
              className="auth-field"
              suffix={
                <button
                  type="button"
                  className="iw-field__pw-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              }
            />
            <label className="auth-terms">
              <input
                type="checkbox"
                name="terms"
                value="yes"
                required
                aria-required="true"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <span>I agree to the <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.</span>
            </label>
            <noscript>
              <p className="iw-field__help">JavaScript is disabled — the form will submit without inline validation.</p>
            </noscript>
            <EmailSubmitButton disabled={!formReady} />
          </form>
        </fieldset>

        <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
      </div>
      <aside className="auth-aside" aria-labelledby="signup-aside-title">
        <span className="micro">Why create an account?</span>
        <h2 id="signup-aside-title" className="auth-aside-title">Save your work, pick up where you left off.</h2>
        <ul>
          <li><strong>Save conversations.</strong> Continue any Ask IronWake thread later, with full context.</li>
          <li><strong>Track your history.</strong> See past audits and requests without searching email.</li>
          <li><strong>Keep your project context.</strong> Your display name carries across every conversation.</li>
        </ul>
        <p className="auth-aside-note">IronWake accounts are for customers. They never grant access to the private owner dashboard.</p>
      </aside>
    </section>
  </main>;
}
