'use client';

import { CaseStudyStory } from '../../components/CaseStudyStory';

// ponytail: portfolio demonstration — designed scenario for Mudd Salon and Day Spa (Mumbai), not a real engagement.

const steps = [
  {
    num: '01',
    title: 'Salon phone rings while staff is mid-service',
    text:
      'A caller wants a booking for Mudd Salon and Day Spa (Mumbai). Staff cant pick up. Without capture, the caller phones the next salon on Google.',
  },
  {
    num: '02',
    title: 'AI answers with the salons own brand voice',
    text:
      'The voice agent picks up, introduces itself as Mudd Salon and Day Spa (Mumbai)\'s assistant, and asks which service and preferred time.',
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
      'A reminder 24h before. After-hours calls still get answered. Every opportunity stays in Mudd Salon and Day Spa (Mumbai)\'s pipeline.',
  },
];

const features = [
  ['Answers every call', 'Voice AI picks up on the first ring, in Mudd Salon and Day Spa (Mumbai)\'s brand voice, even when the team is busy.'],
  ['Books appointments', 'Captures service, stylist, time, and customer name into a structured record.'],
  ['Sends WhatsApp confirmation', 'Every booking is confirmed in WhatsApp with the salon details.'],
  ['Speaks Mumbai local', 'Trained on UK English / Indian English accents as appropriate for Mumbai.'],
  ['Handles overflow', 'When three lines ring at once, all three callers get captured — none go to voicemail.'],
  ['Remembers preferences', 'Returning customers get greeted by name and offered their last stylist.'],
  ['Captures after-hours', '10pm call? Still answered, still booked. No opportunity lost to voicemail.'],
  ['Owner dashboard', 'Every call, every booking, every missed opportunity visible in one place.'],
  ['No double-bookings', 'Real-time slot checks prevent the front desk and the AI from grabbing the same chair.'],
];

export function MuddSalonAndDaySpaMumbaiInCaseStudy() {
  return (
    <CaseStudyStory
      kicker="DEMONSTRATION"
      title="{title}"
      subtitle="A personalised voice-AI booking demo for Mudd Salon and Day Spa (Mumbai) in Mumbai, IN."
      heroNote="Built with only public business info (name, address, phone, services). Not a client engagement. Not a measured outcome."
      steps={steps}
      features={features}
      accent="#0a0a0a"
      accentSoft="#f5f1ea"
      ctaLabel="See the live demo for Mudd Salon and Day Spa (Mumbai)"
      ctaHref="/work/mudd-salon-and-day-spa-mumbai-in/demo.html"
    />
  );
}
