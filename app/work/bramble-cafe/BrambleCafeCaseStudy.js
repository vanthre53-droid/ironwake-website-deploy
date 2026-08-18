'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a Bramble Cafe customer.

const steps = [
  {
    num: '01',
    title: 'Reservation inquiry',
    text:
      'A visitor submits a reservation or catering inquiry, capturing their date, party size, and the contact detail the host needs to confirm.',
  },
  {
    num: '02',
    title: 'Inquiry logged',
    text:
      'The submission is written to a durable record with consent and source. A follow-up is assigned to the named host who owns that service window.',
  },
  {
    num: '03',
    title: 'Host notified',
    text:
      'The assigned host receives the inquiry with date, party size, and any dietary notes. They reply as the person who will seat the table, not as "the floor".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A host dashboard lists every inquiry by status. Anything past its confirmation window surfaces before the guest has booked the calmer cafe down the street.',
  },
];

const features = [
  [
    'Reservation capture',
    'A focused form captures date, party size, and any dietary detail the host actually needs. Anything else is opt-in, recorded with consent.',
  ],
  [
    'Named host ownership',
    'Every inquiry is routed to the host who owns that service window \u2014 not to a shared queue. The dashboard shows who is responsible and when a confirmation is due.',
  ],
  [
    'Stale-inquiry alerts',
    'Inquiries without a confirmation inside the target window are surfaced automatically. No reservation opportunity is lost to a quiet inbox.',
  ],
  [
    'Source-of-truth intake',
    'Submissions land in a structured record with date, party size, and dietary notes pre-captured. Hosts reply with full context, not a forwarded email with the table preference missing.',
  ],
];

const refuses = [
  [
    'No phantom tables',
    'Until a real reservation system is connected, this is a request-only flow. No table is ever confirmed automatically \u2014 the host confirms it on a call or a reply.',
  ],
  [
    'No fake waitlist pressure',
    'The system never invents "there are six other parties of two looking at this slot" to push a booking. Hosts earn the table by replying to the inquiry in front of them.',
  ],
  [
    'No marketing ambush',
    'The intake does not subscribe the guest to anything they did not ask for. The host\u2019s first reply is the first \u2014 and only \u2014 mandatory touch until the guest asks otherwise.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="bramble-cafe"
    name="Bramble Cafe"
    breadcrumb="Work / Bramble Cafe"
    headline="Routing reservation and catering inquiries to the host who will actually seat the table."
    standfirst="A reservation and catering demonstration for hospitality businesses, covering booking capture and follow-up ownership with no implied reservation-platform integration."
    artLabel="Abstract local visual for the Bramble Cafe demonstration"
    context="A small cafe does most of its trade on Saturday brunch and a quietly growing catering side. Saturday brunch bookings and Tuesday catering inquiries used to share one inbox \u2014 and the brunch host was reading email while the catering one was plating. The demonstration models one cafe\u2019s path from a generic inbox to a per-host intake that distinguishes the two before a host is paged at all."
    problem={{
      heading: 'Brunch bookings and catering briefs look identical in a shared inbox until someone reads to the bottom.',
      text:
        'In the modelled cafe, a Saturday brunch booking for eight lands on the same morning as a Wednesday catering brief for thirty. The brunch host reads to the second line, books the table, and only then sees the catering detail. The catering client has already sent the same brief to two other cafes.',
      symptoms: [
        'shared inbox treats a forty-cover catering brief and a brunch booking for four as the same item',
        'hosts are paged about the wrong stream on the wrong day, so both lose context',
        'dietary notes and deposit terms are buried in free text, and are remembered inconsistently',
        'no record of what was offered to which party, so the catering quote is different depending on who replies',
      ],
    }}
    approach={{
      heading: 'Separate brunch bookings from catering briefs before a host is paged.',
      text:
        'Every inquiry is captured with stream (brunch or catering), date, and party size. The intake names the host who owns that stream and that service window, and starts a confirmation clock. Stale inquiries surface before the guest has booked the calmer cafe, so drift is visible long before it becomes a lost booking.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the reservation platform, payment, and catering-pricing integrations are not connected. There is no measurement of conversion lift, response-time improvement, or revenue recovered \u2014 only that the inquiry routing structure is sound."
  />
);

export function BrambleCafeCaseStudy() {
  return CaseStudy();
}
