import { MissedLeadRecoverySystem } from './MissedLeadRecoverySystem';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Missed Lead Recovery — IronWake',
  description: 'How IronWake keeps a dropped inquiry from disappearing: a durable record before any notification, bounded retries with visible failures, and a named next action instead of a missed message.',
  alternates: { canonical: canonicalUrl("/systems/missed-lead-recovery") },
};

export default function MissedLeadRecoveryPage() {
  return (
    <>
      <MissedLeadRecoverySystem />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "missed-lead-recovery", path: "/systems/missed-lead-recovery" },
            ])) }} />
    </>
  );
}
