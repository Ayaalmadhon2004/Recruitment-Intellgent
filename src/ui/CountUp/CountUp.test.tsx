import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CountUp } from './CountUp';

const reducedMotion = (reduced: boolean): void => {
  vi.stubGlobal('matchMedia', () => ({ matches: reduced }));
};

describe('CountUp', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the value on first render with no count-up', () => {
    reducedMotion(false);
    render(<CountUp value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('formats with a fixed number of decimals when given decimals instead of a function', () => {
    reducedMotion(false);
    render(<CountUp value={7} decimals={1} />);
    expect(screen.getByText('7.0')).toBeInTheDocument();
  });

  it('counts to a new value, passing through in-between numbers', () => {
    reducedMotion(false);
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const { rerender } = render(<CountUp value={0} />);
    rerender(<CountUp value={100} duration={400} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const midway = Number(document.body.textContent);
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(100);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(document.body.textContent).toBe('100');
  });

  it('jumps straight to the new value when reduced motion is on', () => {
    reducedMotion(true);
    const { rerender } = render(<CountUp value={0} />);
    rerender(<CountUp value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
