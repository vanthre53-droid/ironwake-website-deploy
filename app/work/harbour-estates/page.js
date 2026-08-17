import { HarbourEstatesCaseStudy } from './HarbourEstatesCaseStudy';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Harbour Estates — IronWake Work',
  description: 'A portfolio demonstration of property-inquiry routing for real-estate agencies. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/harbour-estates") },
};

export default function HarbourEstatesPage() {
  return (
    <>
      <HarbourEstatesCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "harbour-estates", path: "/work/harbour-estates" },
            ])) }} />
    </>
  );
}
