import { render, screen, waitFor, act } from '@testing-library/react'; // Import act
import TradingView from '../src/components/trading-view';
import '@testing-library/jest-dom';
import Container from 'react-bootstrap/Container';
import React from 'react';

jest.mock('axios');

describe('This will test trading view component', () => {
  test('Show loader before fetch the data', async () => {
    render(
      <Container>
        <TradingView />
      </Container>
    );
    await waitFor(() => {
      expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Trading View')[0]).toBeInTheDocument();
    });
  });

  test('Renders trading view data correctly', async () => {
    await waitFor(async () => {
      await act(async () => {
        render(<TradingView />);
      });
    });

    await waitFor(() => {
      act(() => {
        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.getAllByText('Coin')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Price')[0]).toBeInTheDocument();
      });
    });
  });
});
