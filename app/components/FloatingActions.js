'use client';

// ponytail: FloatingActions — single coordination layer for the chat, voice,
// and WhatsApp launchers. Replaces three independently-positioned FABs with one
// container so the icons never overlap, the bottom-right anchor stays predictable,
// and the mobile bottom edge becomes a compact bar with a single primary entry.
//
// Goals (v17 polish):
//   • Desktop: vertical column of launchers, consistent gap, shared anchor.
//   • Mobile:  compact bottom-sheet trigger that opens a chooser of all three.
//   • When one launcher is open (chat panel / WA overlay / voice drawer) the
//     others collapse so they do not pile up behind the open surface.
//   • Suppressed on the dedicated /chat, /voice, /account, /login, /signup,
//     /forgot-password, /update-password, /owner, /admin, /auth routes —
//     those pages expose their own chat/session/auth surface already.
//
// Each child still owns its own open/close state (so the existing
// CustomerAssistantLauncher / VoiceSessionLauncher / WhatsAppLauncher keep
// their full functionality). FloatingActions only positions them and listens
// for an open-state event broadcast on window.

import { useEffect, useRef, useState } from 'react';
import WhatsAppLauncher from './WhatsAppLauncher';
import CustomerAssistantLauncher from './CustomerAssistantLauncher';

const FAB_OPEN_EVENT = 'ironwake:fab:open';

const SUPPRESSED_PREFIXES = [
  '/chat',
  '/voice',
  '/account',
  '/login',
  '/signup',
  '/forgot-password',
  '/update-password',
  '/owner',
  '/admin',
  '/auth',
];

function isSuppressedPath(pathname) {
  if (!pathname) return false;
  return SUPPRESSED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export default function FloatingActions() {
  const [pathname, setPathname] = useState('');
  const [openId, setOpenId] = useState(null); // 'chat' | 'whatsapp' | 'voice' | null
  const [chooserOpen, setChooserOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const containerRef = useRef(null);

  // Detect pathname (client) so we can suppress on auth/admin/chat routes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setPathname(window.location.pathname || '');
    update();
    window.addEventListener('popstate', update);
    window.addEventListener('next-route-change', update);
    // Fallback: poll once a second for first paint so a client-side nav doesn't
    // leave us stale. Cheap, scoped to public routes.
    const tick = window.setInterval(update, 1000);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('next-route-change', update);
      window.clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onOpen = (event) => {
      const id = event?.detail?.id;
      if (!id) return;
      setOpenId(id);
      setChooserOpen(false);
    };
    const onClose = () => setOpenId(null);
    window.addEventListener(FAB_OPEN_EVENT, onOpen);
    window.addEventListener(`${FAB_OPEN_EVENT}:close`, onClose);
    return () => {
      window.removeEventListener(FAB_OPEN_EVENT, onOpen);
      window.removeEventListener(`${FAB_OPEN_EVENT}:close`, onClose);
    };
  }, []);

  useEffect(() => {
    // The chat widget decides client-side whether to render (anon visitors do
    // not see it). Give it a tick to mount before we mark the stack ready;
    // this prevents the "main" chooser button from flashing before chat loads.
    const id = window.setTimeout(() => setAuthReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const suppressed = isSuppressedPath(pathname);
  if (suppressed) return null;

  // Compute the desktop column: WhatsApp FAB always, Chat launcher mounts itself
  // internally (auth-gated). Voice is mounted only on /voice via the dedicated
  // page, not here — we keep this surface minimal so we don't duplicate it.
  const isMobileSheet = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches;

  return (
    <div
      ref={containerRef}
      className={`iw-fab-stack${openId ? ' iw-fab-stack--has-open' : ''}${chooserOpen ? ' iw-fab-stack--chooser-open' : ''}`}
      data-mobile-sheet={isMobileSheet ? 'true' : 'false'}
      aria-label="Site actions"
    >
      {chooserOpen && (
        <div className="iw-fab-chooser" role="menu" aria-label="Choose a channel">
          <div className="iw-fab-chooser__backdrop" onClick={() => setChooserOpen(false)} />
          <div className="iw-fab-chooser__panel" role="dialog" aria-modal="false">
            <button
              type="button"
              className="iw-fab-chooser__close"
              onClick={() => setChooserOpen(false)}
              aria-label="Close channel chooser"
            >
              ×
            </button>
            <p className="iw-fab-chooser__eyebrow">Get in touch</p>
            <h2 className="iw-fab-chooser__title">How would you like to talk?</h2>
            <p className="iw-fab-chooser__lede">
              Pick the channel that fits the moment. We&apos;ll route you into the
              same conversation wherever possible.
            </p>
            <ul className="iw-fab-chooser__list">
              <li>
                <a href="/chat" className="iw-fab-chooser__item">
                  <span className="iw-fab-chooser__item-icon" aria-hidden="true">💬</span>
                  <span className="iw-fab-chooser__item-body">
                    <span className="iw-fab-chooser__item-title">Open chat</span>
                    <span className="iw-fab-chooser__item-sub">Read every published page, ask anything.</span>
                  </span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="iw-fab-chooser__item"
                  onClick={() => window.dispatchEvent(new CustomEvent(FAB_OPEN_EVENT, { detail: { id: 'whatsapp' } }))}
                >
                  <span className="iw-fab-chooser__item-icon" aria-hidden="true">📱</span>
                  <span className="iw-fab-chooser__item-body">
                    <span className="iw-fab-chooser__item-title">WhatsApp</span>
                    <span className="iw-fab-chooser__item-sub">Send a message; we reply from our business line.</span>
                  </span>
                </button>
              </li>
              <li>
                <a href="/voice" className="iw-fab-chooser__item">
                  <span className="iw-fab-chooser__item-icon" aria-hidden="true">🎙️</span>
                  <span className="iw-fab-chooser__item-body">
                    <span className="iw-fab-chooser__item-title">Voice session</span>
                    <span className="iw-fab-chooser__item-sub">Talk to the live Retell AI agent (when enabled).</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="iw-fab-stack__anchor" aria-hidden={openId ? 'true' : 'false'}>
        <button
          type="button"
          className="iw-fab-stack__trigger"
          onClick={() => setChooserOpen((v) => !v)}
          aria-expanded={chooserOpen}
          aria-controls="iw-fab-chooser"
          aria-label="Choose how to talk to IronWake"
          title="Talk to IronWake"
        >
          <span className="iw-fab-stack__trigger-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22" focusable="false">
              <path
                d="M 5 21 C 10 21, 13 14, 17 14 S 24 21, 28 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="17" cy="14" r="2.4" fill="currentColor" />
            </svg>
          </span>
          <span className="iw-fab-stack__trigger-label">Talk to IronWake</span>
        </button>
      </div>

      <div className="iw-fab-stack__children" data-stack-hidden={openId ? 'true' : 'false'}>
        <div className="iw-fab-stack__child iw-fab-stack__child--whatsapp" data-fab="whatsapp">
          <WhatsAppLauncher />
        </div>
        <div className="iw-fab-stack__child iw-fab-stack__child--chat" data-fab="chat" hidden={!authReady}>
          <CustomerAssistantLauncher />
        </div>
      </div>
    </div>
  );
}

// ponytail: shared helpers — child launchers (and external mounts) can call
// announceOpen(id) so the stack can collapse siblings without needing a
// prop-drilling context layer.
export function announceOpen(id) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(FAB_OPEN_EVENT, { detail: { id } }));
}

export function announceClose() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(`${FAB_OPEN_EVENT}:close`));
}
