'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

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
    <section className="hero compact"><span className="eyebrow">Systems / AI Receptionist — Concept</span><h1>A disclosed, human-supervised first response, not a live line yet.</h1><p>This category is a concept under active scoping. <span className="status-pill">Not yet connected</span> No phone number, voice provider, or pricing is attached to it, and nothing on this page represents a real call.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Operating principles</span><h2>What any future version would commit to.</h2><div className="system-grid">{principles.map(([label, title, text]) => <article className="system-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Illustrative only</span><h2>What a disclosed first response could sound like.</h2><button type="button" className="button secondary" aria-expanded={showSample} onClick={() => setShowSample(!showSample)}>{showSample ? 'Hide sample transcript' : 'Show sample transcript'}</button>{showSample && <div className="disclosure-box" role="region" aria-label="Illustrative sample transcript"><p><strong>ILLUSTRATIVE SAMPLE — not a real call. No live phone line is connected.</strong></p>{transcript.map(([speaker, line], index) => <p key={index}><span className="micro">{speaker}</span> {line}</p>)}</div>}</section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">What is real today</span><h3>No live call, no live pricing, no connected number.</h3><p>This page describes a concept, not a shipped product.</p></div><div className="disclosure-box">No phone number is connected to this concept page. No AI voice or chat model handles a live call or conversation for IronWake or any client through this page. A future pilot would need explicit approval, a disclosed recording and transcription policy, and a verified human escalation path before a single real conversation is handled.</div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Tell us about your reception gap.</h2><a className="button" href="/audit">Talk to us about this concept</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
