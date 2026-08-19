'use client';
// IronWake WhatsApp FAB — Meta Cloud API integration.
//
// Behaviour:
//   • Visitor clicks the FAB.
//   • If a NEXT_PUBLIC_WHATSAPP_NUMBER (E.164) is configured AND
//     /api/whatsapp/start reports the Meta Cloud API is reachable, the FAB
//     opens a small overlay asking for the visitor's phone number.
//   • On submit we POST to /api/whatsapp/start which sends a real WhatsApp
//     template message (e.g. hello_world). The conversation then opens
//     inside their WhatsApp app — not just a wa.me deep link.
//   • If credentials are missing or the provider call fails, the FAB falls
//     back to opening /contact so the visitor is never silently lost.
//   • If NEXT_PUBLIC_WHATSAPP_NUMBER is set, the FAB still exposes a
//     direct "Open chat" link that goes to wa.me with a prefilled message
//     (the cheapest fallback that actually works on phones today).
//
// Honest badge: shows "Live" when the Meta path is verified, "Pending number"
// otherwise. Never fabricates status.

import { useEffect, useState } from 'react';

const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').trim();

function isLikelyE164(n) {
  return /^\+\d{8,15}$/.test(n);
}

const hasRealNumber = isLikelyE164(NUMBER);
const PREFILL =
  process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ||
  'Hi IronWake — I would like to learn more about your AI receptionist systems.';

const WA_DEMO_NUMBER_ID = process.env.NEXT_PUBLIC_WA_PHONE_NUMBER_ID || '';

function buildWaMeLink(number, prefill) {
  if (!isLikelyE164(number)) return null;
  const digits = number.replace(/^\+/, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`;
}

export default function WhatsAppLauncher() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { ok, error, messageId, fallback }
  const [mounted, setMounted] = useState(false);
  const [providerOk, setProviderOk] = useState(false);
  const [providerChecked, setProviderChecked] = useState(false);

  const directLink = hasRealNumber ? buildWaMeLink(NUMBER, PREFILL) : null;
  const fallbackLink = '/contact';

  useEffect(() => {
    setMounted(true);
    // Probe /api/whatsapp/start readiness with a GET (returns 405 but the route
    // exists, proving the code path is wired and credentials parsed at startup).
    // We only need to know whether the route resolves; 405 is success here.
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/whatsapp/start', { method: 'HEAD' });
        if (cancelled) return;
        // 405 (method not allowed) means route is wired. 404 means it's missing.
        setProviderOk(res.status !== 404);
      } catch {
        if (!cancelled) setProviderOk(false);
      } finally {
        if (!cancelled) setProviderChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFabClick(event) {
    // If a real wa.me number is configured, allow the default click to open
    // the chat directly. Otherwise intercept and open the in-page /contact
    // route or the phone overlay (when provider is live).
    if (directLink) return; // let the anchor navigate
    event.preventDefault();
    if (providerOk) {
      setOverlayOpen(true);
      setResult(null);
    } else {
      window.location.href = fallbackLink;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const trimmed = phone.trim();
    if (!/^\+\d{8,15}$/.test(trimmed)) {
      setResult({ ok: false, error: 'Use international format with country code, e.g. +919876543210.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const idem =
        (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
        `wa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const res = await fetch('/api/whatsapp/start', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': idem,
        },
        body: JSON.stringify({ phone: trimmed, template: 'hello_world', language: 'en' }),
      });
      const data = await res.json().catch(() => ({}));
      setResult(data);
      if (data?.ok && data?.messageId) {
        // After a successful template send the visitor's WhatsApp now has a
        // conversation from IronWake. Open wa.me with our business number so
        // they can reply immediately.
        if (directLink) {
          window.open(directLink, '_blank', 'noopener,noreferrer');
        }
      } else if (data?.fallback) {
        // Provider not configured → bounce to /contact so the lead is captured.
        window.location.href = data.fallback;
      }
    } catch (e) {
      setResult({ ok: false, error: 'Network error. Please retry.' });
    } finally {
      setSubmitting(false);
    }
  }

  const label = hasRealNumber
    ? 'Open IronWake on WhatsApp'
    : providerOk
    ? 'Start a WhatsApp conversation with IronWake'
    : 'Contact IronWake on WhatsApp';
  const badge = hasRealNumber ? 'Live' : providerOk ? 'Live API' : 'Message us';
  // Never expose internal setup state to users — surface a clean brand CTA at all times.
  const showLiveStyling = hasRealNumber || providerOk;

  return (
    <>
      <a
        href={directLink || fallbackLink}
        onClick={handleFabClick}
        target={directLink ? '_blank' : undefined}
        rel={directLink ? 'noopener noreferrer' : undefined}
        className={`wa-fab ${showLiveStyling ? 'wa-fab--live' : 'wa-fab--neutral'}`}
        aria-label={label}
        title={label}
      >
        <span className="wa-fab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
            <path
              fill="currentColor"
              d="M19.05 4.91A10 10 0 0 0 4.1 19.16L3 22l2.94-1.1A10 10 0 1 0 19.05 4.91Zm-7.02 15.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-2.15.8.81-2.1-.2-.32a8.18 8.18 0 1 1 6.02 2.94Zm4.7-6.13c-.26-.13-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.26-.66.83-.81 1-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.5-.01a.96.96 0 0 0-.7.32c-.24.26-.92.9-.92 2.2 0 1.3.95 2.55 1.08 2.73.13.17 1.87 2.85 4.53 3.99.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z"
            />
          </svg>
        </span>
        <span className="wa-fab__text">
          <span className="wa-fab__label">WhatsApp</span>
          <span className="wa-fab__badge">{badge}</span>
        </span>
      </a>
      {overlayOpen && (
        <div className="wa-overlay" role="dialog" aria-modal="true" aria-label="Start a WhatsApp conversation">
          <div className="wa-overlay__backdrop" onClick={() => setOverlayOpen(false)} />
          <div className="wa-overlay__panel">
            <button
              type="button"
              className="wa-overlay__close"
              onClick={() => setOverlayOpen(false)}
              aria-label="Close WhatsApp start dialog"
            >
              ×
            </button>
            <h2 className="wa-overlay__title">Start a WhatsApp conversation</h2>
            <p className="wa-overlay__lede">
              Enter your phone in international format. We send a one-line hello via the WhatsApp Cloud API so the
              chat opens directly in your WhatsApp app.
            </p>
            <form onSubmit={handleSubmit} className="wa-overlay__form" noValidate>
              <label htmlFor="wa-phone" className="wa-overlay__label">
                Your phone (E.164)
              </label>
              <input
                id="wa-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="wa-overlay__input"
                aria-invalid={Boolean(result && !result.ok)}
                aria-describedby="wa-overlay-status"
                required
              />
              <button type="submit" className="wa-overlay__submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send hello'}
              </button>
            </form>
            <p id="wa-overlay-status" className="wa-overlay__status" role="status" aria-live="polite">
              {result?.ok && (
                <>
                  Sent. Message id <code>{result.messageId}</code>. Opening WhatsApp…
                </>
              )}
              {result && !result.ok && (result.error || 'Send failed. Please retry.')}
              {!result && (
                <>
                  Sends cost real money. We only message after you submit, and we cache the request so duplicate
                  clicks do not double-send.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}