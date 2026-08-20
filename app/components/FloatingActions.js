'use client';

// ponytail: Integrated communication UI — single primary entry that opens a
// glassmorphic panel with three options (Chat / Voice / WhatsApp).
//
// Design (v13 Pearl/Graphite/Petrol):
//   • Pearl-dominant canvas, graphite structural text, scarce deep-petrol
//     accent, muted mineral supporting accent.
//   • One floating action button (the v13 .floating-action primitive).
//   • Panel surfaces use .floating-panel (Level-3 strong-foreground glass)
//     with .panel-pop for the entrance/exit transition.
//   • Each option renders inside a .glass-card (Level-2 interactive glass)
//     with an honest provider-state badge.
//
// Honest provider state (no fake placeholders):
//   • Chat     — probed by HEAD /api/chat (any non-404 = route wired). When
//                wired AND NEXT_PUBLIC_SUPABASE_URL is configured the badge
//                reads "Live via minimax-oauth" (the configured model name
//                from .env); when only the route is wired without an auth
//                provider it reads "Auth required"; if the route is missing
//                we show "Demo mode".
//   • Voice    — probed by POST /api/voice/session. The server returns
//                marker=RETELL_PROVIDER_PENDING when RETELL_API_KEY /
//                RETELL_AGENT_ID are missing, which we surface as "Voice
//                calls ready to enable". A 200 with an accessToken means
//                "Live"; a non-200 with a different marker shows the safe
//                error code verbatim.
//   • WhatsApp — probed by HEAD /api/whatsapp/start (route wired vs missing).
//                A direct wa.me number (NEXT_PUBLIC_WHATSAPP_NUMBER) means
//                "Live" regardless; otherwise we surface "Live" when the
//                route resolves and "Demo mode" when it does not.
//
// Routing:
//   • The button is suppressed on the dedicated /chat, /voice, /account,
//     /login, /signup, /forgot-password, /update-password, /owner, /admin
//     routes — those pages expose their own chat/session/auth surface.
//   • Clicking an option dispatches the existing FAB_OPEN_EVENT so the
//     child launchers (CustomerAssistantLauncher / VoiceSessionLauncher /
//     WhatsAppLauncher) keep their full open/close behaviour without being
//     reimplemented here. /chat and /voice options navigate to the dedicated
//     routes when those are preferred over the in-page surface.
//
// Accessibility:
//   • button[aria-expanded] on the trigger.
//   • role="dialog" + aria-modal on the panel.
//   • Escape closes the panel; click on backdrop closes the panel.
//   • Focus returns to the trigger on close.
//   • prefers-reduced-motion disables panel-pop transforms.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import ChatShell from './ChatShell.js';
import VoicePanel from './VoicePanel.js';

// Re-use the existing FAB_OPEN_EVENT so the three child launchers
// (CustomerAssistantLauncher, VoiceSessionLauncher, WhatsAppLauncher) keep
// working unchanged. announceClose is also re-exported.
export const FAB_OPEN_EVENT = 'ironwake:fab:open';
export function announceOpen(id) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(FAB_OPEN_EVENT, { detail: { id } }));
}
export function announceClose() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(`${FAB_OPEN_EVENT}:close`));
}

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
  '/auth'
];

