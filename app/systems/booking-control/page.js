import { Metadata } from 'next';
import { BookingControlSystem } from './BookingControlSystem';

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
  return <BookingControlSystem />;
}