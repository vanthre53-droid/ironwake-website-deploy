'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not a Harbour Estates customer.

const steps = [
  {
    num: '01',
    title: 'Property inquiry',
    text:
      'A visitor lands on a listing and submits an inquiry, capturing their contact detail, budget range, and the viewing slots that actually work for them.',
  },
  {
    num: '02',
    title: 'Inquiry logged',
    text:
      'The submission is written to a durable record with consent and source. A viewing follow-up is assigned to the named agent who covers that postcode.',
  },
  {
    num: '03',
    title: 'Agent notified',
    text:
      'The assigned agent receives the inquiry with the full context \u2014 listing, budget, preferred slots. They reply as the person responsible, not as "the team".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A dashboard lists every inquiry by status. Anything past its first-response window surfaces before the prospect has stopped expecting a call.',
  },
];

const features = [
  [
    'Listing inquiry capture',
    'A focused form captures interest, budget range, and preferred viewing slots \u2014 and nothing more. No silent over-collection of data the agent will not use on the first call.',
  ],
  [
    'Named agent ownership',
    'Every inquiry is routed to the agent who owns that patch, not to a shared queue. The dashboard names who owns what and when it is due.',
  ],
  [
    'Stale-inquiry alerts',
    'Inquiries without a response inside the target window are surfaced automatically. No prospect is left waiting for a call that "should have happened".',
  ],
  [
    'Source-of-truth intake',
    'Submissions land in a structured record with consent, source, and viewing preference recorded. The agent replies with full context, not a half-remembered email.',
  ],
];

const refuses = [
  [
    'No phantom viewings',
    'Until a real calendar provider is connected, this is a request-only flow. No viewing is ever confirmed automatically \u2014 the agent books it on a call.',
  ],
  [
    'No "we have ten other buyers on this" theatre',
    'The system never invents urgency to push a viewing. Agents earn the next conversation by replying to the one in front of them.',
  ],
  [
    'No duplicate contact',
    'The intake does not subscribe the prospect to anything they did not ask for. The first response is the first \u2014 and only \u2014 mandatory touch until the prospect replies.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="harbour-estates"
    name="Harbour Estates"
    breadcrumb="Work / Harbour Estates"
    headline="Routing property inquiries to the named agent \u2014 before the prospect forgets who they emailed."
    standfirst="A property-inquiry demonstration for estate agencies, covering lead capture and viewing-request ownership with no implied CRM or portal integration."
    artLabel="Abstract local visual for the Harbour Estates demonstration"
    context="A two-branch agency sells waterfront stock where interest spikes on tide-change photographs and cools by the following Monday. The demonstration models one branch\u2019s path from a shared inbox with an unanswered weekend back-of-catalogue message to a named-owner intake that survives the long weekend."
    problem={{
      heading: 'Hot enquiries cool while three agents assume someone else is replying.',
      text:
        'In the modelled branch, a buyer emails about a listing on Saturday morning. By Monday two agents have skimmed it; neither has replied. The buyer has already booked a viewing with the competitor who confirmed within the hour.',
      symptoms: [
        'shared enquiry inboxes make "someone will reply" the default and nobody the owner',
        'hot leads and casual enquiries queue behind each other in the same inbox',
        'viewing slot preferences are captured in free text and then forgotten on the call back',
        'no record of who promised what, so agents quote the same listing differently on the same day',
      ],
    }}
    approach={{
      heading: 'Attach a human owner to a listing inquiry the moment it lands.',
      text:
        'Every enquiry is written to a structured record with source, budget, and viewing preference pre-captured. The intake names the covering agent and starts a first-response clock. Stale enquiries surface before the buyer has stopped expecting a reply, so the team sees drift before the prospect does.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the property CRM, calendar, and portal integrations are not connected. There is no measurement of viewing conversion, response-time improvement, or pipeline recovered \u2014 only that the inquiry ownership structure is sound."
  />
);

export function HarbourEstatesCaseStudy() {
  return CaseStudy();
}
