import PricingPage from './PricingPage';
import { dualLitePrice, litePriceSummary } from '../../lib/pricing.mjs';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
const auditLitePrice = dualLitePrice('business-leak-audit', '/');

export const metadata = {
  title: 'Pricing — IronWake | 5 Systems, 3 Tiers Each',
  description: `IronWake pricing for India and international service businesses. ${litePriceSummary()}.`,
  openGraph: {
    title: 'Pricing — IronWake',
    description: 'Five operational systems with Lite/Standard/Pro tiers. India and international pricing.',
    type: 'website',
    url: './',
    images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: 'IronWake pricing — five operational systems, three tiers each' }]
  },
  alternates: { canonical: canonicalUrl("/pricing") },
};

export default function Page() {
  return <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How much does IronWake cost?', acceptedAnswer: { '@type': 'Answer', text: litePriceSummary() }},
        { '@type': 'Question', name: 'Is there a free option?', acceptedAnswer: { '@type': 'Answer', text: `Every engagement starts with a Business Leak Audit. The Lite tier starts at ${auditLitePrice}.` }},
        { '@type': 'Question', name: 'What is included in each tier?', acceptedAnswer: { '@type': 'Answer', text: 'Each system has Lite, Standard, and Pro tiers. Implementation fees are one-time. Third-party provider costs are billed directly by providers.' }},
      ]
    })}} />
    <PricingPage />
  </>;
}
