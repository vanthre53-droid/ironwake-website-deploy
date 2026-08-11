'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { forgotPasswordAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button auth-submit" disabled={pending} aria-busy={pending}>{pending ? 'Sending link…' : 'Send recovery link'}</button>;
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, {});
  return <main className="shell auth-shell">
    <SiteHeader />
    <section className="auth-section auth-narrow">
      <div className="auth-card">
        <span className="eyebrow">Account recovery</span>
        <h1>Reset your password.</h1>
        <p className="auth-lede">Enter the email tied to your IronWake account. We will send a one-time link that lets you set a new password.</p>
        {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}
        {state?.ok && <p className="auth-status auth-status-ok" role="status">{state.ok}</p>}
        <form action={action} className="auth-form" noValidate>
          <label className="auth-field">
            <span>Email</span>
            <input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" />
          </label>
          <SubmitButton />
        </form>
        <p className="auth-switch"><a href="/login">Back to sign in</a></p>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
