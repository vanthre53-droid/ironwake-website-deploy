'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

const panels = [
  ['problem', 'Problem', 'Consultation-led businesses such as salons and studios can lose momentum when follow-up after an initial enquiry is inconsistent or left to memory.'],
  ['system', 'System and walkthrough', 'The demonstration applies the trust-lead-capture system to a consultation-request form, pairing every submitted request with a logged next action instead of leaving follow-up to memory.'],
  ['limits', 'Limits and security', 'This is a portfolio demonstration only. It does not connect to a live booking calendar, payment system, or inventory platform, and no client outcome or booking volume is claimed.']
];

export function AtelierCaseStudy() {
  const [active, setActive] = useState(panels[0][0]);
  const current = panels.find(([id]) => id === active);
  return <main className="shell case-study atelier-case">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Work / Atelier Safe</span><h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1><p>A consultation-system demonstration for appointment-led businesses, covering request capture and follow-up ownership with no implied booking-provider connection.</p></section>
    <section className="section intro"><article className="case-large"><div className="case-art" aria-label="Abstract local visual for the Atelier demonstration" role="img" /><div className="case-copy"><span className="micro">Portfolio demonstration</span><h3>Atelier Safe</h3><p>Built to demonstrate consultation-request capture and follow-up ownership, not to represent a real salon or studio system.</p></div></article></section>
    <section className="section"><span className="eyebrow">Read the case</span><h2>Context, system, and limits.</h2><div role="group" aria-label="Case study sections" className="stage-filter">{panels.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>What this demonstration does not claim.</h3><p>No testimonial, metric, benchmark, or provider callback is attached to this work.</p></div><div className="disclosure-box"><span className="status-pill">Demonstration only</span> Next outcome: not applicable. This project does not represent a client relationship or a measured business result.</div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>See more demonstrations or request a review.</h2><div className="hero-actions"><a className="button" href="/work">Back to work</a><a className="button secondary" href="/audit">Request a Business Leak Audit</a></div></section>
    <SiteFooter />
  </main>;
}
