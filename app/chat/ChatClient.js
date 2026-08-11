'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

// ponytail: dedicated /chat page reuses /api/chat (same server route as the global widget).
// ponytail: NO direct provider call, NO browser-side API key, NO provider secret in bundle.
// ponytail: bigger viewport, full message history, retry without duplicate, clear handoff path.

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

export default function ChatClient() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [handoff, setHandoff] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

  useEffect(() => () => { if (abortRef.current) abortRef.current.abort(); }, []);

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

  const retry = () => {
    const last = [...messages].reverse().find((m) => m.role === 'user');
    if (last && !pending) send(last.content);
  };

  const clearAll = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setStatusMessage(null);
    setHandoff(false);
    setInput('');
    setPending(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    send(input);
  };

  return <main className="shell chat-shell">
    <SiteHeader />
    <section className="hero compact chat-hero">
      <span className="eyebrow">Ask IronWake</span>
      <h1>Full conversation with the IronWake site assistant.</h1>
      <p>This assistant answers IronWake business questions. It is not a general coding model and will not run internal tools or expose credentials. Replies are model-backed and run through the same secure server route as the global widget.</p>
    </section>
    <section className="section chat-section" aria-label="Assistant conversation">
      <div className="chat-window" ref={scrollRef}>
        {messages.length === 0 && <div className="chat-empty">
          <p>Pick a prompt to start, or type your own question.</p>
          <ul className="chat-prompts">
            {PROMPT_SUGGESTIONS.map((p) => <li key={p}><button type="button" onClick={() => send(p)} disabled={pending}>{p}</button></li>)}
          </ul>
        </div>}
        {messages.map((m, i) => <article key={i} className={`chat-bubble chat-bubble-${m.role}`}>
          <span className="chat-bubble-role">{m.role === 'user' ? 'You' : 'IronWake AI'}</span>
          <p>{m.content}</p>
        </article>)}
        {pending && <article className="chat-bubble chat-bubble-assistant chat-bubble-pending" aria-live="polite"><span className="chat-bubble-role">IronWake AI</span><p>Thinking…</p></article>}
      </div>
      <form className="chat-form" onSubmit={handleSubmit} aria-label="Send a message">
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <textarea
          id="chat-input"
          rows={3}
          placeholder="Ask about IronWake services, pricing, or process…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          disabled={pending}
          aria-describedby="chat-status"
        />
        <div className="chat-actions">
          <button type="submit" disabled={pending || !input.trim()}>Send</button>
          <button type="button" onClick={retry} disabled={pending || messages.length === 0}>Retry last</button>
          <button type="button" onClick={clearAll} disabled={pending && messages.length === 0}>Clear</button>
        </div>
      </form>
      <p id="chat-status" className="chat-status" role="status">{statusMessage || (handoff ? 'Human handoff requested — reach the team at ironwake.dev@gmail.com or use the audit form.' : ' ')}</p>
      <p className="chat-handoff">For human follow-up: <a href="/audit">Book a diagnostic</a> · <a href="/pricing">See pricing</a> · <a href="/work">Browse case studies</a></p>
    </section>
    <SiteFooter />
  </main>;
}