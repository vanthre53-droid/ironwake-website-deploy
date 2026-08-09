'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

const scenarios = [
  ['lost-before-seen', 'Lost before anyone sees it', 'Every inquiry is written to a durable record before any notification attempt runs. A failed email or WhatsApp send cannot erase the original record, and it stays queryable even if every downstream notification fails.'],
  ['silent-notification-failure', 'A notification fails silently', 'The local notification design distinguishes queued, processing, provider-accepted, and delivered states. No delivery is currently claimed: email and messaging providers are unconfigured, and a failed provider path stays visible rather than becoming a false sent state.'],
  ['no-owner-no-next-step', 'No next step', 'A saved inquiry is not the same as a handled one. The current intake creates a review task and a due date; assignment and escalation remain separate unfinished capabilities.']
];

const steps = [
  ['01 / capture', 'Inquiry saved', 'The record is written to the database first, independent of whether any notification succeeds.'],
  ['02 / notify', 'Notification intent queued', 'A future configured provider may process a queued outbox with bounded retries. No email or WhatsApp delivery is currently claimed.'],
  ['03 / own', 'Next action recorded', 'A task with a due date keeps the next review visible; a named assignee is not yet implemented.'],
  ['04 / review', 'State stays honest', 'A provider acceptance is never relabelled as delivered without the actual delivery confirmation.']
];

export function MissedLeadRecoverySystem() {
  const [active, setActive] = useState(scenarios[0][0]);
  const current = scenarios.find(([id]) => id === active);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / Missed Lead Recovery</span><h1>A dropped inquiry should not disappear.</h1><p>This system captures every enquiry to a durable record before any notification runs and records a review task with a due date. Provider delivery, named assignment, and escalation are separately disclosed below.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Pick a way a lead usually gets lost</span><h2>See how the system responds.</h2><div role="group" aria-label="Lead-loss scenarios" className="stage-filter">{scenarios.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section></MotionReveal>
    <MotionReveal><section className="journey"><span className="eyebrow">Workflow</span><h2>What actually happens, in order.</h2><div className="journey-grid">{steps.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section">
      <span className="eyebrow">Capability vs status</span>
      <h2>What this system delivers.</h2>
      <div className="system-grid">
        <article className="system-card"><span className="micro">Implemented foundation</span><h3>Durable record + review task</h3><p>An inquiry persists before a send attempt, and the current database records a next action and due date. This does not prove a named assignee or a completed follow-up.</p></article>
        <article className="system-card"><span className="micro">Current site status</span><h3>Request intake is proven; private operations are not fully deployed</h3><p>The public request path creates a durable record. Owner dashboard updates and provider workflows remain local changes pending deployment and authorised interaction evidence.</p></article>
        <article className="system-card"><span className="micro">Provider status</span><h3>Email and messaging delivery are unconfigured</h3><p>The outbox and retry contracts are local code only. No email, WhatsApp message, provider acceptance, delivery callback, or deliverability claim is made.</p></article>
        <article className="system-card"><span className="micro">Client deployment</span><h3>Requires provider setup and operational evidence</h3><p>A client workflow needs approved provider terms, a configured account, consent rules, assignment/escalation ownership, and verified callback evidence before it can be described as operational.</p></article>
      </div>
    </section></MotionReveal>
    <PricingReference offerId="missed-lead-recovery" />
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>See it applied to your own inquiry path.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
