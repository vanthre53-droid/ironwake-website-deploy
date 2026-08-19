'use client';
import { useState } from 'react';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

const CAPABILITIES = [
  '24/7 inbound call or message reception for your business line.',
  "FAQ handling grounded in your published services, hours, and pricing.",
  "Lead capture that drops the caller's details into your owner inbox.",
  'Booking handoff to a verified calendar or scheduling provider.',
];

const SITE_ASSISTANT_NOTES = [
  'Ask IronWake (the bottom-right helper) is live on this site for IronWake business questions only.',
  'The site assistant is grounded in published IronWake knowledge and refuses unrelated requests.',
  'It is not a deployed receptionist for any client business yet.',
];

const CLIENT_PROVIDER_NOTES = [
  'No telephony, voice, messaging, or model provider is configured for client receptionist deployments.',
  'Each client receptionist requires a separately-scoped provider contract and verified integration.',
  'Until that work is signed off, IronWake does not claim a live client receptionist exists.',
];

const VOICE_NOTES = [
  'ILLUSTRATIVE SAMPLE — not a real call. No live phone line is connected.',
  'Voice transcript is hardcoded for design review only.',
  'Used here to show what a verified handoff would look like in practice.',
];

export function AiReceptionistSystem() {
  const [tab, setTab] = useState('capability');

  return (
    <main className="shell" aria-labelledby="ai-hero-heading">
      <section className="hero compact ai-hero">
        <span className="eyebrow">Systems / AI Receptionist</span>
        <h1 id="ai-hero-heading">AI Receptionist — a plan, not a live receptionist.</h1>
        <p className="reading-width">
          The site assistant in the corner is live. A client receptionist for your business
          is a separate build, and it does not exist as a deployed product yet. This page
          is the plan: what it would do, what the gap is, and the smallest next step.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a reception workflow audit</a>
          <a className="button ghost" href="#capability-status">Capability versus status</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" id="capability-status" aria-labelledby="capability-heading">
          <span className="eyebrow">What it would do</span>
          <h2 id="capability-heading">Capability versus status.</h2>
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
              <p className="ai-status-foot">Site assistant is live; receptionist is not.</p>
            </article>
            <article className="ai-status-card">
              <h3>Client provider status</h3>
              <ul className="ai-status-list">
                {CLIENT_PROVIDER_NOTES.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <p className="ai-status-foot">Provider pending — separately scoped.</p>
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