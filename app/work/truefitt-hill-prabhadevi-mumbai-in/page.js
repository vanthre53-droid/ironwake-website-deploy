import { TruefittHillPrabhadeviMumbaiInCaseStudy } from './TruefittHillPrabhadeviMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Truefitt Hill Prabhadevi Mumbai In — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for truefitt-hill-prabhadevi-mumbai-in in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/truefitt-hill-prabhadevi-mumbai-in") },
};

export default function TruefittHillPrabhadeviMumbaiInCaseStudyPage() {
  return (
    <>
      <TruefittHillPrabhadeviMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Truefitt Hill Prabhadevi Mumbai In — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for truefitt-hill-prabhadevi-mumbai-in in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/truefitt-hill-prabhadevi-mumbai-in',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Truefitt Hill Prabhadevi Mumbai In", path: "/work/truefitt-hill-prabhadevi-mumbai-in" }])) }} />
    </>
  );
}
