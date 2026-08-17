import { BookingControlSystem } from './BookingControlSystem';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Booking Certainty — IronWake',
  description: 'The requested, checking, and confirmed booking states IronWake uses, and why only a provider or owner confirmation can mark a slot confirmed.',
  alternates: { canonical: canonicalUrl("/systems/booking-control") },
};

export default function BookingControlPage() {
  return <BookingControlSystem />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "booking-control", path: "/systems/booking-control" },
      ])) }} />
;
}
