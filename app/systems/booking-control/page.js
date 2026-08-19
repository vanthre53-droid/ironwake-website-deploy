import { Metadata } from 'next';
import { BookingControlSystem } from './BookingControlSystem';
import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';

export const metadata = {
  title: 'Booking Certainty — IronWake Systems',
  description:
    'Booking Certainty system — separates requested slots from confirmed slots. Form submission alone can never reach the confirmed state.',
  alternates: { canonical: '/systems/booking-control' },
  openGraph: {
    title: 'Booking Certainty — IronWake',
    description:
      'A booking control system that keeps requested and confirmed slots honestly separate.',
    url: '/systems/booking-control',
  },
};

export default function BookingControlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Systems', url: '/systems' }, { name: 'Booking Certainty', url: '/systems/booking-control' }])) }} />
      <BookingControlSystem />
    </>
  );
}