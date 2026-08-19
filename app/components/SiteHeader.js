'use client';

import { useEffect, useRef, useState } from 'react';
import { createBrowserSupabase } from '../../lib/supabase/clients.mjs';
import { SkeletonNavAuth } from './Skeleton.js';

// Owner-approved nav order. Customer auth controls live here. Once signed
// in, they become My account + Sign out. Owner nav stays out of public header.
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
  const client = createBrowserSupabase();
  if (client) client.auth.signOut().catch(() => {});
}

export function SiteHeader() {
  const [state, setState] = useState({ loaded: false, signedIn: false });
  const [mobileOpen, setMobileOpen] = useState(false);
  const detailsRef = useRef(null);

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

  // Mobile menu: Escape closes, click outside closes, route close on link tap.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') { setMobileOpen(false); detailsRef.current?.removeAttribute('open'); }
    }
    function onClick(e) {
      if (!detailsRef.current) return;
      if (!detailsRef.current.contains(e.target)) {
        setMobileOpen(false);
        detailsRef.current.removeAttribute('open');
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [mobileOpen]);

  const signedIn = state.loaded && state.signedIn;

  function closeMobile() {
    setMobileOpen(false);
    detailsRef.current?.removeAttribute('open');
  }

  function toggleMobile(e) {
    e.preventDefault();
    setMobileOpen((v) => {
      const next = !v;
      if (detailsRef.current) {
        if (next) detailsRef.current.setAttribute('open', '');
        else detailsRef.current.removeAttribute('open');
      }
      return next;
    });
  }

  return <header className="header">
    <a className="brand" href="/">IronWake<span aria-hidden="true">_</span><span className="sr-only">Home</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.slice(1).map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      {!state.loaded && <SkeletonNavAuth width={168} ariaLabel="Loading account controls" />}
      {state.loaded && !signedIn && <>
        <a className="nav-login nav-auth nav-auth--login" href="/login">Sign in</a>
        <a className="nav-signup nav-auth nav-auth--signup" href="/signup">Create account</a>
      </>}
      {state.loaded && signedIn && <>
        <a className="nav-login nav-auth nav-auth--login" href="/account">My account</a>
        <button type="button" className="nav-signout nav-auth nav-auth--signout" onClick={signOut}>Sign out</button>
      </>}
      <a className="nav-cta" href="/audit">Book Diagnostic</a>
    </nav>
    <details
      ref={detailsRef}
      className={`mobile-nav${mobileOpen ? ' mobile-nav--open' : ''}`}
      onToggle={(e) => setMobileOpen(e.currentTarget.open)}
    >
      <summary onClick={toggleMobile} aria-label="Open menu">Menu</summary>
      <nav aria-label="Mobile navigation" onClick={closeMobile}>
        {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        {!state.loaded && <SkeletonNavAuth width={120} ariaLabel="Loading account controls" />}
        {state.loaded && !signedIn && <>
          <a className="nav-login nav-auth nav-auth--login" href="/login">Sign in</a>
          <a className="nav-signup nav-auth nav-auth--signup" href="/signup">Create account</a>
        </>}
        {state.loaded && signedIn && <>
          <a className="nav-login nav-auth nav-auth--login" href="/account">My account</a>
          <button type="button" className="nav-signout nav-auth nav-auth--signout" onClick={signOut}>Sign out</button>
        </>}
        <a className="nav-cta" href="/audit">Book Diagnostic</a>
      </nav>
    </details>
  </header>;
}