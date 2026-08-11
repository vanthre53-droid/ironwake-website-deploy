'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ponytail: real AI-backed chat widget. Posts to /api/chat which proxies
// to MiniMax-M3 with a grounded IronWake knowledge base. Server is the
// single owner of the API secret; the browser bundle sees no credential.
// Degrades to a deterministic guided link panel if the server reports
// unconfigured or a transient provider error.

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

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [handoff, setHandoff] = useState(false);
  const [consent, setConsent] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

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

  return (
    <div className="assistant-widget" id="ironwake-ai-assistant">
      {!open && (
        <button
          type="button"
          className="assistant-launch"
          onClick={() => setOpen(true)}
          aria-label="Open the IronWake AI assistant"
        >
          Ask IronWake
        </button>
      )}
      {open && (
        <section
          className="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="IronWake AI assistant"
        >
          <header className="assistant-header">
            <div>
              <h2>Ask IronWake</h2>
              <p className="assistant-subtitle">A real assistant grounded in the published IronWake knowledge. Replies are short, honest, and may hand off to a human.</p>
            </div>
            <button type="button" className="assistant-close" onClick={() => setOpen(false)} aria-label="Close the IronWake AI assistant">×</button>
          </header>
          <div className="assistant-log" ref={scrollRef} aria-live="polite">
            {messages.length === 0 && (
              <div className="assistant-empty">
                <p>Try one of these:</p>
                <ul>
                  {PROMPT_SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" className="assistant-suggestion" onClick={() => send(s)} disabled={pending}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`assistant-msg assistant-${m.role}`}>
                <span className="assistant-role">{m.role === 'user' ? 'You' : 'IronWake'}</span>
                <p>{m.content}</p>
              </div>
            ))}
            {pending && (
              <div className="assistant-msg assistant-assistant">
                <span className="assistant-role">IronWake</span>
                <p className="assistant-pending">Thinking…</p>
              </div>
            )}
          </div>
          {statusMessage && <p className="assistant-status" role="status">{statusMessage}</p>}
          {handoff && !consent && (
            <div className="assistant-handoff">
              <label>
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                I consent to IronWake recording my contact details and passing my conversation to a human for follow-up.
              </label>
              <button type="button" className="assistant-handoff-btn" onClick={handleConsent} disabled={!consent || pending}>
                Hand off to a human
              </button>
            </div>
          )}
          <form className="assistant-form" onSubmit={handleSubmit}>
            <label htmlFor="assistant-input" className="sr-only">Ask IronWake a question</label>
            <input
              id="assistant-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask IronWake a question"
              maxLength={1000}
              autoComplete="off"
              disabled={pending}
            />
            <button type="submit" className="assistant-send" disabled={pending || !input.trim()}>
              Send
            </button>
          </form>
          <p className="assistant-footnote">No login required. Replies may be imperfect — never share passwords, payment details, or identity documents in chat.</p>
        </section>
      )}
    </div>
  );
}
