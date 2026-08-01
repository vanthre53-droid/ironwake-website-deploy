'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

const panels = [
  ['problem', 'Problem', 'Emergency-service businesses can lose their highest-value leads when a call or form goes unanswered during an active job. This demonstration explores what a durable, ownership-first response looks like in that context.'],
  ['system', 'System and walkthrough', 'The demonstration applies the missed-lead-recovery and booking-control systems: an inquiry is saved first, a notification is attempted through a queued outbox, and a task is assigned to a named owner instead of sitting in a shared inbox.'],
  ['limits', 'Limits and security', 'This is a portfolio demonstration, not a connected dispatch system. It does not integrate with a real telephony, dispatch, or CRM platform, and no response-time, conversion, or revenue figure is attached to it.']
];

export function RapidPulseCaseStudy() {
  const [active, setActive] = useState(panels[0][0]);
  const current = panels.find(([id]) => id === active);
  return <main className="shell case-study rapidpulse-case">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Work / RapidPulse Response</span><h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1><p>An emergency-service workflow demonstration focused on inquiry-to-response ownership: who owns the next action once a request arrives, independent of any single channel.</p></section>
    <section className="section intro"><article className="case-large"><div className="case-art" aria-label="Abstract local visual for the RapidPulse demonstration" role="img" /><div className="case-copy"><span className="micro">Portfolio demonstration</span><h3>RapidPulse Response</h3><p>Built to demonstrate durable-record and ownership handling, not to represent a real dispatch or telephony integration.</p></div></article></section>
    <section className="section"><span className="eyebrow">Read the case</span><h2>Context, system, and limits.</h2><div role="group" aria-label="Case study sections" className="stage-filter">{panels.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>What this demonstration does not claim.</h3><p>No testimonial, metric, benchmark, or provider callback is attached to this work.</p></div><div className="disclosure-box"><span className="status-pill">Demonstration only</span> Next outcome: not applicable. This project does not represent a client relationship or a measured business result.</div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>See more demonstrations or request a review.</h2><div className="hero-actions"><a className="button" href="/work">Back to work</a><a className="button secondary" href="/audit">Request a Business Leak Audit</a></div></section>
    <SiteFooter />
  </main>;
}
