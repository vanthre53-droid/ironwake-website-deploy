'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link.js';
import { signOutAction, updateProfileAction } from '../../lib/supabase/auth-actions.mjs';
import { SiteHeader } from '../components/SiteHeader';

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="button" disabled={pending} aria-busy={pending}>{pending ? 'Saving…' : 'Save profile'}</button>;
}

function SignOutButton() {
  return <button type="submit" className="button secondary" formAction={signOutAction}>Sign out</button>;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function ProfileForm({ initialDisplayName }) {
  const [state, action] = useActionState(updateProfileAction, {});
  return <form action={action} className="auth-form">
    <label className="auth-field">
      <span>Display name</span>
      <input type="text" name="display_name" required maxLength={80} defaultValue={initialDisplayName || ''} />
    </label>
    {state?.error && <p className="auth-status auth-status-error" role="alert">{state.error}</p>}
    {state?.ok && <p className="auth-status auth-status-ok" role="status">{state.ok}</p>}
    <SaveButton />
  </form>;
}

export function AccountView({ user, profile, sessions, inquiries, updated, configError }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">My account</span>
      <h1>Welcome back{profile?.display_name ? `, ${profile.display_name}` : user?.email ? `, ${user.email}` : ''}.</h1>
      <p>Manage your conversations, audit history, profile, and security.</p>
      {updated && <p className="auth-status auth-status-ok" role="status">Your password has been updated.</p>}
      {configError && <p className="auth-status auth-status-error" role="alert">{configError}</p>}
    </section>

    <section className={`section account-grid${mounted ? ' is-entering' : ''}`}>
      <article className="account-card">
        <span className="micro">Overview</span>
        <h2>Account</h2>
        <dl className="account-meta">
          <div><dt>Email</dt><dd>{user?.email || '—'}</dd></div>
          <div><dt>Joined</dt><dd>{formatDate(user?.created_at)}</dd></div>
          <div><dt>Last sign-in</dt><dd>{formatDate(user?.last_sign_in_at)}</dd></div>
        </dl>
        <div className="account-actions">
          <SignOutButton />
        </div>
      </article>

      <article className="account-card">
        <span className="micro">Conversations</span>
        <h2>Ask IronWake history</h2>
        {(!sessions || sessions.length === 0) ? (
          <div className="account-empty">
            <p>No conversations yet.</p>
            <Link className="button" href="/chat">Start a conversation</Link>
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

      <article className="account-card">
        <span className="micro">My requests</span>
        <h2>Audit & booking history</h2>
        {(!inquiries || inquiries.length === 0) ? (
          <div className="account-empty">
            <p>No audit or booking requests linked to your account yet.</p>
            <Link className="button secondary" href="/audit">Request a Business Leak Audit</Link>
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

      <article className="account-card">
        <span className="micro">Profile</span>
        <h2>Display name</h2>
        <p>This is the name we use to greet you on the website and in your account.</p>
        <ProfileForm initialDisplayName={profile?.display_name || ''} />
      </article>

      <article className="account-card">
        <span className="micro">Security</span>
        <h2>Password</h2>
        <p>Your password is managed by Supabase Auth. Reset it any time — we never see the value.</p>
        <div className="account-actions">
          <Link className="button secondary" href="/forgot-password">Reset password</Link>
        </div>
      </article>
    </section>

  </main>;
}
