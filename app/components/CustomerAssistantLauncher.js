'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link.js';
import { createBrowserSupabase } from '../../lib/supabase/clients.mjs';

// ponytail: customer-only floating IronWake assistant.
// Mounted ONLY when an authenticated CUSTOMER session is detected.
// Anonymous visitors do NOT see any floating chatbot surface.
// Public Ask IronWake entry points are auth-gated (see /chat page CTA + footer).

const PROMPT_SUGGESTIONS = [
  'What does IronWake actually do?',
  'Which offer fits a service business with missed calls?',
  'How much does RapidPulse cost in India?',
  'How much does it cost internationally?',
  'What is the audit flow?',
  'Can I book a call now?'
];

function safeReply(result) {
  if (!result || typeof result !== 'object') return null;
  if (typeof result.reply !== 'string' || result.reply.length === 0) return null;
  return result;
}

function statusLabel(status) {
  if (status === 'complete') return null;
  if (status === 'unconfigured') return 'Assistant not configured for this deployment. The guided tools below stay available.';
  return 'Assistant is unavailable right now. Try again or use the guided tools below.';
}

// IronWake brand mark — a copper wake arc with a single node dot, sized for
// a circular launcher. Pure SVG, no emoji, no generic chatbot iconography.
function IronWakeMark({ size = 28 }) {
  return (
    <svg
      className="iw-launcher-mark"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="iw-launcher-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* copper wake arc — same visual language as the brand */}
      <path
        d="M 5 21 C 10 21, 13 14, 17 14 S 24 21, 28 21"
        fill="none"
        stroke="url(#iw-launcher-arc)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* single node dot — IronWake signature */}
      <circle cx="17" cy="14" r="2.4" fill="#ffffff" />
    </svg>
  );
}

