import { DentaCareCaseStudy } from './DentaCareCaseStudy';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'DentaCare Intake — IronWake Work',
  description: 'A portfolio demonstration of a clinic-style front-desk intake flow. Capability proof only, not a client engagement, and not a clinical or compliance service.',
  alternates: { canonical: canonicalUrl("/work/dentacare-pro") },
};

export default function DentaCareProPage() {
  return <DentaCareCaseStudy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "dentacare-pro", path: "/work/dentacare-pro" },
      ])) }} />
;
}
