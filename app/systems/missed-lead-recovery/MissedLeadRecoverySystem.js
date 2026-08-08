'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

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
    <section className="hero compact"><span className="eyebrow">Systems / Missed Lead Recovery</span><h1>A dropped inquiry should not disappear.</h1><p>This system exists for one reason: to stop an inquiry from being lost between the moment it arrives and the moment a person actually acts on it. No prices, providers, or outcomes are implied beyond what this page describes.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Pick a way a lead usually gets lost</span><h2>See how the system responds.</h2><div role="group" aria-label="Lead-loss scenarios" className="stage-filter">{scenarios.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section></MotionReveal>
    <MotionReveal><section className="journey"><span className="eyebrow">Workflow</span><h2>What actually happens, in order.</h2><div className="journey-grid">{steps.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>What is verified today versus still pending.</h3><p>This page does not claim a finished product. It states what is implemented and tested against what remains in progress.</p></div><div className="disclosure-box"><p><span className="status-pill">Verified locally</span> Durable inquiry record, consent capture, and task assignment are implemented and tested.</p><p><span className="status-pill">Provider proof pending</span> Outbound email and WhatsApp delivery exist as a queued, retried attempt; production-scale delivery monitoring is not yet complete. No price or fixed response-time commitment is attached to this system.</p></div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>See it applied to your own inquiry path.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
