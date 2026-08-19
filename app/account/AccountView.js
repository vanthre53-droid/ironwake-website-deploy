'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link.js';
import { signOutAction, updateProfileAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteHeader } from '../components/SiteHeader';
import Field from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';

function SaveButton({ disabled }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      loading={pending}
      disabled={disabled || pending}
      block
      className="auth-submit"
      aria-label={pending ? 'Saving profile, please wait' : 'Save profile changes'}
    >
      {pending ? 'Saving…' : 'Save profile'}
    </Button>
  );
}

function SignOutButton() {
  return (
    <Button
      type="submit"
      variant="secondary"
      formAction={signOutAction}
      className="auth-submit"
      aria-label="Sign out of your IronWake account"
    >
      Sign out
    </Button>
  );
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function ProfileForm({ initialDisplayName }) {
  const [state, action] = useActionState(updateProfileAction, {});
  const [name, setName] = useState(initialDisplayName || '');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const nameValid = mounted ? name.trim().length >= 2 : true;
  const nameError = mounted && name.length > 0 && !nameValid ? 'Enter at least 2 characters.' : null;
  const dirty = name !== (initialDisplayName || '');
  const ready = dirty && nameValid;
  return <form
    action={action}
    className="auth-form"
    aria-label="Update display name"
    aria-describedby="account-profile-help"
  >
    <p id="account-profile-help" className="iw-visually-hidden">
      The Save button enables when you change the display name and the value is at least 2 characters.
    </p>
    <Field
      id="account-display-name"
      name="display_name"
      label="Display name"
      required
      maxLength={80}
      autoComplete="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={nameError}
      help="This is the name we use to greet you on the website and in your account."
      className="auth-field"
    />
    <div
      className={`auth-status${state?.error ? ' auth-status-error' : state?.ok ? ' auth-status-ok' : ''}`}
      role={state?.error ? 'alert' : 'status'}
      aria-live={state?.error ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {state?.error || state?.ok || ''}
    </div>
    <SaveButton disabled={!ready} />
  </form>;
}

export function AccountView({ user, profile, sessions, inquiries, updated, configError }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // The page.js already redirects to /login when no user is returned and
  // when the config is broken. This branch only renders if configError is
  // set (the supabase env vars are missing) — we show a clear "not
  // connected" state and absolutely no fake data.
  if (configError) {
    return <main className="shell" id="main">
      <SiteHeader />
      <section className="hero compact" aria-labelledby="account-error-title">
        <span className="eyebrow">My account</span>
        <h1 id="account-error-title">Account is unavailable right now.</h1>
        <p>IronWake's authentication service is not connected. Please try again in a few minutes, or contact support if the issue persists.</p>
        <p
          className="auth-status auth-status-error"
          role="alert"
          aria-live="assertive"
        >
          {configError}
        </p>
        <div className="account-actions">
          <Button as="a" href="/login" variant="primary">Back to sign in</Button>
        </div>
      </section>
    </main>;
  }

  return <main className="shell" id="main">
    <SiteHeader />
    <section className="hero compact" aria-labelledby="account-greeting-title">
      <span className="eyebrow">My account</span>
      <h1 id="account-greeting-title">Welcome back{profile?.display_name ? `, ${profile.display_name}` : user?.email ? `, ${user.email}` : ''}.</h1>
      <p>Manage your conversations, audit history, profile, and security.</p>
      <div
        className="auth-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {updated ? 'Your password has been updated.' : ''}
      </div>
    </section>

    <section className={`section account-grid${mounted ? ' is-entering' : ''}`} aria-label="Account sections">
      <article className="account-card" aria-labelledby="account-overview-title">
        <span className="micro">Overview</span>
        <h2 id="account-overview-title">Account</h2>
        <dl className="account-meta">
          <div><dt>Email</dt><dd>{user?.email || '—'}</dd></div>
          <div><dt>Joined</dt><dd>{formatDate(user?.created_at)}</dd></div>
          <div><dt>Last sign-in</dt><dd>{formatDate(user?.last_sign_in_at)}</dd></div>
        </dl>
        <div className="account-actions">
          <SignOutButton />
        </div>
      </article>

      <article className="account-card" aria-labelledby="account-conversations-title">
        <span className="micro">Conversations</span>
        <h2 id="account-conversations-title">Ask IronWake history</h2>
        {(!sessions || sessions.length === 0) ? (
          <div className="account-empty">
            <p>No conversations yet.</p>
            <Button as="a" href="/chat" variant="primary" block aria-label="Start a new Ask IronWake conversation">Start a conversation</Button>
          </div>
        ) : (
          <ul className="account-list">
            {sessions.map((s) => <li key={s.id}>
              <Link href={`/chat?session=${s.id}`}>
                <strong>{s.title || 'Conversation'}</strong>
                <span className="micro">{formatDate(s.updated_at)}</span>
              </Link>
            </li>)}
          </ul>
        )}
        <div className="account-actions"><Link className="text-link" href="/chat">Open Ask IronWake →</Link></div>
      </article>

      <article className="account-card" aria-labelledby="account-requests-title">
        <span className="micro">My requests</span>
        <h2 id="account-requests-title">Audit & booking history</h2>
        {(!inquiries || inquiries.length === 0) ? (
          <div className="account-empty">
            <p>No audit or booking requests linked to your account yet.</p>
            <Button as="a" href="/audit" variant="secondary" block>Request a Business Leak Audit</Button>
          </div>
        ) : (
          <ul className="account-list">
            {inquiries.map((i) => <li key={i.id}>
              <strong>{i.business_name || 'Untitled request'}</strong>
              <span className="micro">{formatDate(i.created_at)} · {i.source || 'website'} · {i.lead_stage || i.status || 'new'}</span>
            </li>)}
          </ul>
        )}
      </article>

      <article className="account-card" aria-labelledby="account-profile-title">
        <span className="micro">Profile</span>
        <h2 id="account-profile-title">Display name</h2>
        <ProfileForm initialDisplayName={profile?.display_name || ''} />
      </article>

      <article className="account-card" aria-labelledby="account-security-title">
        <span className="micro">Security</span>
        <h2 id="account-security-title">Password</h2>
        <p>Your password is managed by Supabase Auth. Reset it any time — we never see the value.</p>
        <div className="account-actions">
          <Button as="a" href="/forgot-password" variant="secondary" aria-label="Reset your IronWake account password">Reset password</Button>
        </div>
      </article>
    </section>

  </main>;
}
