import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TbcValue } from './TbcValue';

const PLACEHOLDER = '[TO BE CONFIRMED WITH CAPSTONE]';

describe('TbcValue', () => {
  it('renders the labelled placeholder when the value is null', () => {
    render(<TbcValue value={null} placeholder={PLACEHOLDER} />);
    const el = screen.getByText(PLACEHOLDER).closest('[data-tbc]');
    expect(el).toHaveAttribute('data-tbc', 'true');
  });

  it('shows a short chip word and keeps the full text as tooltip and screen-reader text', () => {
    const { container } = render(
      <TbcValue value={null} placeholder={PLACEHOLDER} label="Pending" />,
    );
    const chip = container.querySelector('[data-tbc="true"]');
    expect(chip).toHaveAttribute('title', PLACEHOLDER);
    expect(screen.getByText('Pending')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(PLACEHOLDER)).toHaveClass('visually-hidden');
  });

  it.each([undefined, ''])('treats %j as not confirmed', (value) => {
    render(<TbcValue value={value} placeholder={PLACEHOLDER} />);
    expect(screen.getByText(PLACEHOLDER)).toBeInTheDocument();
  });

  it('renders the value, and no placeholder, when it is confirmed', () => {
    render(<TbcValue value="+84 000" placeholder={PLACEHOLDER} />);
    expect(screen.getByText('+84 000')).toBeInTheDocument();
    expect(screen.queryByText(PLACEHOLDER)).not.toBeInTheDocument();
  });

  it('renders the number 0 as a real value, not as missing', () => {
    render(<TbcValue value={0} placeholder={PLACEHOLDER} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText(PLACEHOLDER)).not.toBeInTheDocument();
  });
});
