import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Moja Biblioteka/i);
  expect(linkElement).toBeInTheDocument();
});