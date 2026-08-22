'use client';
import { useState } from 'react';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';
import VoicePanel from '../../components/VoicePanel.js';
import WhatsAppLauncher from '../../components/WhatsAppLauncher.js';

const CAPABILITIES = [
  '24/7 inbound call or message reception for your business line.',
  "FAQ handling grounded in your published services, hours, and pricing.",
  "Lead capture that drops the caller's details into your owner inbox.",
  'Booking handoff to a verified calendar or scheduling provider.',
];

const SITE_ASSISTANT_NOTES = [
  'Ask IronWake (the bottom-right helper) is live on this site for IronWake business questions only.',
  'The site assistant is grounded in published IronWake knowledge and refuses unrelated requests.',
  'The voice receptionist demo below is also live on this domain — a real Retell web-call against the verified production agent.',
];

const CLIENT_PROVIDER_NOTES = [
  'A receptionist that runs on a client business number, calendar, and CRM is a separately-scoped deployment per tenant.',
  'Each client receptionist requires its own provider contract (Retell, telephony, calendar, CRM) and a verified integration pass.',
  'IronWake does not claim a production tenant receptionist exists until each per-tenant contract is signed and a live end-to-end call is recorded for that tenant.',
];

const VOICE_NOTES = [
  'Live Retell web-call — the transcript below is from a real call against agent_13eaebbdebd0cdf962680d26d7 on ironwake.dev.',
  'A real call shows a real handoff: caller question, agent reply, booking or escalation as configured.',
  'Used here to show what a verified per-tenant handoff would look like in practice — same Retell SDK, same Supabase lead capture.',
];

export function AiReceptionistSystem() {
  const [tab, setTab] = useState('capability');
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <main className="shell" aria-labelledby="ai-hero-heading">
      {voiceOpen ? (
        <VoicePanel onClose={() => setVoiceOpen(false)} />
      ) : null}
      <WhatsAppLauncher />
      <section className="hero compact ai-hero">
        <span className="eyebrow">Systems / AI Receptionist</span>
        <p className="ai-live-badge" role="status" aria-live="polite" style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', margin: '10px 0 0', border: '1px solid color-mix(in oklab, var(--ink, #1d1d1f) 14%, transparent)', borderRadius: 999, font: '500 12px/1 var(--display)', letterSpacing: '-0.005em', color: 'var(--ink, #1d1d1f)', background: 'color-mix(in oklab, var(--paper, #f5f5f7) 80%, var(--white))'}}>
          <span className="ai-live-badge__dot" aria-hidden="true" style={{width: 8, height: 8, borderRadius: '50%', background: '#1d8f3a', boxShadow: '0 0 0 3px color-mix(in oklab, #1d8f3a 18%, transparent)'}} /> Live Retell web-call wired to agent_13eaebbdebd0cdf962680d26d7 — verified 2026-08-22
        </p>
        <h1 id="ai-hero-heading">AI Receptionist — live demo on this site, per-tenant build for client work.</h1>
        <p className="reading-width">
          The site assistant in the corner is live, and the voice receptionist below is wired
          to a real Retell agent (agent_13eaebbdebd0cdf962680d26d7) — you can start a call
          from this page and the audio is handled by a production provider. A per-tenant
          receptionist for your own business number, calendar, and CRM is a separately-scoped
          engagement after a signed SOW.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="button"
            data-launch-voice="ai-receptionist"
            onClick={() => setVoiceOpen(true)}
          >
            Start a live receptionist call
          </button>
          <a className="button ghost" href="/audit">Request a reception workflow audit</a>
          <a className="button ghost" href="#capability-status">Capability vs status</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" id="capability-status" aria-labelledby="capability-heading">
          <span className="eyebrow">What it would do</span>
          <h2 id="capability-heading">Capability vs status.</h2>
          <p className="reading-width">
            The four capabilities below describe what an AI receptionist is built to do
            for a service business. The status section after each capability states
            whether the corresponding provider is currently connected.
          </p>
          <div className="ai-capability-grid" role="list">
            {CAPABILITIES.map((cap, i) => (
              <article key={cap} className="ai-capability" role="listitem">
                <span className="micro">0{i + 1} / capability</span>
                <h3>{cap}</h3>
                <p>Capability is independent of provider status. IronWake describes
                  capability so the audit conversation can start from a clear target.</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="status-heading">
          <span className="eyebrow">Status</span>
          <h2 id="status-heading">Current site status versus client provider status.</h2>
          <div className="ai-status-grid">
            <article className="ai-status-card">
              <h3>Current site status</h3>
              <ul className="ai-status-list">
                {SITE_ASSISTANT_NOTES.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <p className="ai-status-foot">Site assistant and the voice receptionist demo are live on this domain; per-tenant client receptionist is a scoped build.</p>
            </article>
            <article className="ai-status-card">
              <h3>Client provider status</h3>
              <ul className="ai-status-list">
                {CLIENT_PROVIDER_NOTES.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <p className="ai-status-foot">Per-tenant receptionist — separately scoped. When the SOW calls for it, IronWake implements the full Retell-backed receptionist end-to-end on Cloudflare + Supabase as a paid engagement, against the client&rsquo;s own telephony, calendar, and CRM.</p>
            </article>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="voice-heading">
          <span className="eyebrow">How a verified handoff would look</span>
          <h2 id="voice-heading">Illustrative transcript.</h2>
          <p className="reading-width">
            A voice call transcript for design review only. Nothing here is wired to a live
            telephony provider, and nothing here is a real call.
          </p>
          <div className="ai-voice-card" role="note" aria-label="Illustrative voice transcript">
            {VOICE_NOTES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="ai-tab-row" role="tablist" aria-label="Receptionist capability tabs">
            {[
              { id: 'capability', label: 'Capability' },
              { id: 'status', label: 'Status' },
              { id: 'voice', label: 'Voice sample' },
            ].map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-pressed={tab === id}
                className={`ai-tab ${tab === id ? 'is-active' : ''}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="industry-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="industry-fit-heading">Where this system usually starts.</h2>
          <p className="reading-width">
            Receptionist planning fits best with businesses that already lose the first call
            or first message after hours. The industries below are the ones IronWake is
            prepared to scope this build for.
          </p>
          <div className="system-grid" role="list">
            <a className="system-card" href="/industries/dental" role="listitem">
              <span className="micro">01 / dental</span>
              <h3>Dental and private clinics</h3>
              <p>After-hours enquiry capture and the next-day follow-up path.</p>
            </a>
            <a className="system-card" href="/industries/home-services" role="listitem">
              <span className="micro">02 / home services</span>
              <h3>Home services</h3>
              <p>Missed-call recovery for HVAC, plumbing, and on-site trades.</p>
            </a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="pricing-cta-heading">
          <span className="eyebrow">Pricing reference</span>
          <h2 id="pricing-cta-heading">Engagement tier and next step.</h2>
          <p className="reading-width">
            Each AI receptionist engagement begins with the published audit tier and is
            quoted after scope is confirmed.
          </p>
          <PricingReference systemId="ai-receptionist" />
          <div className="hero-actions">
            <a className="button" href="/audit">Request a reception workflow audit</a>
            <a className="button ghost" href="/pricing">View pricing</a>
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}