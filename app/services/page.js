import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { ServicesCatalog, serviceCatalogGroups } from './ServicesCatalog';

import { organizationLd, breadcrumbLd, serviceLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Services — IronWake',
  description:
    'Every capability IronWake designs, builds, and operates — by delivery model, by proof class, and by the work route where the capability is already exercised.',
  alternates: { canonical: canonicalUrl('/services') },
  openGraph: {
    title: 'Services — IronWake',
    description:
      'Capability catalogue. OFFERED_NOW only. No invented roadmap, no repackaged audit.',
    url: '/services',
  },
};

// ponytail: Service JSON-LD entries per OFFERED_NOW capability cluster. All
// entries resolve to the same canonical Organization id (`#organization`).
// No fabricated prices, no invented reviews, no AggregateRating.
const _servicesJsonLd = () => serviceCatalogGroups().map((group) => serviceLd({
  name: group.title,
  description: group.blurb,
  path: '/services',
  serviceType: group.label,
  areaServed: 'Worldwide',
}));

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }])) }} />
      {_servicesJsonLd().map((node, idx) => (
        <script key={`svc-${idx}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <SiteHeader />
      <ServicesCatalog />
      <SiteFooter />
    </>
  );
}
