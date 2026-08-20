import { MuddSalonAndDaySpaMumbaiInCaseStudy } from './MuddSalonAndDaySpaMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Mudd Salon and Day Spa (Mumbai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Mudd Salon and Day Spa in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/mudd-salon-and-day-spa-mumbai-in") },
};

export default function MuddSalonAndDaySpaMumbaiInCaseStudyPage() {
  return (
    <>
      <MuddSalonAndDaySpaMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Mudd Salon and Day Spa (Mumbai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Mudd Salon and Day Spa in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/mudd-salon-and-day-spa-mumbai-in',
              keywords: ['salon, booking, voice ai, Mumbai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Mudd Salon and Day Spa (Mumbai)", path: "/work/mudd-salon-and-day-spa-mumbai-in" }])) }} />
    </>
  );
}
