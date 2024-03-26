import { render, screen, waitFor } from '@testing-library/react';
import TradingView from '../src/components/trading-view';
import '@testing-library/jest-dom';
import Container from 'react-bootstrap/Container';
import React from 'react';

jest.mock('axios');

describe('This will test trading view component', () => {
  test('Show loader before fetch the data', () => {
    render(
      <Container>
        <TradingView />
      </Container>
    );
    expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Trading View')[0]).toBeInTheDocument();
  });

  test('Renders trading view data correctly', async () => {
    render(<TradingView />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the data to be fetched and the loading text to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Assert that the rendered data is correct
    expect(screen.getAllByText('Coin')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Price')[0]).toBeInTheDocument();
  });
});
