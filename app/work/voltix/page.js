import { VoltixCaseStudy } from './VoltixCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Voltix — IronWake Work',
  description: 'A portfolio demonstration of quote and support-request capture for electronics businesses. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/voltix") },
};

export default function VoltixPage() {
  return (
    <>
      <VoltixCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Voltix — capability demonstration',
              description: 'A portfolio demonstration of utility-style onboarding. Capability proof only, not a client engagement.',
              path: '/work/voltix',
              keywords: ['utility onboarding, IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "voltix", path: "/work/voltix" },
            ])) }} />
    </>
  );
}
