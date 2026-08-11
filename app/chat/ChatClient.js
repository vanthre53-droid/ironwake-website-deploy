'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link.js';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { createBrowserSupabase } from '../../lib/supabase/clients.mjs';

// ponytail: dedicated /chat page reuses /api/chat (same server route as the global widget).
// ponytail: NO direct provider call, NO browser-side API key, NO provider secret in bundle.
// ponytail: bigger viewport, full message history, retry without duplicate, clear handoff path.
// ponytail: AUTHENTICATED visitors get their conversation persisted to Supabase chat_sessions
//   + chat_messages (RLS isolates them to their own rows). Anonymous visitors use local
//   state only — the page never auto-claims anonymous history for an account.

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
  const [auth, setAuth] = useState({ loaded: false, signedIn: false, userId: null });
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

  useEffect(() => () => { if (abortRef.current) abortRef.current.abort(); }, []);

  // ponytail: detect auth state via the @supabase/ssr browser client. We do
  // not trust localStorage alone — the middleware refreshes the SSR cookie
  // session on every request.
  useEffect(() => {
    const client = createBrowserSupabase();
    if (!client) { setAuth({ loaded: true, signedIn: false, userId: null }); return; }
    let cancelled = false;
    client.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data?.session?.user;
      setAuth({ loaded: true, signedIn: Boolean(user), userId: user?.id || null });
    }).catch(() => { if (!cancelled) setAuth({ loaded: true, signedIn: false, userId: null }); });
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      if (cancelled) return;
      const user = next?.user;
      setAuth({ loaded: true, signedIn: Boolean(user), userId: user?.id || null });
    });
    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, []);

  // ponytail: when the user signs in, pull their conversation history.
  useEffect(() => {
    if (!auth.signedIn) { setHistory([]); return; }
    let cancelled = false;
    const client = createBrowserSupabase();
    if (!client) return;
    client.from('chat_sessions')
      .select('id,title,created_at,updated_at')
      .order('updated_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (!cancelled) setHistory(data || []); });
    return () => { cancelled = true; };
  }, [auth.signedIn]);

  const persistMessage = useCallback(async (session, role, content) => {
    if (!session || !content) return;
    const client = createBrowserSupabase();
    if (!client) return;
    const { error } = await client.from('chat_messages').insert({
      session_id: session,
      user_id: auth.userId,
      role,
      content: content.slice(0, 4000),
    });
    if (!error) {
      await client.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', session);
    }
  }, [auth.userId]);

  const startSession = useCallback(async () => {
    if (!auth.signedIn) return null;
    const client = createBrowserSupabase();
    if (!client) return null;
    const title = `Conversation on ${new Date().toISOString().slice(0, 10)}`;
    const { data, error } = await client.from('chat_sessions').insert({ user_id: auth.userId, title })
      .select('id,title,created_at,updated_at').single();
    if (error || !data) return null;
    setHistory((h) => [{ ...data }, ...h]);
    return data.id;
  }, [auth.signedIn, auth.userId]);

  const loadSession = useCallback(async (id) => {
    const client = createBrowserSupabase();
    if (!client) return;
    const { data, error } = await client
      .from('chat_sessions')
      .select('id,title,created_at,updated_at,messages:chat_messages(id,role,content,created_at)')
      .eq('id', id)
      .eq('user_id', auth.userId)
      .maybeSingle();
    if (error || !data) return;
    setSessionId(data.id);
    const msgs = (data.messages || []).map((m) => ({ role: m.role, content: m.content }));
    setMessages(msgs);
    setHandoff(false);
    setStatusMessage(null);
    setInput('');
  }, [auth.userId]);

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
    let replyText = null;
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
          replyText = reply.reply;
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

    // ponytail: persist the pair to Supabase when signed in. RLS scopes the
    // write to auth.userId; the server route is unchanged.
    if (auth.signedIn && auth.userId) {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = await startSession();
        if (activeSessionId) setSessionId(activeSessionId);
      }
      if (activeSessionId) {
        await persistMessage(activeSessionId, 'user', trimmed);
        if (replyText) await persistMessage(activeSessionId, 'assistant', replyText);
      }
    }
  }, [messages, pending, auth.signedIn, auth.userId, sessionId, startSession, persistMessage]);

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
    setSessionId(null);
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
      {auth.loaded && auth.signedIn ? <p className="chat-handoff">Signed in — your conversation is saved to your account. <Link href="/account">Open My account →</Link></p> : <p className="chat-handoff">Not signed in — chat history is local to this browser. <Link href="/signup">Create an account</Link> to save conversations.</p>}
    </section>
    <section className="section chat-section" aria-label="Assistant conversation">
      {auth.signedIn && history.length > 0 && <aside className="chat-history" aria-label="Previous conversations">
        <span className="micro">Previous conversations</span>
        <ul>
          {history.map((h) => <li key={h.id}>
            <button type="button" onClick={() => loadSession(h.id)} disabled={pending}>{h.title || 'Conversation'} · <span className="chat-history-date">{new Date(h.updated_at).toLocaleDateString()}</span></button>
          </li>)}
        </ul>
      </aside>}
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
      <p id="chat-status" className="chat-status" role="status">{statusMessage || (handoff ? 'Human handoff requested — reach the team at ironwake.dev@gmail.com or use the audit form.' : ' ')}</p>
      <p className="chat-handoff">For human follow-up: <a href="/audit">Book a diagnostic</a> · <a href="/pricing">See pricing</a> · <a href="/work">Browse case studies</a></p>
    </section>
    <SiteFooter />
  </main>;
}
