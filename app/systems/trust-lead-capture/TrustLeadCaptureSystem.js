'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

const captureSteps = [
  ['submit', 'Visitor submits', 'A short form asks only for what is needed to assess the request. No medical, payment, or credential fields are collected.'],
  ['validate', 'Server-side validation', 'Every field is schema-validated on the server before anything is stored. Client-side validation alone is never trusted.'],
  ['record', 'Durable record saved', 'The inquiry is written to the database as the first step, before any notification is attempted.'],
  ['consent', 'Consent logged', 'A consent record is captured with a timestamp and purpose, separate from the inquiry record itself.'],
  ['notify', 'Owner notified', 'A notification attempt is queued. The visitor sees an honest received state, not a false booked or sent state.']
];

const checklist = [
  ['01 / spam resistance', 'Hidden trap field', 'A honeypot field invisible to real visitors helps filter automated spam submissions before they reach a person.'],
  ['02 / validation', 'Server-side validation', 'Every request is schema-validated and length-bounded on the server, not only in the browser.'],
  ['03 / credentials', 'No service-role key in the browser', 'Database write access from the public form goes through a validated server endpoint. Administrative credentials never ship to the browser.']
];

export function TrustLeadCaptureSystem() {
  const [active, setActive] = useState(captureSteps[0][0]);
  const current = captureSteps.find(([id]) => id === active);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / Trust and Lead Capture</span><h1>What happens between a click and a stored record.</h1><p>This page walks through exactly what the public inquiry form does, the concrete security and integrity checks behind it, and the matching canonical offer. Capability, demo status, and provider status are listed below.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Step through the capture flow</span><h2>Five steps, in order.</h2><div role="group" aria-label="Lead capture flow steps" className="stage-filter">{captureSteps.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Trust checklist</span><h2>What is actually implemented today.</h2><div className="system-grid">{checklist.map(([label, title, text]) => <article className="system-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section">
      <span className="eyebrow">Capability vs status</span>
      <h2>What this system delivers.</h2>
      <div className="system-grid">
        <article className="system-card"><span className="micro">Capability</span><h3>Conversion-optimised intake with truth-first copy</h3><p>Public form on the service-business website. Field-minimal. Visible consent. Visible privacy note. Honest success state.</p></article>
        <article className="system-card"><span className="micro">Demo status</span><h3>Operating locally today</h3><p>The Trust + Lead Capture Starter template is wired into this site and persists valid submissions into the existing Supabase project.</p></article>
        <article className="system-card"><span className="micro">Provider status</span><h3>Supabase is the existing connected backend</h3><p>No additional provider required for the intake. Outbound notification uses the same queued, retried path as Missed Lead Recovery.</p></article>
        <article className="system-card"><span className="micro">Client deployment</span><h3>Same template, business-specific copy and styling</h3><p>Each client site receives the same intake architecture with tailored trust copy, testimonials slots (kept honest), and industry-tuned FAQ.</p></article>
      </div>
    </section></MotionReveal>
    <PricingReference offerId="trust-lead-capture" />
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Have your own lead-capture path reviewed.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
