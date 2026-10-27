import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('is a labelled progressbar with a spoken value', () => {
    render(<ProgressBar value={28} max={40} label="Audit completeness" valueText="28 of 40" />);
    const bar = screen.getByRole('progressbar', { name: 'Audit completeness' });
    expect(bar).toHaveAttribute('aria-valuenow', '28');
    expect(bar).toHaveAttribute('aria-valuemax', '40');
    expect(bar).toHaveAttribute('aria-valuetext', '28 of 40');
    expect(screen.getByText('28 of 40')).toBeVisible();
  });

  it('clamps the fill between 0 and 100 percent', () => {
    const { container, rerender } = render(
      <ProgressBar value={60} max={40} label="A" valueText="x" />,
    );
    const fill = (): HTMLElement => container.querySelector('[class*="fill"]') as HTMLElement;
    expect(fill().style.width).toBe('100%');
    rerender(<ProgressBar value={-5} max={40} label="A" valueText="x" />);
    expect(fill().style.width).toBe('0%');
  });
});
