'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePasswordAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Updating…' : 'Update password'}</button>;
}

export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, {});
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const match = confirm.length > 0 && password === confirm ? 'match' : confirm.length > 0 ? 'mismatch' : 'idle';
  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section auth-narrow">
      <div className="auth-card">
        <span className="eyebrow">Set new password</span>
        <h1>Set a new password.</h1>
        <p className="auth-lede">Choose a password with at least 8 characters. You will remain signed in and taken to your account.</p>
        {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}
        <form action={action} className="auth-form" noValidate>
          <label className="auth-field">
            <span>New password</span>
            <div className="auth-input-row">
              <input type={showPw ? 'text' : 'password'} name="password" required minLength={8} maxLength={200} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
          </label>
          <label className="auth-field">
            <span>Confirm new password</span>
            <div className="auth-input-row">
              <input type={showConfirm ? 'text' : 'password'} name="confirm" required minLength={8} maxLength={200} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-describedby="pw-match-update" />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}>{showConfirm ? 'Hide' : 'Show'}</button>
            </div>
            <small id="pw-match-update" data-match={match} className="auth-strength">{match === 'idle' ? ' ' : match === 'mismatch' ? 'Passwords do not match.' : 'Passwords match.'}</small>
          </label>
          <SubmitButton />
        </form>
      </div>
    </section>
  </main>;
}
