'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a Luxe Studio customer.

const steps = [
  {
    num: '01',
    title: 'Appointment request',
    text:
      'A visitor submits a tasting or studio appointment request, capturing their preferred date, party size, and the contact detail a host needs to confirm.',
  },
  {
    num: '02',
    title: 'Request logged',
    text:
      'The submission is written to a durable record with consent and source. A follow-up is assigned to the named host who owns that night\u2019s seating.',
  },
  {
    num: '03',
    title: 'Host notified',
    text:
      'The assigned host receives the request with date, party size, and any stated occasion. They reply as the person who will seat the booking, not as "the studio".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A host dashboard shows every request by status. Anything past its confirmation window surfaces before the guest has booked elsewhere.',
  },
];

const features = [
  [
    'Appointment capture',
    'A focused form captures preferred date, party size, and any occasion detail. Anything else is opt-in, recorded with consent.',
  ],
  [
    'Named host ownership',
    'Every request is assigned to the host who owns that night\u2019s seating. The dashboard shows who is responsible and when a confirmation is due.',
  ],
  [
    'Stale-request alerts',
    'Requests without a confirmation inside the target window are surfaced automatically. No booking opportunity is left waiting on an unowned inbox.',
  ],
  [
    'Source-of-truth intake',
    'Submissions land in a structured record with date, party size, and occasion. The host replies with full context rather than half of a forwarded email.',
  ],
];

const refuses = [
  [
    'No phantom bookings',
    'Until a real reservation system is connected, this is a request-only flow. No appointment is ever confirmed automatically \u2014 the host confirms it on a call.',
  ],
  [
    'No fake waitlist pressure',
    'The system never invents "there is another party of four looking at this slot" to push a confirmation. Hosts earn the next booking by replying properly to the one in front of them.',
  ],
  [
    'No marketing ambush',
    'The intake does not subscribe the guest to anything they did not ask for. The host\u2019s first reply is the first \u2014 and only \u2014 mandatory touch until the guest asks otherwise.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="luxe-studio"
    name="Luxe Studio"
    breadcrumb="Work / Luxe Studio"
    headline="Routing tasting-room and studio appointment requests to the host who actually seats the room."
    standfirst="A booking and studio-system demonstration for experience-led businesses, covering appointment capture and follow-up ownership with no implied booking-provider connection."
    artLabel="Abstract local visual for the Luxe Studio demonstration"
    context="An experience-led venue runs a tasting room and a private studio on the same site, with bookings that look identical in a shared inbox but mean very different things to two different hosts. The demonstration models one venue\u2019s path from a generic enquiry inbox to a per-host intake that distinguishes tasting and studio requests before either host is paged."
    problem={{
      heading: 'Tasting and studio requests are replied to in the same queue, by the same "team", for the wrong host.',
      text:
        'In the modelled venue, a studio booking for a private dinner lands in the same inbox as a casual tasting inquiry. The tasting host replies first \u2014 they happened to be at the keyboard. The studio guest waits until the studio host has logged on, and has already taken the calmer venue\u2019s confirmation.',
      symptoms: [
        'shared enquiry inboxes route a private dinner to whoever is reading email first',
        'tasting and studio bookings have no separation, so each host is paged about the wrong thing',
        'occasion and party size are buried in free text, so the host often only learns what kind of booking it is on the call back',
        'no record of what was offered to which party, so two guests get different deposit terms for the same slot',
      ],
    }}
    approach={{
      heading: 'Route by booking type before a host is paged, not after a reply has gone out.',
      text:
        'Every appointment request is captured with booking type, date, and party size. The intake names the host who owns that type and that night and starts a confirmation clock. Stale requests surface before the guest has found a calmer venue, so the team sees drift before the booking has been lost.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the booking platform, payment, and seating-plan integrations are not connected. There is no measurement of conversion lift, response-time improvement, or deposits recovered \u2014 only that the booking routing structure is sound."
  />
);

export function LuxeStudioCaseStudy() {
  return CaseStudy();
}
