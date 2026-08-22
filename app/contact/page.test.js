import { render } from '@testing-library/react';
import ContactPage from './page';
test('Contact page renders the h1', () => {
  const { getByText } = render(<ContactPage />);
  expect(getByText(/Tell us where one enquiry or booking slips/i)).toBeInTheDocument();
});
