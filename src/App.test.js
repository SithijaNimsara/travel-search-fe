import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sign In component', () => {
  render(<App />);
  const linkElement = screen.getByText(/sign in/i, { selector: '#sign-in' });
  expect(linkElement).toBeInTheDocument();
});
