'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

const scenarios = [
  ['lost-before-seen', 'Lost before anyone sees it', 'Every inquiry is written to a durable record before any notification attempt runs. A failed email or WhatsApp send cannot erase the original record, and it stays queryable even if every downstream notification fails.'],
  ['silent-notification-failure', 'A notification fails silently', 'Notification delivery moves through a queued, processing, accepted-by-provider, and delivered state. A failure does not disappear: it moves to a dead-letter queue an operator can see and replay, instead of a status that quietly stays marked as sent.'],
  ['no-owner-no-next-step', 'No owner, no next step', 'A saved inquiry is not the same as a handled one. This system pairs each active inquiry with a task that has a due date and an owner, so having the lead and acting on it are not treated as the same fact.']
];

const steps = [
  ['01 / capture', 'Inquiry saved', 'The record is written to the database first, independent of whether any notification succeeds.'],
  ['02 / notify', 'Owner notified', 'Email and WhatsApp delivery are attempted through a queued outbox with bounded retries.'],
  ['03 / own', 'Next action assigned', 'A task with a due date keeps the inquiry from sitting unowned.'],
  ['04 / review', 'State stays honest', 'A provider acceptance is never relabelled as delivered without the actual delivery confirmation.']
];

export function MissedLeadRecoverySystem() {
  const [active, setActive] = useState(scenarios[0][0]);
  const current = scenarios.find(([id]) => id === active);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / Missed Lead Recovery</span><h1>A dropped inquiry should not disappear.</h1><p>This system captures every enquiry to a durable record before any notification runs, assigns a named owner with a due date, and logs every delivery attempt. Capability, demo status, and provider status are separated below.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Pick a way a lead usually gets lost</span><h2>See how the system responds.</h2><div role="group" aria-label="Lead-loss scenarios" className="stage-filter">{scenarios.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section></MotionReveal>
    <MotionReveal><section className="journey"><span className="eyebrow">Workflow</span><h2>What actually happens, in order.</h2><div className="journey-grid">{steps.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section">
      <span className="eyebrow">Capability vs status</span>
      <h2>What this system delivers.</h2>
      <div className="system-grid">
        <article className="system-card"><span className="micro">Capability</span><h3>Durable record + queued notification + named owner</h3><p>Inquiry persists before any send attempt. Outbox pattern with bounded retries. Each active inquiry is paired with a task that has a real due date.</p></article>
        <article className="system-card"><span className="micro">Demo status</span><h3>Operating locally today</h3><p>Local intake, validation, outbox, and dashboard render with synthetic labelled records. End-to-end UI works on this site.</p></article>
        <article className="system-card"><span className="micro">Provider status</span><h3>Provider connections pending</h3><p>Outbound email and WhatsApp delivery use queued, retried attempts. Production-scale provider monitoring, deliverability, and signed-callback verification are pending.</p></article>
        <article className="system-card"><span className="micro">Client deployment</span><h3>Ready once a verified provider is connected</h3><p>The implementation path exists; production delivery for any specific business waits for the matching email or messaging provider account to be linked and verified.</p></article>
      </div>
    </section></MotionReveal>
    <PricingReference offerId="missed-lead-recovery" />
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>See it applied to your own inquiry path.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
