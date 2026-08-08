import PricingPage from './PricingPage';

export const metadata = {
  title: 'Pricing — IronWake | 5 Systems, 3 Tiers Each',
  description: 'IronWake pricing for India and international service businesses. Business Leak Audit from ₹799/$29. Missed Lead Recovery from ₹2,200/$99. Booking Certainty from ₹12,999/$199.',
  openGraph: {
    title: 'Pricing — IronWake',
    description: 'Five operational systems with Lite/Standard/Pro tiers. India and international pricing.',
    type: 'website',
    images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: 'IronWake pricing — five operational systems, three tiers each' }]
  },
};

export default function Page() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How much does IronWake cost?', acceptedAnswer: { '@type': 'Answer', text: 'Business Leak Audit starts at ₹799/$29. Missed Lead Recovery from ₹2,200/$99. Booking Certainty from ₹12,999/$199. Trust + Lead Capture from ₹12,999/$499. AI Receptionist from ₹29,999/$1,000.' }},
        { '@type': 'Question', name: 'Is there a free option?', acceptedAnswer: { '@type': 'Answer', text: 'Every engagement starts with a Business Leak Audit. The Lite tier starts at ₹799/$29.' }},
        { '@type': 'Question', name: 'What is included in each tier?', acceptedAnswer: { '@type': 'Answer', text: 'Each system has Lite, Standard, and Pro tiers. Implementation fees are one-time. Third-party provider costs are billed directly by providers.' }},
      ]
    })}} />
    <PricingPage />
  </>;
}
