'use client';

// ponytail: ChatShell — wraps POST /api/chat in a v13 glass--strong panel.
//
// Honest provider state (probed once on mount, then refreshed per reply):
//   • 'live'         — POST returns 200 with status='complete'. Label:
//                     "Live via minimax-oauth" (or NEXT_PUBLIC_CHAT_MODEL).
//   • 'unconfigured' — route returns 503 / status='unconfigured'. Label:
//                     "Demo mode". Server's safe reply is rendered verbatim.
//   • 'auth-required'— route is wired but NEXT_PUBLIC_SUPABASE_URL is empty.
//   • 'unknown'      — could not reach the route. Label: "Offline".
//
// Accessibility: role="log" on transcript; aria-label on textarea; Enter
// sends, Shift+Enter inserts a newline; reduced-motion respected via the
// global media query (no JS animation).

import { useCallback, useEffect, useRef, useState } from 'react';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const CHAT_MODEL = (process.env.NEXT_PUBLIC_CHAT_MODEL || '').trim();
const SUGGESTED = [
  'How does IronWake actually answer?',
  'What does it cost to switch on?',
  'Where is the data hosted?'
];

const INTRO = "Hi — I'm the IronWake assistant. Ask me anything about how we build and operate the system; I'll answer from what we've actually shipped.";

const FALLBACKS = {
  unconfigured: "The chat provider isn't wired yet. Set AI_MODEL and AI_API_BASE in the environment to enable live answers.",
  offline: "I couldn't reach the chat provider. Check your connection and retry.",
  generic: "I hit an error reaching the chat provider. Try again in a moment.",
  out_of_scope: "That falls outside what I can answer from our published pages."
};

export default function ChatShell({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: INTRO }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ kind: 'unknown', label: 'Checking…' });
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);

  // ponytail: honest provider probe — POST a single benign "ping" and read
  // the route's status verdict. Route rate-limits 20/10min per IP, so we
  // only do this once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
          cache: 'no-store'
        });
        const body = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.status === 200 && body?.status === 'complete') {
          setStatus({ kind: 'live', label: `Live via ${CHAT_MODEL || 'minimax-oauth'}` });
        } else if (body?.status === 'unconfigured' || res.status === 404) {
          setStatus({ kind: 'unconfigured', label: 'Demo mode' });
        } else if (!SUPABASE_URL) {
          setStatus({ kind: 'auth-required', label: 'Auth required' });
        } else {
          setStatus({ kind: 'unknown', label: 'Degraded' });
        }
      } catch {
        if (!cancelled) setStatus({ kind: 'unknown', label: 'Offline' });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ponytail: auto-scroll transcript to the newest turn after each render.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus?.(), 50);
    return () => window.clearTimeout(id);
  }, []);

  const send = useCallback(async (text) => {
    const content = (text || '').trim();
    if (!content || busy) return;
    setError(null);
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      const body = await res.json().catch(() => null);
      if (res.status === 200 && body?.reply) {
        setMessages((m) => [...m, {
          role: 'assistant',
          content: body.reply,
          meta: { handoff: body.handoff, confidence: body.confidence, needs_human: body.needs_human }
        }]);
      } else {
        const kind = body?.status || 'generic';
        setMessages((m) => [...m, {
          role: 'assistant',
          content: body?.reply || FALLBACKS[kind] || FALLBACKS.generic,
          meta: { unconfigured: kind === 'unconfigured', out_of_scope: kind === 'out_of_scope' }
        }]);
        if (kind === 'unconfigured') setStatus({ kind: 'unconfigured', label: 'Demo mode' });
        if (kind !== 'out_of_scope') setError(kind);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: FALLBACKS.offline }]);
      setError('network');
    } finally {
      setBusy(false);
      inputRef.current?.focus?.();
    }
  }, [messages, busy]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }, [input, send]);

  const badgeState = status.kind === 'live' ? 'live'
    : status.kind === 'unconfigured' ? 'unconfigured' : 'pending';

  return (
    <div className="chat-shell glass--strong" role="region" aria-label="Chat with IronWake">
      <header className="chat-shell__head">
        <div>
          <p className="chat-shell__eyebrow">Text · asynchronous</p>
          <h3 className="chat-shell__title">Chat with IronWake</h3>
        </div>
        <div className="chat-shell__head-actions">
          <span className="glass-card__state" data-state={badgeState}>{status.label}</span>
          {onClose && (
            <button type="button" className="floating-panel__close" onClick={onClose} aria-label="Close chat">×</button>
          )}
        </div>
      </header>

      <div ref={transcriptRef} className="chat-shell__transcript" role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((m, i) => (
          <article key={i} className={`chat-shell__turn chat-shell__turn--${m.role} glass--subtle`}>
            <p className="chat-shell__turn-label">{m.role === 'user' ? 'You' : 'IronWake'}</p>
            <p className="chat-shell__turn-content">{m.content}</p>
            {m.meta?.handoff && (
              <p className="chat-shell__turn-meta">Routed to a human · priority {m.meta.handoff.priority || 'normal'}</p>
            )}
            {m.meta?.unconfigured && (
              <p className="chat-shell__turn-meta chat-shell__turn-meta--warn">Demo mode — the live chat provider isn&apos;t configured in this environment.</p>
            )}
          </article>
        ))}
        {busy && (
          <article className="chat-shell__turn chat-shell__turn--assistant glass--subtle">
            <p className="chat-shell__turn-label">IronWake</p>
            <p className="chat-shell__turn-content">
              <span className="chat-shell__dots" aria-label="Thinking"><span /><span /><span /></span>
            </p>
          </article>
        )}
      </div>

      {messages.length <= 2 && (
        <ul className="chat-shell__suggest" aria-label="Suggested questions">
          {SUGGESTED.map((q) => (
            <li key={q}>
              <button type="button" className="chat-shell__suggest-btn" onClick={() => send(q)} disabled={busy}>{q}</button>
            </li>
          ))}
        </ul>
      )}

      <form className="chat-shell__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <label htmlFor="chat-shell-input" className="chat-shell__label">Ask IronWake</label>
        <textarea
          id="chat-shell-input"
          ref={inputRef}
          className="chat-shell__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about pricing, integrations, or how the AI is wired…"
          rows={2}
          maxLength={1000}
          aria-label="Message IronWake"
          disabled={busy}
        />
        <div className="chat-shell__form-row">
          <span className="chat-shell__hint">
            {error ? <span className="chat-shell__hint--warn">Reply failed — try again.</span>
                   : <span>Enter to send · Shift+Enter for newline</span>}
          </span>
          <button type="submit" className="chat-shell__send" disabled={busy || !input.trim()} aria-label="Send message">
            {busy ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
