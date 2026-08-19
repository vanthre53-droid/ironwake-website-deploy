'use client';

// ponytail: VoicePanel — the integrated panel surface for the live voice
// receptionist. Wraps the existing VoiceSessionLauncher and surfaces the
// HONEST provider state before the user clicks anything.
//
// Honest provider state:
//   • 'configured' — POST /api/voice/session returns 200 with body.ok=true
//                    AND a non-empty accessToken. We render the launcher.
//   • 'unconfigured' — the route returns 503 / body.ok=false /
//                      safeErrorCode==='retell_unconfigured'. We render
//                      "Voice calls ready to enable" — a truthful
//                      placeholder — instead of a fake waveform.
//   • 'unknown' — the probe couldn't reach the route or got an unexpected
//                 status; we render the launcher but flag it as degraded.
//
// Design (v13 Pearl/Graphite/Petrol):
//   • Uses .glass--strong for the surface so it sits on the same panel
//     chrome as .chat-shell.
//   • State badge uses the same .glass-card__state[data-state=...] pattern
//     as ChatShell so the three panels read consistently.
//   • No animations beyond the parent .floating-panel transition; respects
//     prefers-reduced-motion automatically (CSS inherits the global rule).
//
// Accessibility:
//   • region role="region" with a descriptive aria-label.
//   • State badge uses aria-live="polite" so screen readers announce the
//     configured/unconfigured verdict once the probe resolves.
//   • The close button has aria-label and uses ≥48px touch target via
//     .floating-panel__close.

import { useEffect, useRef, useState } from 'react';
import VoiceSessionLauncher from './VoiceSessionLauncher.js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();

export default function VoicePanel({ onClose }) {
  const [status, setStatus] = useState({ kind: 'unknown', label: 'Checking voice…', configured: false });
  const probedRef = useRef(false);

  useEffect(() => {
    if (probedRef.current) return;
    probedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/voice/session', {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'content-type': 'application/json' },
          body: '{}'
        });
        let body = null;
        try { body = await res.json(); } catch { /* ignore */ }
        if (cancelled) return;
        if (res.status === 200 && body?.ok && body.accessToken) {
          setStatus({ kind: 'live', label: 'Live via Retell', configured: true });
        } else if (body?.safeErrorCode === 'retell_unconfigured') {
          setStatus({ kind: 'unconfigured', label: 'Ready to enable', configured: false });
        } else if (!SUPABASE_URL) {
          setStatus({ kind: 'auth-required', label: 'Auth required', configured: false });
        } else {
          setStatus({ kind: 'degraded', label: 'Degraded', configured: false });
        }
      } catch {
        if (!cancelled) {
          setStatus({ kind: 'degraded', label: 'Offline', configured: false });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const badgeState =
    status.kind === 'live' ? 'live'
      : status.kind === 'unconfigured' ? 'unconfigured'
        : 'pending';

  return (
    <div className="voice-panel glass--strong" role="region" aria-label="Voice session with IronWake">
      <header className="voice-panel__head">
        <div>
          <p className="voice-panel__eyebrow">Voice · live receptionist</p>
          <h3 className="voice-panel__title">Talk to IronWake</h3>
        </div>
        <div className="chat-shell__head-actions">
          <span
            className="glass-card__state"
            data-state={badgeState}
            aria-live="polite"
          >
            {status.label}
          </span>
          {onClose && (
            <button
              type="button"
              className="floating-panel__close"
              onClick={onClose}
              aria-label="Close voice session"
            >
              ×
            </button>
          )}
        </div>
      </header>

      <p className="voice-panel__lede">
        A short voice session with our AI receptionist — useful for triage when
        you&apos;d rather speak than type. The microphone stays off until you
        press start.
      </p>

      <div className="voice-panel__body">
        {status.kind === 'live' ? (
          <VoiceSessionLauncher
            endpoint="/api/voice/session"
            consentLabel="Microphone stays off until you tap start. Audio is sent to Retell for the duration of the call and is not stored on IronWake."
          />
        ) : status.kind === 'unconfigured' ? (
          <div className="voice-panel__placeholder" role="status">
            <h4>Voice calls ready to enable</h4>
            <p>
              The Retell integration isn&apos;t wired in this environment. When
              <code> RETELL_API_KEY </code> and the agent ID are set, this panel
              hands you a live voice session in under a second.
            </p>
            <ul>
              <li>Server returns 503 with <code>safeErrorCode: retell_unconfigured</code></li>
              <li>No microphone is requested before you tap start</li>
              <li>Voice sessions route through <code>/api/voice/session</code></li>
            </ul>
          </div>
        ) : status.kind === 'auth-required' ? (
          <div className="voice-panel__placeholder" role="status">
            <h4>Sign in to use voice</h4>
            <p>
              The voice receptionist is currently tied to authenticated sessions.
              Once you&apos;re signed in, the panel switches to live mode automatically.
            </p>
          </div>
        ) : (
          <div className="voice-panel__placeholder" role="status">
            <h4>Voice receptionist</h4>
            <p>
              Verifying connection to <code>/api/voice/session</code>. If this
              state stays here, check your network and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
