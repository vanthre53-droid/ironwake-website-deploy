'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a DentaCare Pro customer.
// Story arc: a private-clinic intake -> symptom capture -> consultation ownership -> review-task follow-up.

const steps = [
  {
    num: '01',
    title: 'Patient inquiry lands',
    text:
      'A visitor hits the page with a private-clinic concern. The form is short — symptom band, contact detail, and a free-text note. They are not asked to log an account or remember a reference.',
  },
  {
    num: '02',
    title: 'Inquiry logged',
    text:
      'The submission is written to a durable record with consent and source. A review-task follow-up is assigned to the named front-desk owner with a first-response window measured in hours, not days.',
  },
  {
    num: '03',
    title: 'Front-desk owner notified',
    text:
      'The named owner receives the inquiry with the full context — symptom, contact detail, note. They reply as the person responsible for the first touch, not as "the practice".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A private dashboard lists every inquiry by status. Anything past its first-response window surfaces before the caller has quietly booked elsewhere.',
  },
];

const features = [
  [
    'Symptom-banded inquiry capture',
    'A focused form captures symptom band and the minimum contact detail for the first reply. Anything else is opt-in, with consent recorded.',
  ],
  [
    'Named front-desk ownership',
    'Every inquiry is assigned to the named front-desk owner — not to a shared inbox. The dashboard names who is responsible and when a reply is due.',
  ],
  [
    'Stale-inquiry alerts',
    'Inquiries without a response inside the target window are surfaced automatically. No private-clinic lead is left waiting for a callback that "should have happened".',
  ],
  [
    'Source-of-truth intake',
    'Each submission is durable and reviewable. The follow-up task carries the same context as the form, so the front-desk owner never starts from a blank page.',
  ],
];

const refuses = [
  [
    'No clinical advice or triage',
    'The intake captures a symptom band and writes a durable record. It does not diagnose, prescribe, or triage urgency.',
  ],
  [
    'No calendar or booking system',
    'A private-clinic inquiry is not the same as a booked appointment. The demonstration does not pretend to schedule a slot or hold a clinical calendar.',
  ],
  [
    'No payments, no deposits',
    'No payment intent is created, no deposit is taken, no invoice is issued. The intake ends at a review-task follow-up owned by a named human.',
  ],
];

export function DentaCareCaseStudy() {
  return (
    <CaseStudyStory
      slug="dentacare-pro"
      name="DentaCare Intake"
      breadcrumb="Work / DentaCare Intake"
      headline="Routing a private-clinic inquiry to a named front-desk owner — before the caller books elsewhere."
      standfirst="A private-clinic intake demonstration: symptom-banded inquiry capture with named first-touch ownership and a review-task follow-up, with no clinical advice or booking system implied."
      artLabel="Abstract local visual for the DentaCare Intake demonstration"
      context="A small private-clinic practice receives inquiries where the buying signal is a single concern that does not move — a missing tooth, a chipped crown, a long-standing sensitivity. The demonstration models one practice's path from a generic contact form where every message looks the same and is replied to in arrival order, to a tier-routed intake where the named front-desk owner sees the right inquiry before the caller has booked the next practice down the road."
      problem={{
        heading: 'When every inquiry looks the same in the inbox, the urgent ones are treated like the rest.',
        text:
          'In the modelled practice, a private-clinic concern lands in the same queue as a routine checkup question. Both are replied to in arrival order. The private-clinic caller has already booked the next practice down the road before anyone reads the second paragraph.',
        symptoms: [
          'shared inbox treats a private-clinic concern and a checkup question as the same item',
          'symptom context is buried in the prose of a long email, so the front-desk often only learns the concern on the call back',
          'no record of what was promised to whom, so two front-desk shifts quote the same treatment differently in the same week',
          'after the caller has booked elsewhere, the practice has no structured reason to write back, so the lead is lost for the next concern too',
        ],
      }}
      approach={{
        heading: 'Capture the symptom band on the form, not in the follow-up call.',
        text:
          'Every private-clinic inquiry captures the symptom band and the contact detail a front-desk owner actually needs. The intake names the front-desk owner for that day and starts a first-response clock measured in hours. Stale inquiries surface before the day has moved past the brief, so drift is visible long before it becomes a lost consultation.',
      }}
      steps={steps}
      features={features}
      refuses={refuses}
      unproven="The private-clinic intake pipeline is a designed demonstration; the clinical calendar, the patient record system, and the payment integrations are not connected. There is no measurement of consultation conversion, response-time improvement, or recovered lost bookings — only that the named-first-touch ownership structure is sound."
    />
  );
}
