'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a Voltix customer.

const steps = [
  {
    num: '01',
    title: 'Quote request',
    text:
      'A visitor lands on a product page and submits a quote or support request, capturing product interest, urgency, and the contact detail a specialist needs to reply.',
  },
  {
    num: '02',
    title: 'Request logged',
    text:
      'The submission is written to a durable record with consent and source. A follow-up is assigned to a named specialist so nothing sits in an unowned inbox.',
  },
  {
    num: '03',
    title: 'Specialist notified',
    text:
      'The assigned specialist receives the request with full context — what was asked, where it came from, when it is due. No "I thought someone else was handling that".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A dashboard shows every request with its current status. Anything past its response window is flagged so it cannot rot in silence.',
  },
];

const features = [
  [
    'Quote capture',
    'A focused form captures product interest, urgency, and contact details — and nothing more. No silent over-collection of data the specialist will not use.',
  ],
  [
    'Named specialist ownership',
    'Every request is assigned to a real person. The dashboard shows who owns what and when it is due.',
  ],
  [
    'Stale-request alerts',
    'Requests without a response inside the target window are surfaced automatically. No inquiry goes cold without a visible reason.',
  ],
  [
    'Source of truth, not a black hole',
    'Submissions land in a structured record with consent and source. Specialists see what they need without digging through an inbox.',
  ],
];

const refuses = [
  [
    'No fake quote confirmations',
    'Until a real catalogue and pricing engine are connected, this is a request-only flow. No quote is ever confirmed without a human specialist.',
  ],
  [
    'No silent data collection',
    'The form only asks for what a specialist needs on the first reply. Anything else is opt-in, with consent recorded.',
  ],
  [
    'No automation theatre',
    'There is no "AI assistant" pretending to know the customer\u2019s situation. The specialist reads the request, then replies as a person.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="voltix"
    name="Voltix"
    breadcrumb="Work / Voltix"
    headline="Routing electronics quote requests to a named owner before they go cold."
    standfirst="An electronics quote-and-support demonstration for specialist retailers, covering inquiry capture and follow-up ownership with no implied inventory or pricing engine."
    artLabel="Abstract local visual for the Voltix demonstration"
    context="A small electronics retailer sells a focused catalogue \u2014 audio, lighting, and accessories \u2014 and every quote request that sits in a shared inbox past lunchtime is a customer who has already ordered from somewhere else. The demonstration models one tech business\u2019s recovery from that pattern."
    problem={{
      heading: 'Quote requests die in a shared inbox, and nobody notices they are dying.',
      text:
        'In the modelled business, three specialists share a generic inbox. A request arrives at 10:14, gets a placeholder reply by 11:00, and then the customer phones a competitor at 15:30 because nobody ever picked it up properly. The original email is still flagged unread.',
      symptoms: [
        'shared inboxes give every specialist plausible deniability about who owns a request',
        'urgent and casual requests look identical the moment they hit the inbox',
        'responders optimise for being quick, not for being correct, so quotes go out before specifications are confirmed',
        'no record of what was promised to whom, so customers are quoted inconsistently across the team',
      ],
    }}
    approach={{
      heading: 'Make ownership explicit on the first submission, not after it has been ignored.',
      text:
        'Every intake is written to a structured record with the source and the assigned specialist pre-filled. A response clock starts at submission, not when somebody scrolls past the email. Stale alerts surface anything that has missed its window, so the team sees drift before the customer does.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the catalogue, pricing engine, and CRM integrations are not connected. There is no measurement of conversion lift, response-time improvement, or revenue recovered \u2014 only that the workflow structure is sound."
  />
);

export function VoltixCaseStudy() {
  return CaseStudy();
}
