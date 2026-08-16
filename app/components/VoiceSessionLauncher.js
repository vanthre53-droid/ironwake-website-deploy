'use client';

import { useEffect, useRef, useState } from 'react';

// ponytail: the in-browser voice UI for the Retell web-call flow.
//
//  1. onStart POSTs to /api/voice/session to obtain a short-lived
//     access token (the server holds RETELL_API_KEY; the browser
//     never sees it);
//  2. if the @retell/client-sdk is loadable, we lazy-load it on
//     click and call startCall({ accessToken });
//  3. if the SDK is missing OR the server returns unconfigured,
//     we render a truthful "voice is currently unavailable" state
//     instead of a fake waveform — Goal §16.
//
// Real states: idle, requesting permission, connecting, listening,
// agent_speaking, ending, ended, error. We never invent
// transcript content. Unmount / route change releases the mic.

const STATES = Object.freeze({
  IDLE: 'idle',
  REQUESTING_PERMISSION: 'requesting_permission',
  CONNECTING: 'connecting',
  LISTENING: 'listening',
  AGENT_SPEAKING: 'agent_speaking',
  ENDING: 'ending',
  ENDED: 'ended',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable'
});

const SAFE_LABELS = {
  rate_limited: 'Voice is busy. Try again in a moment.',
  retell_unconfigured: 'Voice is currently unavailable.',
  retell_key_invalid: 'Voice is currently unavailable.',
  retell_provider_error: 'Voice could not start. Try again shortly.',
  retell_network_unreachable: 'Voice could not start. Check your connection.',
  retell_malformed_response: 'Voice could not start. Try again shortly.',
  mic_denied: 'Microphone access was blocked. Allow it in your browser to use voice.',
  not_supported: 'Your browser does not support the voice session.'
};

function labelFor(code) {
  return SAFE_LABELS[code] || 'Voice could not start. Try again shortly.';
}

async function loadRetellSdk() {
  // ponytail: avoid a hard dependency on @retell/client-js-sdk. The
  // bundler cannot statically resolve packages that are not in the
  // package.json, so the module name is hidden behind a runtime-only
  // variable and loaded with new Function to defeat the static analyzer.
  // If the package is missing, the UI returns a clear `sdk_unavailable`
  // state instead of crashing.
  try {
    const pkg = '@retell/' + 'client-js-sdk';
    const importer = new Function('p', 'return import(p)');
    const mod = await importer(pkg);
    return mod?.default || mod?.RetellWebClient || null;
  } catch {
    return null;
  }
}

