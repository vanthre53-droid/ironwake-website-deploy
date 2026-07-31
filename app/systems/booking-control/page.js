import { BookingControlSystem } from './BookingControlSystem';

export const metadata = {
  title: 'Booking Certainty — IronWake',
  description: 'The requested, checking, and confirmed booking states IronWake uses, and why only a provider or owner confirmation can mark a slot confirmed.'
};

export default function BookingControlPage() {
  return <BookingControlSystem />;
}
