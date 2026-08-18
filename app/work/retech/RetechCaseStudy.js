'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario, not an RE-TECH customer.

const steps = [
  {
    num: '01',
    title: 'Repair intake',
    text:
      'A customer submits a repair request, capturing device details, a short issue description, and the contact detail a technician needs to reply.',
  },
  {
    num: '02',
    title: 'Intake logged',
    text:
      'The submission is written to a durable record with consent and source. A follow-up is assigned to the named technician who covers that device class.',
  },
  {
    num: '03',
    title: 'Technician notified',
    text:
      'The assigned technician receives the intake with device, issue, and any return-window detail. They reply as the person who will bench the device, not as "the shop".',
  },
  {
    num: '04',
    title: 'Outcome visible',
    text:
      'A bench dashboard lists every intake by status. Anything past its diagnosis window surfaces before the customer has decided the device is not worth repairing.',
  },
];

const features = [
  [
    'Repair intake capture',
    'A focused form captures device class, a short issue description, and the minimum contact detail a technician needs. Anything else is opt-in, recorded with consent.',
  ],
  [
    'Named technician ownership',
    'Every intake is assigned to the technician who covers that device class \u2014 not to a shared queue. The dashboard shows who owns what and when a diagnosis is due.',
  ],
  [
    'Stale-intake alerts',
    'Intakes without a diagnosis inside the target window are surfaced automatically. No repair request is left waiting on an unowned inbox.',
  ],
  [
    'Source-of-truth intake',
    'Submissions land in a structured record with device, issue, and any return-window detail pre-captured. Technicians reply with full context rather than a forwarded email with the serial number missing.',
  ],
];

const refuses = [
  [
    'No phantom repair slots',
    'Until a real repair-platform integration is connected, this is a request-only flow. No repair slot is ever confirmed automatically \u2014 the technician confirms it on a reply.',
  ],
  [
    'No invented turnaround promises',
    'The system never promises a 24-hour turnaround it cannot substantiate. Technicians set the realistic window on the first reply, not in a marketing banner.',
  ],
  [
    'No marketing ambush',
    'The intake does not subscribe the customer to anything they did not ask for. The technician\u2019s first reply is the first \u2014 and only \u2014 mandatory touch until the customer asks otherwise.',
  ],
];

const CaseStudy = () => (
  <CaseStudyStory
    slug="retech"
    name="RE-TECH"
    breadcrumb="Work / RE-TECH"
    headline="Routing repair intakes to the technician who will actually bench the device."
    standfirst="A repair intake and tracking demonstration for service businesses, covering request capture and follow-up ownership with no implied repair-platform integration."
    artLabel="Abstract local visual for the RE-TECH demonstration"
    context="A neighbourhood repair shop handles phones, laptops, and consoles in roughly equal volume, with three technicians each specialising in one class. The demonstration models one shop\u2019s path from a shared intake inbox where a laptop ticket gets picked up by the phone technician, to a per-class intake that names the right technician before a device is bench-tested at all."
    problem={{
      heading: 'A laptop intake answered by the phone technician is a misdiagnosis before the device is even opened.',
      text:
        'In the modelled shop, a laptop ticket gets assigned to whichever technician scrolls past the inbox first. By the time the laptop specialist is reading email, the phone tech has already replied with an estimate based on a different device class. The customer is comparing two quotes from the same shop and trusting neither.',
      symptoms: [
        'a shared inbox does not know the difference between a phone, a laptop, and a console intake',
        'the first reader is rarely the right specialist, so early estimates are usually about the wrong device class',
        'serial numbers and return-window detail are buried in the email body and re-asked on the call back',
        'no record of what was promised to which customer, so technicians give different turnaround windows for the same class of repair',
      ],
    }}
    approach={{
      heading: 'Route by device class before a technician is paged, not after a reply has gone out.',
      text:
        'Every repair intake is captured with device class, a short issue description, and the minimum contact detail a technician needs. The intake names the technician who covers that class and starts a diagnosis clock. Stale intakes surface before the customer has walked the device to a competitor, so drift is visible long before it becomes a lost repair.',
    }}
    steps={steps}
    features={features}
    refuses={refuses}
    unproven="The intake pipeline is a designed demonstration; the repair-platform, parts, and pricing integrations are not connected. There is no measurement of conversion lift, turnaround-time improvement, or revenue recovered \u2014 only that the repair intake routing structure is sound."
  />
);

export function RetechCaseStudy() {
  return CaseStudy();
}
