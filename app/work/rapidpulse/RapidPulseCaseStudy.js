'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a RapidPulse Response customer.
// Story arc: a 24/7 trade-response inquiry capture -> first-touch ownership -> review-task follow-up -> next action.

const steps = [
  {
    num: '01',
    title: 'Trade inquiry lands',
    text:
      'A visitor hits the page with a burst pipe at 11pm on a Saturday. The form is short — service, address band, contact detail. They are not asked to log an account or remember a reference.',
  },
  {
    num: '02',
    title: 'Inquiry logged',
    text:
      'The submission is written to a durable record with consent and source. A review-task follow-up is assigned to the on-call owner with a first-response window measured in minutes, not days.',
  },
  {
    num: '03',
    title: 'On-call owner notified',
    text:
      'The named on-call owner receives the inquiry with the full context — service, address, contact detail. They reply as the person responsible for the first touch, not as "the office".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A private dashboard lists every inquiry by status. Anything past its first-response window surfaces before the caller has quietly dialled a competitor.',
  },
];

const features = [
  [
    'After-hours inquiry capture',
    'A focused form captures service, location band, and the minimum contact detail for the first reply. Anything else is opt-in, with consent recorded.',
  ],
  [
    'Named on-call ownership',
    'Every after-hours inquiry is assigned to the named on-call owner — not to a shared inbox. The dashboard names who is responsible and when a reply is due.',
  ],
  [
    'Stale-inquiry alerts',
    'Inquiries without a response inside the target window are surfaced automatically. No late-night lead is left waiting for a callback that "should have happened".',
  ],
  [
    'Source-of-truth intake',
    'Each submission is durable and reviewable. The follow-up task carries the same context as the form, so the on-call owner never starts from a blank page.',
  ],
];

const refuses = [
  [
    'No live telephony or SMS provider',
    'The intake captures the inquiry and writes a durable record. It does not place a call, send an SMS, or escalate to a live answering service.',
  ],
  [
    'No calendar or booking system',
    'A trade inquiry is not the same as a booked visit. The demonstration does not pretend to schedule a slot or hold a calendar window.',
  ],
  [
    'No payments, no deposits',
    'No payment intent is created, no deposit is taken, no invoice is issued. The intake ends at a review-task follow-up owned by a named human.',
  ],
];

export function RapidPulseCaseStudy() {
  return (
    <CaseStudyStory
      slug="rapidpulse"
      name="RapidPulse Response"
      breadcrumb="Work / RapidPulse Response"
      headline="Routing a late-night trade call to a named on-call owner — before the caller dials a competitor."
      standfirst="A 24/7 trade-response demonstration: after-hours inquiry capture with named first-touch ownership and a review-task follow-up, with no live telephony or payment integration implied."
      artLabel="Abstract local visual for the RapidPulse Response demonstration"
      context="A small emergency-trade firm takes after-hours calls that decide whether a Saturday-night pipe or panel failure goes to them or to the next name on Google. The demonstration models one firm's path from a voicemail-style inbox where every inquiry looks identical and is answered in the morning, to a tier-routed intake where the right on-call owner sees the right inquiry before the caller has dialled anyone else."
      problem={{
        heading: 'When the on-call inbox is the same shape as the morning inbox, the urgent ones wait their turn.',
        text:
          'In the modelled firm, an 11pm burst-pipe inquiry lands in the same queue as a Monday-morning quote request. Both are answered in the morning in arrival order. The burst-pipe caller has already dialled a competitor before the office opens, because nothing in the inbox signalled that the message was time-critical.',
        symptoms: [
          'shared inbox treats an after-hours burst-pipe call and a quote request as the same item',
          'time-critical context is buried in the prose of a long voicemail, so the morning reply only learns the urgency on a callback',
          'no record of what was promised to whom, so two on-call shifts quote the same job differently in the same weekend',
          'after the caller has gone elsewhere, the firm has no structured reason to write back, so the lead is lost for the next job too',
        ],
      }}
      approach={{
        heading: 'Capture urgency on the form, not in the morning triage call.',
        text:
          'Every after-hours inquiry captures the service, the address band, and the contact detail an on-call owner actually needs. The intake names the on-call owner for that shift and starts a first-response clock measured in minutes. Stale inquiries surface before the morning meeting has begun, so drift is visible long before it becomes a lost job.',
      }}
      steps={steps}
      features={features}
      refuses={refuses}
      unproven="The after-hours intake pipeline is a designed demonstration; the on-call rota, the SMS provider, and the CRM integrations are not connected. There is no measurement of response-time improvement, weekend close rate, or recovered lost jobs — only that the named-first-touch ownership structure is sound."
    />
  );
}
