'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '../../lib/supabase/clients.mjs';
import { SkeletonNavAuth } from './Skeleton.js';

// ponytail: owner-approved nav order — no architecture change, just link labels/paths.
// ponytail: customer auth controls (Sign in / Create account) live here in the
// anonymous state. Once a customer signs in, those are replaced with My account
// and Sign out. Owner navigation stays out of the public header.
// ponytail: during auth hydration the nav-auth slot shows a stable-width
// skeleton pill so the header does NOT flash between anonymous controls and
// customer controls while getSession() is resolving.
const links = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/systems', 'Services'],
  ['/systems/ai-receptionist', 'AI Systems'],
  ['/process', 'Process'],
  ['/pricing', 'Pricing'],
  ['/insights', 'Insights'],
  ['/about', 'About']
];

function signOut() {
  // ponytail: best-effort client-side sign out so the header can flip immediately.
  // The server-side cookies are cleared by the signOutAction invoked from /account.
  const client = createBrowserSupabase();
  if (client) client.auth.signOut().catch(() => {});
}

export function SiteHeader() {
  const [state, setState] = useState({ loaded: false, signedIn: false });

  useEffect(() => {
    const client = createBrowserSupabase();
    if (!client) { setState({ loaded: true, signedIn: false }); return; }
    let cancelled = false;
    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setState({ loaded: true, signedIn: Boolean(data?.session?.user) });
    }).catch(() => { if (!cancelled) setState({ loaded: true, signedIn: false }); });
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      if (cancelled) return;
      setState({ loaded: true, signedIn: Boolean(next?.user) });
    });
    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, []);

  const signedIn = state.loaded && state.signedIn;

  return <header className="header">
    <a className="brand" href="/">IronWake<span>_</span><span className="sr-only">Home</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.slice(1).map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      {!state.loaded && <SkeletonNavAuth width={168} ariaLabel="Loading account controls" />}
      {state.loaded && !signedIn && <>
        <a className="nav-login" href="/login">Sign in</a>
        <a className="nav-signup" href="/signup">Create account</a>
      </>}
      {state.loaded && signedIn && <>
        <a className="nav-login" href="/account">My account</a>
        <button type="button" className="nav-signout" onClick={signOut}>Sign out</button>
      </>}
      <a className="nav-cta" href="/audit">Book Diagnostic</a>
    </nav>
    <details className="mobile-nav">
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        {!state.loaded && <SkeletonNavAuth width={120} ariaLabel="Loading account controls" />}
        {state.loaded && !signedIn && <>
          <a className="nav-login" href="/login">Sign in</a>
          <a className="nav-signup" href="/signup">Create account</a>
        </>}
        {state.loaded && signedIn && <>
          <a className="nav-login" href="/account">My account</a>
          <button type="button" className="nav-signout" onClick={signOut}>Sign out</button>
        </>}
        <a className="nav-cta" href="/audit">Book Diagnostic</a>
      </nav>
    </details>
  </header>;
}
