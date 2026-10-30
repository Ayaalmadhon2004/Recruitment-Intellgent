import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('is a labelled progressbar with a spoken value', () => {
    render(<ProgressBar value={18} max={24} label="Audit completeness" valueText="18 of 24" />);
    const bar = screen.getByRole('progressbar', { name: 'Audit completeness' });
    expect(bar).toHaveAttribute('aria-valuenow', '18');
    expect(bar).toHaveAttribute('aria-valuemax', '24');
    expect(bar).toHaveAttribute('aria-valuetext', '18 of 24');
    expect(screen.getByText('18 of 24')).toBeVisible();
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
