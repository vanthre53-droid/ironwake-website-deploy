import { JeanClaudeOlivierMumbaiInCaseStudy } from './JeanClaudeOlivierMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Jean Claude Olivier (Mumbai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Jean Claude Olivier in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/jean-claude-olivier-mumbai-in") },
};

export default function JeanClaudeOlivierMumbaiInCaseStudyPage() {
  return (
    <>
      <JeanClaudeOlivierMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Jean Claude Olivier (Mumbai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Jean Claude Olivier in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/jean-claude-olivier-mumbai-in',
              keywords: ['salon, booking, voice ai, Mumbai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Jean Claude Olivier (Mumbai)", path: "/work/jean-claude-olivier-mumbai-in" }])) }} />
    </>
  );
}
