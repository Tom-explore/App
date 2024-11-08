import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../pages/App';

test("affiche le message de l'API après l'appel", async () => {
  render(<App />);

  expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();

  await waitFor(() => {
    const message = screen.getByText(/Message de ta soeur :/i);
    expect(message).toBeInTheDocument();
  });
});
