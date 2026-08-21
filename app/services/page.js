import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { ServicesCatalog } from './ServicesCatalog';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
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

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }])) }} />
      <SiteHeader />
      <ServicesCatalog />
      <SiteFooter />
    </>
  );
}
