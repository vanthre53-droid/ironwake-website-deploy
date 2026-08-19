import { RetechCaseStudy } from './RetechCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'RE-TECH — IronWake Work',
  description: 'A portfolio demonstration of repair intake and tracking for service businesses. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/retech") },
};

export default function RETECHPage() {
  return (
    <>
      <RetechCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Retell Retech — capability demonstration',
              description: 'A portfolio demonstration of retained-tech intake. Capability proof only, not a client engagement.',
              path: '/work/retech',
              keywords: ['tech onboarding, intake, IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "retech", path: "/work/retech" },
            ])) }} />
    </>
  );
}
