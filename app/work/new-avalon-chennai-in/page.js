import { NewAvalonChennaiInCaseStudy } from './NewAvalonChennaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'New Avalon (Chennai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for New Avalon in Chennai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/new-avalon-chennai-in") },
};

export default function NewAvalonChennaiInCaseStudyPage() {
  return (
    <>
      <NewAvalonChennaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'New Avalon (Chennai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for New Avalon in Chennai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/new-avalon-chennai-in',
              keywords: ['salon, booking, voice ai, Chennai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "New Avalon (Chennai)", path: "/work/new-avalon-chennai-in" }])) }} />
    </>
  );
}