export default function CustomerAssistantLauncher() {
  // Initial render must not show the launcher (avoids SSR flash, anonymous
  // bleed, or layout shift). The widget decides client-side whether to mount.
  const [auth, setAuth] = useState({ loaded: false, signedIn: false, userId: null, kind: null });
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [handoff, setHandoff] = useState(false);
  const [consent, setConsent] = useState(false);
  const [firstSeen, setFirstSeen] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);
  const launcherRef = useRef(null);

  useEffect(() => {
    const client = createBrowserSupabase();
    if (!client) { setAuth({ loaded: true, signedIn: false, userId: null, kind: null }); return; }
    let cancelled = false;
    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data?.session?.user;
      // owner sessions have a metadata flag set by the server action.
      const kind = user?.app_metadata?.ironwake_role
        || user?.user_metadata?.ironwake_role
        || (user ? 'customer' : null);
      setAuth({ loaded: true, signedIn: Boolean(user), userId: user?.id || null, kind });
    }).catch(() => { if (!cancelled) setAuth({ loaded: true, signedIn: false, userId: null, kind: null }); });
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      if (cancelled) return;
      const user = next?.user;
      const kind = user?.app_metadata?.ironwake_role
        || user?.user_metadata?.ironwake_role
        || (user ? 'customer' : null);
      setAuth({ loaded: true, signedIn: Boolean(user), userId: user?.id || null, kind });
    });
    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, []);

  // Defer the entrance animation until the widget has actually been mounted for
  // a tick — avoids first-paint flicker and honours progressive enhancement.
  useEffect(() => {
    if (!auth.loaded || !auth.signedIn || auth.kind !== 'customer' || firstSeen) return;
    const id = window.setTimeout(() => setFirstSeen(true), 240);
    return () => window.clearTimeout(id);
  }, [auth.loaded, auth.signedIn, auth.kind, firstSeen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

  useEffect(() => () => { if (abortRef.current) abortRef.current.abort(); }, []);

  // Close on Escape when panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed || pending) return;
    const next = [...messages, { role: 'user', content: trimmed }].slice(-20);
    setMessages(next);
    setInput('');
    setPending(true);
    setStatusMessage(null);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 429) {
        setStatusMessage('You are sending messages too quickly. Please wait a moment.');
      } else if (response.status >= 400) {
        setStatusMessage(statusLabel(data.status) || 'Assistant is unavailable. Try again shortly.');
      } else {
        const reply = safeReply(data);
        if (reply) {
          setMessages((m) => [...m, { role: 'assistant', content: reply.reply }]);
          if (reply.handoff) setHandoff(true);
          setStatusMessage(statusLabel(data.status));
        } else {
          setStatusMessage('Assistant returned an unexpected response.');
        }
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setStatusMessage('Could not reach the assistant. Check your connection and try again.');
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }, [messages, pending]);

  const handleSubmit = (event) => {
    event.preventDefault();
    send(input);
  };

  const handleConsent = () => {
    setConsent(true);
    setMessages((m) => [...m, { role: 'user', content: 'Please pass my conversation to a human. I consent to IronWake recording my contact details.' }]);
    send('I would like a human to follow up. I consent to IronWake recording my contact details and sharing them with the assigned human.');
  };

  // Gating: render nothing until we know auth state, and nothing for
  // anonymous OR owner visitors. Only authenticated customers see the widget.
  // The widget is also suppressed on the /chat full-page route, on the
  // owner dashboard, and on auth/account routes — those pages already
  // expose their own chat/session/auth surface.
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const suppressedRoutes = ['/chat', '/account', '/login', '/signup', '/forgot-password', '/update-password', '/owner', '/admin', '/auth'];
  const isSuppressed = suppressedRoutes.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const showLauncher = auth.loaded && auth.signedIn && auth.kind === 'customer' && !isSuppressed;

  if (!showLauncher) return null;

  return (
    <div
      className={`iw-assistant${open ? ' is-open' : ''}${firstSeen ? ' is-seen' : ''}`}
      ref={launcherRef}
    >
      {!open && (
        <button
          type="button"
          className="iw-launcher"
          onClick={() => setOpen(true)}
          aria-label="Open Ask IronWake"
          aria-expanded="false"
          aria-controls="iw-assistant-panel"
        >
          <IronWakeMark size={28} />
          <span className="sr-only">Ask IronWake</span>
        </button>
      )}
      {open && (
        <section
          id="iw-assistant-panel"
          className="iw-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Ask IronWake conversation"
        >
          <header className="iw-panel-header">
            <div className="iw-panel-id">
              <span className="iw-panel-mark" aria-hidden="true">
                <IronWakeMark size={20} />
              </span>
              <div>
                <h2>Ask IronWake</h2>
                <p className="iw-panel-subtitle">A real assistant grounded in the published IronWake knowledge.</p>
              </div>
            </div>
            <button
              type="button"
              className="iw-panel-close"
              onClick={() => setOpen(false)}
              aria-label="Close Ask IronWake"
            >
              ×
            </button>
          </header>
          <div className="iw-panel-log" ref={scrollRef} aria-live="polite">
            {messages.length === 0 && (
              <div className="iw-panel-empty">
                <p className="iw-panel-prompt-title">Try one of these:</p>
                <ul className="iw-panel-prompts">
                  {PROMPT_SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        className="iw-panel-prompt"
                        onClick={() => send(s)}
                        disabled={pending}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`iw-msg iw-msg-${m.role}`}>
                <span className="iw-msg-role">{m.role === 'user' ? 'You' : 'IronWake'}</span>
                <p>{m.content}</p>
              </div>
            ))}
            {pending && (
              <div className="iw-msg iw-msg-assistant">
                <span className="iw-msg-role">IronWake</span>
                <p className="iw-msg-pending">Thinking…</p>
              </div>
            )}
          </div>
          {statusMessage && <p className="iw-panel-status" role="status">{statusMessage}</p>}
          {handoff && !consent && (
            <div className="iw-panel-handoff">
              <label>
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                I consent to IronWake recording my contact details and passing my conversation to a human for follow-up.
              </label>
              <button type="button" className="iw-panel-handoff-btn" onClick={handleConsent} disabled={!consent || pending}>
                Hand off to a human
              </button>
            </div>
          )}
          <form className="iw-panel-form" onSubmit={handleSubmit}>
            <label htmlFor="iw-panel-input" className="sr-only">Ask IronWake a question</label>
            <input
              id="iw-panel-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask IronWake a question"
              maxLength={1000}
              autoComplete="off"
              disabled={pending}
            />
            <button type="submit" className="iw-panel-send" disabled={pending || !input.trim()}>
              Send
            </button>
          </form>
          <p className="iw-panel-foot">
            Conversations on this account are saved to <Link href="/account">My account</Link>. <Link href="/chat">Open full chat →</Link>
          </p>
        </section>
      )}
    </div>
  );
}