'use client';

import { useState } from 'react';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const states = [
  ['requested', 'Requested', 'A visitor submits a booking request. Nothing is confirmed yet: this is a request, not a hold on a calendar.'],
  ['checking', 'Checking availability', 'The request is being checked against a provider calendar. No slot is held or promised at this stage.'],
  ['confirmed', 'Confirmed', 'Only a provider or owner confirmation moves a request here. Form submission alone can never reach this state.'],
  ['needs-alternative', 'Needs alternative', 'The requested slot could not be held, and an alternative is being sought instead of failing silently.'],
  ['provider-failed', 'Provider failed', 'The calendar provider could not be reached. This is shown honestly rather than presented as a successful booking.']
];

const after = [
  ['05 / after', 'Completed', 'The appointment happened as scheduled.'],
  ['06 / after', 'Cancelled', 'The visitor or the business cancelled the confirmed slot.'],
  ['07 / after', 'Rescheduled', 'The confirmed slot moved to a new time, tracked as a state change, not a new unrelated record.'],
  ['08 / after', 'No-show', 'The confirmed slot passed without the visitor attending.']
];

export function BookingControlSystem() {
  const [active, setActive] = useState(states[0][0]);
  const current = states.find(([id]) => id === active);
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / Booking Certainty</span><h1>A booking request and a confirmed slot are not the same state.</h1><p>This system maps the handoff from a booking request to a named next action and owner. No price, availability, or provider outcome is implied beyond what this page describes.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Step through the states</span><h2>Only a real confirmation reaches Confirmed.</h2><div role="group" aria-label="Booking states" className="stage-filter">{states.map(([id, label]) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{label}</button>)}</div><div className="disclosure-box" role="status">{current[2]}</div></section></MotionReveal>
    <MotionReveal><section className="journey"><span className="eyebrow">After a confirmation</span><h2>What a confirmed slot can become.</h2><div className="journey-grid">{after.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>Request-only until a provider is verified.</h3><p>Until a calendar provider is connected and verified, every booking on this site stays a reviewed request rather than a confirmed slot.</p></div><div className="disclosure-box"><span className="status-pill">Request-only today</span> See the same honesty standard applied on the live <a href="/book">booking request flow →</a>. No price or availability guarantee is attached to this system.</div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Review your own booking handoff.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
    <SiteFooter />
  </main>;
}
