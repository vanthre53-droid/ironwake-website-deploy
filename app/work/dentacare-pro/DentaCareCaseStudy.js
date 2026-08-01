'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

const panels = [
  ['problem', 'Problem', 'Dental and private-clinic front desks often juggle phone calls, walk-ins, and online requests at the same time, and a request can slip through during a busy clinical day.'],
  ['system', 'System and walkthrough', 'The demonstration applies the trust-lead-capture and booking-control systems to a clinic-style intake form: a validated submission, a durable record, and a reviewed booking request rather than an instantly confirmed slot.'],
  ['limits', 'Limits and security', 'This is an administrative reception-flow demonstration only. It does not connect to any real clinic-management, scheduling, or patient-record system, and it does not provide or claim any clinical, diagnostic, or compliance service.']
];

export function DentaCareCaseStudy() {
  const [active, setActive] = useState(panels[0][0]);
  const current = panels.find(([id]) => id === active);
  return <main className="shell case-study dentacare-case">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Work / DentaCare Intake</span><h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1><p>A clinic-style front-desk intake demonstration covering the handoff from an enquiry form to a reviewed booking request, with no live clinic-management connection and no clinical claim of any kind.</p></section>
    <section className="section intro"><article className="case-large"><div className="case-art" aria-label="Abstract local visual for the DentaCare demonstration" role="img" /><div className="case-copy"><span className="micro">Portfolio demonstration</span><h3>DentaCare Intake</h3><p>Built to demonstrate reception-flow handling, not to represent a real clinic system or clinical service.</p></div></article></section>
    <section className="section"><span className="eyebrow">Read the case</span><h2>Context, system, and limits.</h2><div role="group" aria-label="Case study sections" className="stage-filter">{panels.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>What this demonstration does not claim.</h3><p>No testimonial, metric, benchmark, or provider callback is attached to this work, and no clinical or compliance claim is made anywhere on this page.</p></div><div className="disclosure-box"><span className="status-pill">Demonstration only</span> Next outcome: not applicable. This project does not represent a client relationship or a measured business result.</div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>See more demonstrations or request a review.</h2><div className="hero-actions"><a className="button" href="/work">Back to work</a><a className="button secondary" href="/audit">Request a Business Leak Audit</a></div></section>
    <SiteFooter />
  </main>;
}
