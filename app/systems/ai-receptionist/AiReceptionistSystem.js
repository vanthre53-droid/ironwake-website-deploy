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
    <section className="hero compact"><span className="eyebrow">Systems / AI Receptionist</span><h1>A disclosed, human-supervised first response — built and ready for the provider layer.</h1><p>This is a standard IronWake implementation offer. The intake, disclosure, handoff, and audit-ready call log are built. Live telephony, voice synthesis, and messaging provider accounts are the specific provider-dependent parts that are not currently live on this demonstration.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Operating principles</span><h2>What any deployment commits to.</h2><div className="system-grid">{principles.map(([label, title, text]) => <article className="system-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section">
      <span className="eyebrow">Capability vs status</span>
      <h2>What this system delivers.</h2>
      <div className="system-grid">
        <article className="system-card"><span className="micro">Capability</span><h3>Disclosed first response + named handoff + audit log</h3><p>Every interaction opens by identifying itself as automated. Every visitor can request a human. Every escalation is logged with a verifiable handoff time.</p></article>
        <article className="system-card"><span className="micro">Demo status</span><h3>Operating locally today</h3><p>The text-based disclosure, handoff flow, and reviewed intake work end to end on this site. The chatbot in the corner demonstrates the same disclosure and handoff logic.</p></article>
        <article className="system-card"><span className="micro">Provider status</span><h3>Telephony, voice, and messaging providers pending</h3><p>Production voice synthesis and telephony routing require a verified Twilio, Exotel, or similar provider account plus a model API key. The implementation is ready; the wiring is a one-week provider-onboarding step.</p></article>
        <article className="system-card"><span className="micro">Client deployment</span><h3>Provider-dependent live state per client</h3><p>Each client deployment opens with the provider-onboarding checklist: voice minutes quota, phone number, model key, escalation roster, recording and transcription disclosure copy.</p></article>
      </div>
    </section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Illustrative only</span><h2>What a disclosed first response could sound like.</h2><button type="button" className="button secondary" aria-expanded={showSample} onClick={() => setShowSample(!showSample)}>{showSample ? 'Hide sample transcript' : 'Show sample transcript'}</button>{showSample && <div className="disclosure-box" role="region" aria-label="Illustrative sample transcript"><p><strong>ILLUSTRATIVE SAMPLE — not a real call. No live phone line is connected.</strong></p>{transcript.map(([speaker, line], index) => <p key={index}><span className="micro">{speaker}</span> {line}</p>)}</div>}</section></MotionReveal>
    <PricingReference offerId="ai-receptionist" />
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Tell us about your reception gap.</h2><a className="button" href="/audit">Start with the AI Receptionist Starter</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
