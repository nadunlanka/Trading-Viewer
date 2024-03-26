import { render, screen } from '@testing-library/react';
import TradingView from '../src/components/trading-view';
import '@testing-library/jest-dom';
import Container from 'react-bootstrap/Container';
import React from 'react';

test('renders trading view correctly', () => {
  render(
    <Container>
      <TradingView />
    </Container>
  );
  expect(screen.getAllByText('Coins:')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Exchanges:')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Market Cap:')[0]).toBeInTheDocument();
});
