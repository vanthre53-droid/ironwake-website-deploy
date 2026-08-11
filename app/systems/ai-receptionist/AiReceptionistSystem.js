'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

const principles = [
  ['01 / disclosure', 'Disclosed by default', 'Any future voice or chat assistant would identify itself as automated at the start of a conversation, not after being asked.'],
  ['02 / handoff', 'Human handoff always available', 'A caller or visitor could ask for a person at any point, and that request would be honoured rather than deflected.'],
  ['03 / no invented answers', 'No pricing or availability from memory', 'Any quoted price or availability would come from real current data, never generated from a model prompt.']
];

const transcript = [
  ['Caller', 'Hi, is this Ridgeline Plumbing?'],
  ['Assistant', 'You are speaking with an automated assistant for Ridgeline Plumbing, not a live person. I can take a message and arrange a callback. Is that okay?'],
  ['Caller', 'Sure, that works.'],
  ['Assistant', 'Could I get your name and the best number to reach you? You can also ask for a person at any time.']
];

export function AiReceptionistSystem() {
  const [showSample, setShowSample] = useState(false);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / AI Receptionist</span><h1>Plan a disclosed, human-supervised first response before connecting providers.</h1><p>This page describes the policy and handoff requirements for a future AI receptionist build. The IronWake site assistant is live and model-backed; client AI Receptionist deployments still require a separately scoped provider build per client.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Operating principles</span><h2>Requirements before any deployment.</h2><div className="system-grid">{principles.map(([label, title, text]) => <article className="system-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section">
      <span className="eyebrow">Capability vs status</span>
      <h2>What is planned, and what is not connected.</h2>
      <div className="system-grid">
        <article className="system-card"><span className="micro">Planned capability</span><h3>Disclosed first response + named handoff</h3><p>A future implementation must identify automation, provide a human handoff, and preserve an auditable escalation record. These are requirements, not current service behaviour.</p></article>
        <article className="system-card"><span className="micro">Current site status</span><h3>Site assistant is live; receptionist is not</h3><p>The IronWake website assistant (Ask IronWake) is live, model-backed, and scoped to IronWake business questions. A phone, voice, or DM receptionist is NOT connected to this site.</p></article>
        <article className="system-card"><span className="micro">Client provider status</span><h3>Client AI Receptionist requires a separate build</h3><p>No telephony, voice, messaging, or model provider is configured for client receptionist deployments. A real client deployment would require an approved provider account, a scoped model credential, a phone or messaging route, escalation coverage, and verified callback evidence before it could be described as live.</p></article>
        <article className="system-card"><span className="micro">Client deployment</span><h3>Requires a separately approved build</h3><p>Provider terms, usage limits, recording and transcription disclosure, escalation ownership, data retention, and acceptance tests must be agreed for each client before implementation or publication.</p></article>
      </div>
    </section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Illustrative only</span><h2>What a disclosed first response could sound like.</h2><button type="button" className="button secondary" aria-expanded={showSample} onClick={() => setShowSample(!showSample)}>{showSample ? 'Hide sample transcript' : 'Show sample transcript'}</button>{showSample && <div className="disclosure-box" role="region" aria-label="Illustrative sample transcript"><p><strong>ILLUSTRATIVE SAMPLE — not a real call. No live phone line is connected.</strong></p>{transcript.map(([speaker, line], index) => <p key={index}><span className="micro">{speaker}</span> {line}</p>)}</div>}</section></MotionReveal>
    <PricingReference offerId="ai-receptionist" />
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Map the reception gap before selecting a provider.</h2><a className="button" href="/audit">Request a reception workflow audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
