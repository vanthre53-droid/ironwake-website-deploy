'use client';

import { useEffect, useRef, useState } from 'react';
import { createBrowserSupabase } from '../../lib/supabase/clients.mjs';
import { SkeletonNavAuth } from './Skeleton.js';

// Owner-approved nav order. Customer auth controls live here. Once signed
// in, they become My account + Sign out. Owner nav stays out of public header.
const links = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/services', 'Services'],
  ['/systems/ai-receptionist', 'AI Systems'],
  ['/process', 'Process'],
  ['/pricing', 'Pricing'],
  ['/verification', 'Proof'],
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
  const rootRef = useRef(null);
  const detailsRef = useRef(null);
  const triggerRef = useRef(null);

  // ponytail: grant loyal-checked: source contract keeps <details className="mobile-nav">
  // literally, so the ref is resolved after mount via querySelector and the
  // native toggle event keeps state in sync.
  useEffect(() => {
    if (!rootRef.current) return;
    detailsRef.current = rootRef.current.querySelector('details.mobile-nav');
    const details = detailsRef.current;
    if (!details) return;
    function onToggle() { setMobileOpen(details.open); }
    details.addEventListener('toggle', onToggle);
    return () => details.removeEventListener('toggle', onToggle);
  }, []);

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

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        detailsRef.current?.removeAttribute('open');
        triggerRef.current?.focus();
      }
    }
    function onPointer(e) {
      if (!detailsRef.current) return;
      if (!detailsRef.current.contains(e.target)) {
        setMobileOpen(false);
        detailsRef.current.removeAttribute('open');
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer, { passive: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const signedIn = state.loaded && state.signedIn;

  function closeMobile() {
    setMobileOpen(false);
    detailsRef.current?.removeAttribute('open');
  }

  function toggleMobile(e) {
    if (e) e.preventDefault();
    const next = !mobileOpen;
    setMobileOpen(next);
    if (detailsRef.current) {
      if (next) detailsRef.current.setAttribute('open', '');
      else detailsRef.current.removeAttribute('open');
    }
  }

  return <header ref={rootRef} className="header">
    <a className="brand" href="/">IronWake<span aria-hidden="true">_</span><span className="sr-only">Home</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.slice(1).map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      <span className="header-actions">
        {!state.loaded && <SkeletonNavAuth width={168} ariaLabel="Loading account controls" />}
        {state.loaded && !signedIn && <>
          <a className="nav-login nav-auth nav-auth--login" href="/login">Sign in</a>
          <a className="nav-signup nav-auth nav-auth--signup" href="/signup">Create account</a>
        </>}
        {state.loaded && signedIn && <>
          <a className="nav-login nav-auth nav-auth--login" href="/account">My account</a>
          <button type="button" className="nav-signout nav-auth nav-auth--signout" onClick={signOut}>Sign out</button>
        </>}
      </span>
      <a className="nav-cta" href="/audit">Book Diagnostic</a>
    </nav>
    <details className="mobile-nav">
      <summary
        ref={triggerRef}
        onClick={toggleMobile}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav-panel"
      >
        <span className="mobile-nav__bars" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="mobile-nav__label">{mobileOpen ? 'Close' : 'Menu'}</span>
      </summary>
      <nav id="mobile-nav-panel" aria-label="Mobile navigation" onClick={closeMobile}>
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
