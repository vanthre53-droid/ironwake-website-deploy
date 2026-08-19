import { RapidPulseCaseStudy } from './RapidPulseCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'RapidPulse Response — IronWake Work',
  description: 'A portfolio demonstration of inquiry-to-response ownership for emergency-service businesses. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/rapidpulse") },
};

export default function RapidPulsePage() {
  return (
    <>
      <RapidPulseCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'RapidPulse — capability demonstration',
              description: 'A portfolio demonstration of speed-to-first-response for an inquiry-led business. Capability proof only, not a client engagement.',
              path: '/work/rapidpulse',
              keywords: ['speed to first response, IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "rapidpulse", path: "/work/rapidpulse" },
            ])) }} />
    </>
  );
}
