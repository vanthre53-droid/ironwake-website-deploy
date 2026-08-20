import { MatthewSBarberShopLeedsUkCaseStudy } from './MatthewSBarberShopLeedsUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Matthew S Barber Shop Leeds Uk — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for matthew-s-barber-shop-leeds-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/matthew-s-barber-shop-leeds-uk") },
};

export default function MatthewSBarberShopLeedsUkCaseStudyPage() {
  return (
    <>
      <MatthewSBarberShopLeedsUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Matthew S Barber Shop Leeds Uk — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for matthew-s-barber-shop-leeds-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/matthew-s-barber-shop-leeds-uk',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Matthew S Barber Shop Leeds Uk", path: "/work/matthew-s-barber-shop-leeds-uk" }])) }} />
    </>
  );
}
