import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnimatedNumber } from './AnimatedNumber';

const reducedMotion = (reduced: boolean): void => {
  vi.stubGlobal('matchMedia', () => ({ matches: reduced }));
};

describe('AnimatedNumber', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the value on first render with no count-up', () => {
    reducedMotion(false);
    render(<AnimatedNumber value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('counts to a new value, passing through in-between numbers', () => {
    reducedMotion(false);
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const { rerender } = render(<AnimatedNumber value={0} />);
    rerender(<AnimatedNumber value={100} duration={400} />);
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
    const { rerender } = render(<AnimatedNumber value={0} />);
    rerender(<AnimatedNumber value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
