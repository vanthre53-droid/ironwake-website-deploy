'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario for Rinky Sandhal Unisex Salon (Delhi), not a real engagement.

const steps = [
  {
    num: '01',
    title: 'Salon phone rings while staff is mid-service',
    text:
      'A caller wants a booking for Rinky Sandhal Unisex Salon (Delhi). Staff cant pick up. Without capture, the caller phones the next salon on Google.',
  },
  {
    num: '02',
    title: 'AI answers with the salons own brand voice',
    text:
      'The voice agent picks up, introduces itself as Rinky Sandhal Unisex Salon (Delhi)\'s assistant, and asks which service and preferred time.',
  },
  {
    num: '03',
    title: 'Booking confirmed in WhatsApp',
    text:
      'A WhatsApp confirmation goes to the customer with the time, the stylist, and the salon address. Staff sees the new booking in the dashboard.',
  },
  {
    num: '04',
    title: 'No-shows reduced, after-hours captured',
    text:
      'A reminder 24h before. After-hours calls still get answered. Every opportunity stays in Rinky Sandhal Unisex Salon (Delhi)\'s pipeline.',
  },
];

const features = [
  ['Answers every call', 'Voice AI picks up on the first ring, in Rinky Sandhal Unisex Salon (Delhi)\'s brand voice, even when the team is busy.'],
  ['Books appointments', 'Captures service, stylist, time, and customer name into a structured record.'],
  ['Sends WhatsApp confirmation', 'Every booking is confirmed in WhatsApp with the salon details.'],
  ['Speaks Delhi local', 'Trained on UK English / Indian English accents as appropriate for Delhi.'],
  ['Handles overflow', 'When three lines ring at once, all three callers get captured — none go to voicemail.'],
  ['Remembers preferences', 'Returning customers get greeted by name and offered their last stylist.'],
  ['Captures after-hours', '10pm call? Still answered, still booked. No opportunity lost to voicemail.'],
  ['Owner dashboard', 'Every call, every booking, every missed opportunity visible in one place.'],
  ['No double-bookings', 'Real-time slot checks prevent the front desk and the AI from grabbing the same chair.'],
];

export function RinkySandhalUnisexSalonDelhiInCaseStudy() {
  return (
    <CaseStudyStory
      kicker="DEMONSTRATION"
      title="{title}"
      subtitle="A personalised voice-AI booking demo for Rinky Sandhal Unisex Salon (Delhi) in Delhi, IN."
      heroNote="Built with only public business info (name, address, phone, services). Not a client engagement. Not a measured outcome."
      steps={steps}
      features={features}
      accent="#0a0a0a"
      accentSoft="#f5f1ea"
      ctaLabel="See the live demo for Rinky Sandhal Unisex Salon (Delhi)"
      ctaHref="/work/rinky-sandhal-unisex-salon-delhi-in/demo.html"
    />
  );
}