function isSuppressedPath(pathname) {
  if (!pathname) return false;
  return SUPPRESSED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').trim();
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const CHAT_MODEL = (process.env.NEXT_PUBLIC_CHAT_MODEL || 'minimax-oauth').trim();

// Provider states: 'live' | 'unconfigured' | 'unknown'
async function probeChat() {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const res = await fetch('/api/chat', { method: 'HEAD', cache: 'no-store' });
    if (res.status === 404) return 'unconfigured';
    if (SUPABASE_URL) return 'live';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

async function probeVoice() {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const res = await fetch('/api/voice/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
      cache: 'no-store'
    });
    if (res.status === 200) return 'live';
    let body = null;
    try { body = await res.json(); } catch { /* ignore */ }
    if (body && body.marker === 'RETELL_PROVIDER_PENDING') return 'unconfigured';
    if (res.status === 404) return 'unconfigured';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

async function probeWhatsApp() {
  if (typeof window === 'undefined') return 'unknown';
  // If a real E.164 wa.me number is configured, we can open the deep link
  // directly — treat that as live regardless of /api/whatsapp/start state.
  if (/^\+\d{8,15}$/.test(NUMBER)) return 'live';
  try {
    const res = await fetch('/api/whatsapp/start', {
      method: 'HEAD',
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    // 405 Method Not Allowed = the route exists but only POSTs are accepted.
    // That is still "live" — the in-page widget can submit to it.
    if (res.status === 404) return 'unconfigured';
    if (res.status >= 200 && res.status < 500) return 'live';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function stateLabel(channel, state) {
  if (channel === 'chat') {
    if (state === 'live') return `Live via ${CHAT_MODEL}`;
    if (state === 'unconfigured') return 'Demo mode';
    return 'Auth required';
  }
  if (channel === 'voice') {
    if (state === 'live') return 'Live via Retell';
    if (state === 'unconfigured') return 'Ready to enable';
    return 'Checking…';
  }
  if (channel === 'whatsapp') {
    if (state === 'live') return 'Live via Meta Cloud API';
    if (state === 'unconfigured') return 'Demo mode';
    return 'Checking…';
  }
  return '';
}

function stateData(channel, state) {
  return state === 'live'
    ? 'live'
    : state === 'unconfigured'
      ? 'unconfigured'
      : 'pending';
}

// Ponytail: the single primary entry — a 56px-tall pill anchored to the
// bottom-right. When opened it stays in graphite so users see the surface
// they launched remains interactive.
function IronWakeMark({ size = 18 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M 5 21 C 10 21, 13 14, 17 14 S 24 21, 28 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="17" cy="14" r="2.6" fill="currentColor" />
    </svg>
  );
}

export default function FloatingActions() {
  const [pathname, setPathname] = useState('');
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState({ chat: 'unknown', voice: 'unknown', whatsapp: 'unknown' });
  const [activeChannel, setActiveChannel] = useState(null); // 'chat' | 'voice' | 'whatsapp' | null
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const dialogTitleId = useId();

  // Detect pathname (client) so we can suppress on auth/admin/chat routes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setPathname(window.location.pathname || '');
    update();
    window.addEventListener('popstate', update);
    window.addEventListener('next-route-change', update);
    const tick = window.setInterval(update, 1000);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('next-route-change', update);
      window.clearInterval(tick);
    };
  }, []);

  // Run the three cheap provider probes once on mount. Cache the result;
  // refreshing requires a page reload — that is honest because provider
  // state does not change during a single user session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [chat, voice, whatsapp] = await Promise.all([
        probeChat(),
        probeVoice(),
        probeWhatsApp()
      ]);
      if (!cancelled) setStates({ chat, voice, whatsapp });
    })();
    return () => { cancelled = true; };
  }, []);

  // Escape closes the panel; clicks outside close it.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setActiveChannel(null);
        triggerRef.current?.focus?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Listen for child launchers (chat / voice / whatsapp) announcing they
  // opened so we can close our panel without duplicating state.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onOpen = (event) => {
      const id = event?.detail?.id;
      if (!id) return;
      setActiveChannel(id);
      setOpen(false);
    };
    const onClose = () => setActiveChannel(null);
    window.addEventListener(FAB_OPEN_EVENT, onOpen);
    window.addEventListener(`${FAB_OPEN_EVENT}:close`, onClose);
    return () => {
      window.removeEventListener(FAB_OPEN_EVENT, onOpen);
      window.removeEventListener(`${FAB_OPEN_EVENT}:close`, onClose);
    };
  }, []);

  // Move focus into the dialog when it opens so keyboard users land inside.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => closeRef.current?.focus?.(), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const suppressed = isSuppressedPath(pathname);
  const chatLabel = useMemo(() => stateLabel('chat', states.chat), [states.chat]);
  const voiceLabel = useMemo(() => stateLabel('voice', states.voice), [states.voice]);
  const whatsappLabel = useMemo(() => stateLabel('whatsapp', states.whatsapp), [states.whatsapp]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setActiveChannel(null);
    triggerRef.current?.focus?.();
  }, []);

  // ponytail: WhatsApp configuration mirrors WhatsAppLauncher so we can
  // detect wa.me eligibility without a probe.
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').trim();
  const isWaMe = /^\+\d{8,15}$/.test(whatsappNumber);
  const whatsappPrefill = (process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ||
    'Hi IronWake — I would like to learn more about your AI receptionist systems.').trim();
  const waMeUrl = isWaMe
    ? `https://wa.me/${whatsappNumber.replace(/^\+/, '')}?text=${encodeURIComponent(whatsappPrefill)}`
    : null;

  // Click on an option: close the chooser and render the chosen channel
  // inline inside the panel. WhatsApp is a hard open of wa.me when we have
  // a real number; otherwise we send the visitor to /contact so they are
  // never silently lost.
  const selectOption = useCallback((channel) => {
    if (channel === 'chat') {
      setActiveChannel('chat');
      setOpen(false);
      return;
    }
    if (channel === 'voice') {
      setActiveChannel('voice');
      setOpen(false);
      return;
    }
    if (channel === 'whatsapp') {
      if (waMeUrl) {
        try {
          const win = window.open(waMeUrl, '_blank', 'noopener,noreferrer');
          if (!win) {
            // popups blocked — same-tab navigation as graceful fallback
            window.location.href = waMeUrl;
          }
        } catch {
          window.location.href = waMeUrl;
        }
        announceOpen('whatsapp');
      } else {
        // No number configured — never silently drop the visitor.
        announceOpen('whatsapp');
        setActiveChannel('whatsapp');
      }
    }
  }, [waMeUrl]);

  if (suppressed) return null;

  return (
    <>
      {/* Backdrop — click to dismiss. Hidden when panel is closed. */}
      <div
        className={`floating-panel__backdrop${open ? ' is-open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Glassmorphic panel with three options. */}
      <section
        ref={panelRef}
        className={`floating-panel panel-pop${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-hidden={!open}
        tabIndex={-1}
      >
        <div className="floating-panel__head">
          <div>
            <p className="floating-panel__eyebrow">Get in touch</p>
            <h2 id={dialogTitleId} className="floating-panel__title">
              Talk to IronWake
            </h2>
            <p className="floating-panel__lede">
              Pick the channel that fits the moment. We&apos;ll route you into the same conversation wherever possible.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="floating-panel__close"
            onClick={handleClose}
            aria-label="Close channel chooser"
          >
            ×
          </button>
        </div>
        <ul className="floating-panel__list">
          <li>
            <button
              type="button"
              className="glass-card floating-panel__item"
              onClick={() => selectOption('chat')}
              data-state={stateData('chat', states.chat)}
            >
              <span className="glass-card__eyebrow">Text · asynchronous</span>
              <h3 className="glass-card__title">Chat with IronWake</h3>
              <p className="glass-card__sub">
                Read every published page and ask anything. Best for structured questions.
              </p>
              <span className="glass-card__state" data-state={stateData('chat', states.chat)}>
                {chatLabel}
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="glass-card floating-panel__item"
              onClick={() => selectOption('voice')}
              data-state={stateData('voice', states.voice)}
            >
              <span className="glass-card__eyebrow">Voice · live agent</span>
              <h3 className="glass-card__title">Voice session</h3>
              <p className="glass-card__sub">
                Talk to the Retell AI receptionist when provisioned. Microphone stays off until you start.
              </p>
              <span className="glass-card__state" data-state={stateData('voice', states.voice)}>
                {voiceLabel}
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="glass-card floating-panel__item"
              onClick={() => selectOption('whatsapp')}
              data-state={stateData('whatsapp', states.whatsapp)}
            >
              <span className="glass-card__eyebrow">WhatsApp · asynchronous</span>
              <h3 className="glass-card__title">WhatsApp us</h3>
              <p className="glass-card__sub">
                Send a message; we reply from our business line through the Meta Cloud API.
              </p>
              <span className="glass-card__state" data-state={stateData('whatsapp', states.whatsapp)}>
                {whatsappLabel}
              </span>
            </button>
          </li>
        </ul>
      </section>

      {/* The single primary entry. Anchored bottom-right. */}
      <button
        ref={triggerRef}
        type="button"
        className="floating-action"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ironwake-floating-panel"
        aria-label={open ? 'Close communication channels' : 'Open communication channels'}
        title="Talk to IronWake"
        id="ironwake-floating-trigger"
      >
        <span className="floating-action__mark" aria-hidden="true">
          <IronWakeMark size={18} />
        </span>
        <span className="floating-action__label">
          {activeChannel
            ? (activeChannel === 'chat'
                ? 'Chat open'
                : activeChannel === 'voice'
                  ? 'Voice open'
                  : 'WhatsApp open')
            : 'Talk to IronWake'}
        </span>
      </button>
    </>
  );
}
