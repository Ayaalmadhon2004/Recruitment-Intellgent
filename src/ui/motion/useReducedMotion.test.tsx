import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CountUp } from '../CountUp';
import { DrawLine } from '../DrawLine';
import { Reveal } from '../Reveal';
import { useReducedMotion } from './useReducedMotion';

type Listener = () => void;

function stubMedia(reduced: boolean): { change: (next: boolean) => void } {
  let matches = reduced;
  const listeners = new Set<Listener>();
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('prefers-reduced-motion') && matches;
    },
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
  }));
  return {
    change: (next) => {
      matches = next;
      listeners.forEach((l) => l());
    },
  };
}

describe('useReducedMotion', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reports the visitor preference', () => {
    stubMedia(true);
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
    stubMedia(false);
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });

  it('follows a change while the page is open', () => {
    const media = stubMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => media.change(true));
    expect(result.current).toBe(true);
  });
});

describe('reduced motion renders final states', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('Reveal is visible with no pending (opacity 0) class', () => {
    stubMedia(true);
    render(<Reveal>Hello</Reveal>);
    const el = screen.getByText('Hello');
    expect(el).toHaveAttribute('data-reveal', 'visible');
    expect(el.className).not.toMatch(/pending|anim-up/);
  });

  it('CountUp shows its value at once, even when armed with a start number', () => {
    stubMedia(true);
    render(<CountUp value={87} from={0} />);
    expect(screen.getByText('87')).toBeInTheDocument();
  });

  it('DrawLine is fully drawn', () => {
    stubMedia(true);
    const { container } = render(
      <svg>
        <DrawLine d="M0 0 H100" />
      </svg>,
    );
    expect(container.querySelector('mask path')).toHaveAttribute('stroke-dashoffset', '0');
  });

  it('DrawLine in controlled mode draws exactly that far', () => {
    stubMedia(true);
    const { container } = render(
      <svg>
        <DrawLine d="M0 0 H100" progress={0.25} />
      </svg>,
    );
    expect(container.querySelector('mask path')).toHaveAttribute('stroke-dashoffset', '0.75');
  });
});
