import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { strategyCopy } from '@/design/ui-copy';
import { scoringConfig } from '@/domain/config';
import { PriceBandLine } from './PriceBandLine';

const bands = scoringConfig.priceBands;

describe('PriceBandLine', () => {
  it('shows both ends of the band with their numbers and the expected value', () => {
    render(<PriceBandLine bands={bands} current="20-30k" net={25000} />);
    const group = screen.getByRole('group', {
      name: 'Where your net price sits in the $20-30k band',
    });
    expect(group).toHaveTextContent('$20,000');
    expect(group).toHaveTextContent('$30,000');
    expect(group).toHaveTextContent(`${strategyCopy.priceExpected}$25,000`);
  });

  it('shows an open top end in words, not as a number', () => {
    render(<PriceBandLine bands={bands} current="50k-plus" net={52000} />);
    const group = screen.getByTestId('price-band');
    expect(group).toHaveTextContent('$50,000');
    expect(group).toHaveTextContent(strategyCopy.priceOpenEnd);
    expect(group).toHaveTextContent('$52,000');
  });

  it('opens the details bubble from a real button', async () => {
    const user = userEvent.setup();
    render(<PriceBandLine bands={bands} current="30-40k" net={37000} />);
    const button = screen.getByRole('button', { name: strategyCopy.priceDetailsLabel });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: strategyCopy.priceDetailsLabel })).toBeVisible();
  });
});
