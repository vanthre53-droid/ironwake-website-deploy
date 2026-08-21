// IronWake homepage JSON-LD. V15 §80–§97 truth contract:
// - Organization entity declares the company, NOT a single Lite diagnostic price.
// - Service catalog lists the five published offers (the Business Leak Audit
//   plus four implementation offers) without schema prices. Visible pricing
//   lives at /pricing and is the single source of truth; Offer/PriceSpecification
//   nodes are omitted here on purpose so that AI retrieval systems cannot
//   reduce IronWake to a single currency amount (the §80 regression).
// - All claims here mirror visible homepage copy and the canonical truth layer.
export const HOMEPAGE_SERVICES = Object.freeze([
  {
    '@type': 'Service',
    name: 'Business Leak Audit',
    serviceType: 'Conversion and lead-recovery diagnostic',
    description:
      'A paid diagnostic that identifies where calls, leads, bookings, and follow-ups are leaking in a service business. Tiered Lite / Standard / Pro; full pricing lives at /pricing.',
    url: 'https://ironwake.dev/audit',
  },
  {
    '@type': 'Service',
    name: 'Conversion Website',
    serviceType: 'Custom website design, build, and deployment',
    description:
      'Design, build, and deploy a custom conversion-focused website — landing pages, service sites, and customer-facing portals — owned and maintained by IronWake.',
    url: 'https://ironwake.dev/services/conversion-website',
  },
  {
    '@type': 'Service',
    name: 'AI Receptionist Deployment',
    serviceType: 'Voice and chat AI receptionist implementation',
    description:
      'Implement an IronWake-trained AI receptionist on Retell AI for inbound voice, missed-call recovery, and 24/7 call handling. Delivered as a real product, not an outsourced provider build.',
    url: 'https://ironwake.dev/services/ai-receptionist',
  },
  {
    '@type': 'Service',
    name: 'CRM & Follow-up Automation',
    serviceType: 'Lead pipeline, CRM integration, and automated follow-up',
    description:
      'Configure lead capture, CRM pipeline, and automated follow-up sequences that recover missed leads and keep conversations moving.',
    url: 'https://ironwake.dev/services/crm-follow-up',
  },
  {
    '@type': 'Service',
    name: 'Booking & Scheduling',
    serviceType: 'Booking, reservation, and dispatch automation',
    description:
      'Implement booking, reservation, and dispatch flows with calendar, payment, and CRM integration where the customer requires it.',
    url: 'https://ironwake.dev/services/booking',
  },
]);

export function getHomepageJsonLd({ canonicalOrigin = 'https://ironwake.dev' } = {}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${canonicalOrigin}#organization`,
        name: 'IronWake',
        alternateName: ['Iron Wake'],
        url: canonicalOrigin,
        logo: `${canonicalOrigin}/icon.svg`,
        description:
          'IronWake is a commercial systems company that designs, builds, and deploys custom websites, AI receptionists, booking systems, CRM and follow-up automation, and lead-recovery systems for service businesses. Based in India, serving businesses internationally.',
        knowsAbout: [
          'Custom website design and development',
          'AI receptionist implementation',
          'Missed-lead recovery',
          'CRM and follow-up automation',
          'Booking and scheduling systems',
          'Conversion optimization',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${canonicalOrigin}#website`,
        name: 'IronWake',
        url: canonicalOrigin,
        publisher: { '@id': `${canonicalOrigin}#organization` },
        inLanguage: 'en',
      },
      ...HOMEPAGE_SERVICES.map((s) => ({ ...s, provider: { '@id': `${canonicalOrigin}#organization` } })),
    ],
  };
}