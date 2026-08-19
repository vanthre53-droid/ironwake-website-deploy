import { AtelierCaseStudy } from './AtelierCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Atelier Safe — IronWake Work',
  description: 'A portfolio demonstration of consultation-request handling for appointment-led businesses. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/atelier") },
};

export default function AtelierPage() {
  return (
    <>
      <AtelierCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Atelier Safe — capability demonstration',
              description: 'A portfolio demonstration of consultation-request handling for appointment-led businesses. Capability proof only, not a client engagement.',
              path: '/work/atelier',
              keywords: ['portfolio','capability demonstration','appointment intake','IronWake'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Atelier", path: "/work/atelier" },
            ])) }} />
    </>
  );
}