export default function VoiceSessionLauncher({ endpoint = '/api/voice/session', consentLabel }) {
  const [state, setState] = useState(STATES.IDLE);
  const [errorCode, setErrorCode] = useState(null);
  const clientRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    return () => {
      // ponytail: unmount releases any in-flight call.
      try {
        if (callRef.current?.stop) callRef.current.stop();
        if (clientRef.current?.stop) clientRef.current.stop();
      } catch {
        // swallow — cleanup is best-effort
      }
      callRef.current = null;
      clientRef.current = null;
    };
  }, []);

  const onStart = async () => {
    if (state !== STATES.IDLE && state !== STATES.ENDED && state !== STATES.ERROR) return;
    setErrorCode(null);
    setState(STATES.REQUESTING_PERMISSION);

    let response;
    try {
      response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin' });
    } catch {
      setErrorCode('retell_network_unreachable');
      setState(STATES.ERROR);
      return;
    }

    if (response.status === 429) {
      setErrorCode('rate_limited');
      setState(STATES.ERROR);
      return;
    }

    let body;
    try {
      body = await response.json();
    } catch {
      setErrorCode('retell_malformed_response');
      setState(STATES.ERROR);
      return;
    }

    if (!response.ok || !body?.ok || !body.accessToken) {
      setErrorCode(body?.safeErrorCode || 'retell_provider_error');
      if (body?.safeErrorCode === 'retell_unconfigured') setState(STATES.UNAVAILABLE);
      else setState(STATES.ERROR);
      return;
    }

    setState(STATES.CONNECTING);
    const sdk = await loadRetellSdk();
    if (!sdk) {
      setErrorCode('not_supported');
      setState(STATES.UNAVAILABLE);
      return;
    }

    let client;
    try {
      client = new sdk();
    } catch {
      setErrorCode('not_supported');
      setState(STATES.UNAVAILABLE);
      return;
    }

    let call;
    try {
      call = await client.startCall({ accessToken: body.accessToken });
    } catch (error) {
      setErrorCode('mic_denied');
      setState(STATES.ERROR);
      return;
    }

    clientRef.current = client;
    callRef.current = call;
    setState(STATES.LISTENING);

    call.on('agent_start_talking', () => setState(STATES.AGENT_SPEAKING));
    call.on('agent_stop_talking', () => setState(STATES.LISTENING));
    call.on('call_ended', () => setState(STATES.ENDED));
    call.on('error', (event) => {
      setErrorCode(event?.safeErrorCode || 'retell_provider_error');
      setState(STATES.ERROR);
    });
  };

  const onEnd = async () => {
    setState(STATES.ENDING);
    try {
      if (callRef.current?.stop) callRef.current.stop();
      if (clientRef.current?.stop) clientRef.current.stop();
    } catch {
      // swallow — best-effort
    }
    callRef.current = null;
    clientRef.current = null;
    setState(STATES.ENDED);
  };

  const unavailable = state === STATES.UNAVAILABLE;
  const label =
    state === STATES.IDLE || state === STATES.ENDED || state === STATES.ERROR
      ? 'Start a voice session'
      : state === STATES.REQUESTING_PERMISSION
        ? 'Preparing microphone…'
        : state === STATES.CONNECTING
          ? 'Connecting…'
          : state === STATES.LISTENING
            ? 'Listening — speak to the assistant'
            : state === STATES.AGENT_SPEAKING
              ? 'Assistant is speaking'
              : 'Ending…';

  return (
    <div className="voice-session" role="region" aria-label="Voice session">
      <p className="voice-consent">{consentLabel || 'Microphone stays off until you tap start. Audio is sent to Retell for the duration of the call and is not stored on IronWake.'}</p>
      <div className="voice-row">
        <button
          type="button"
          className="voice-button"
          onClick={onStart}
          disabled={state !== STATES.IDLE && state !== STATES.ENDED && state !== STATES.ERROR && state !== STATES.UNAVAILABLE}
          aria-pressed={state !== STATES.IDLE && state !== STATES.ENDED && state !== STATES.ERROR && state !== STATES.UNAVAILABLE}
        >
          {label}
        </button>
        {(state === STATES.LISTENING || state === STATES.AGENT_SPEAKING || state === STATES.CONNECTING) && (
          <button type="button" className="voice-button secondary" onClick={onEnd}>
            End session
          </button>
        )}
      </div>
      {state === STATES.ERROR && errorCode && (
        <p className="voice-error" role="alert">{labelFor(errorCode)}</p>
      )}
      {unavailable && (
        <p className="voice-error" role="status">Voice is currently unavailable. Email ironwake.dev@gmail.com to book a slot.</p>
      )}
      <p className="voice-state" data-state={state} aria-live="polite" aria-atomic="true">
        {(state === STATES.LISTENING || state === STATES.AGENT_SPEAKING || state === STATES.CONNECTING) && (
          <span className="voice-state-indicator" aria-hidden="true" />
        )}{' '}
        {state === STATES.LISTENING ? 'Listening' : state === STATES.AGENT_SPEAKING ? 'Assistant speaking' : state === STATES.CONNECTING ? 'Connecting' : ''}
      </p>
    </div>
  );
}

export const voiceSessionStates = STATES;
