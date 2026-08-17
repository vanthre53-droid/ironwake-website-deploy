'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpAction, signInWithGoogleAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Creating account…' : 'Create account'}</button>;
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

export function SignupForm() {
  const [state, action] = useActionState(signUpAction, {});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pwStrength = mounted ? (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'strong' : password.length >= 8 ? 'ok' : 'weak') : 'idle';
  const match = mounted ? (confirm.length > 0 && password === confirm ? 'match' : confirm.length > 0 ? 'mismatch' : 'idle') : 'idle';

  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section">
      <div className={`auth-card${mounted ? ' is-entering' : ''}`} data-mounted={mounted}>
        <span className="eyebrow">Create account</span>
        <h1>Create your IronWake account.</h1>
        <p className="auth-lede">Save your Ask IronWake conversations, track your audit and request history, and pick up where you left off without re-explaining your project.</p>

        {state?.ok && <p className="auth-status auth-status-ok" role="status">{state.ok}</p>}
        {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}

        <GoogleButton />

        <div className="auth-divider" role="separator" aria-label="or use email to sign up"><span>or sign up with email</span></div>

        <form action={action} className="auth-form" noValidate>
          <label className="auth-field">
            <span>Display name</span>
            <input type="text" name="display_name" required maxLength={80} autoComplete="name" placeholder="Your name" />
          </label>
          <label className="auth-field">
            <span>Email</span>
            <input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-row">
              <input type={showPw ? 'text' : 'password'} name="password" required minLength={8} maxLength={200} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="pw-strength" />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
            <small id="pw-strength" data-strength={pwStrength} className="auth-strength">
              {pwStrength === 'idle' ? ' ' : pwStrength === 'weak' ? 'Use at least 8 characters.' : pwStrength === 'ok' ? 'OK — consider mixing case and digits.' : 'Strong.'}
            </small>
          </label>
          <label className="auth-field">
            <span>Confirm password</span>
            <div className="auth-input-row">
              <input type={showConfirm ? 'text' : 'password'} name="confirm" required minLength={8} maxLength={200} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-describedby="pw-match" />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}>{showConfirm ? 'Hide' : 'Show'}</button>
            </div>
            <small id="pw-match" data-match={match} className="auth-strength">
              {match === 'idle' ? ' ' : match === 'mismatch' ? 'Passwords do not match.' : 'Passwords match.'}
            </small>
          </label>
          <label className="auth-terms">
            <input type="checkbox" name="terms" value="yes" required />
            <span>I agree to the <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.</span>
          </label>
          <SubmitButton />
        </form>

        <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
      </div>
      <aside className="auth-aside">
        <span className="micro">Why create an account?</span>
        <h3>Save your work, pick up where you left off.</h3>
        <ul>
          <li><strong>Save conversations.</strong> Continue any Ask IronWake thread later, with full context.</li>
          <li><strong>Track your history.</strong> See past audits and requests without searching email.</li>
          <li><strong>Keep your project context.</strong> Your display name carries across every conversation.</li>
        </ul>
        <p className="auth-aside-note">IronWake accounts are for customers. They never grant access to the private owner dashboard.</p>
      </aside>
    </section>
    <SiteFooter />
  </main>;
}
