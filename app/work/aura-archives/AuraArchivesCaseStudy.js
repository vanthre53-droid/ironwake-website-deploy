'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not an Aura Archives customer.

const steps = [
  {
    num: '01',
    title: 'Bespoke inquiry',
    text:
      'A visitor submits an inquiry about a custom piece or a collection, capturing the occasion, the budget band, and the contact detail a senior advisor needs to reply.',
  },
  {
    num: '02',
    title: 'Inquiry logged',
    text:
      'The submission is written to a durable record with consent and source. A consultation follow-up is assigned to the named advisor who covers that relationship tier.',
  },
  {
    num: '03',
    title: 'Advisor notified',
    text:
      'The assigned advisor receives the inquiry with the full context \u2014 piece, occasion, budget. They reply as the person who will own the consultation, not as "the studio".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A private dashboard lists every inquiry by status. Anything past its first-response window surfaces before the client has quietly moved on.',
  },
];

const features = [
  [
    'Bespoke inquiry capture',
    'A focused form captures interest, occasion, and the minimum contact detail for the first reply. Anything else is opt-in, with consent recorded.',
  ],
  [
    'Named advisor ownership',
    'Every inquiry is assigned to the advisor who owns the relationship \u2014 not to a shared inbox. The dashboard names who is responsible and when a reply is due.',
  ],
  [
    'Stale-inquiry alerts',
    'Inquiries without a response inside the target window are surfaced automatically. No high-value lead is left waiting for a call that "should have happened".',
  ],
  [
    'Source-of-truth intake',
    'Submissions land in a structured record with budget band, occasion, and source. Advisors reply with full context, not a half-remembered email.',
  ],
];

const refuses = [
  [
    'No phantom commissions',
    'Until a real inventory and pricing record are connected, this is an inquiry-only flow. No commission is ever confirmed automatically \u2014 the advisor confirms it on a call.',
  ],
  [
    'No fabricated urgency',
    'The system never invents "another client is looking at this piece" to push a sale. Clients earn the next conversation by being answered properly on the first one.',
  ],
  [
    'No mailing-list ambush',
    'The intake does not put the client on a marketing list they did not ask for. The advisor\u2019s first reply is the first \u2014 and only \u2014 mandatory touch until the client asks otherwise.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="aura-archives"
    name="Aura Archives"
    breadcrumb="Work / Aura Archives"
    headline="Routing bespoke jewellery inquiries to a named advisor \u2014 before the occasion has passed."
    standfirst="A luxury-jewellery inquiry demonstration for high-value retail, covering bespoke-request capture and consultation ownership with no implied inventory or payment integration."
    artLabel="Abstract local visual for the Aura Archives demonstration"
    context="A small studio sells bespoke and archive pieces where the buying signal is a single wedding, anniversary, or milestone date that does not move. The demonstration models one studio\u2019s path from a generic enquiry inbox where every message looks the same, to a tier-routed intake where the right advisor sees the right inquiry before the calendar passes them by."
    problem={{
      heading: 'When every inquiry looks the same in the inbox, the urgent ones are treated like the rest.',
      text:
        'In the modelled studio, a June-2026 anniversary inquiry arrives on the same morning as a casual browser question. They are replied to in arrival order, not by occasion. The anniversary buyer\u2019s date passes before anyone reads the second paragraph.',
      symptoms: [
        'shared inbox treats a six-figure bespoke brief and a one-line question as the same item',
        'occasion and budget are buried in the prose of a long email, so the advisor often only learns the deadline on the call back',
        'no record of what was promised to whom, so two advisors quote the same archive piece differently in the same week',
        'after the date passes, the studio has no structured reason to write back, so the lead is lost for the next milestone too',
      ],
    }}
    approach={{
      heading: 'Capture the occasion on the form, not in the follow-up call.',
      text:
        'Every bespoke inquiry captures occasion, budget band, and the contact detail an advisor actually needs. The intake names the advisor who covers that relationship tier and starts a first-response clock. Stale inquiries surface before the calendar has moved past the brief, so drift is visible long before it becomes a lost sale.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the piece catalogue, pricing record, and CRM integrations are not connected. There is no measurement of close rate, average order value, or recovered lost sales \u2014 only that the bespoke inquiry ownership structure is sound."
  />
);

export function AuraArchivesCaseStudy() {
  return CaseStudy();
}
