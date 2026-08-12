'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Creating account…' : 'Create account'}</button>;
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
