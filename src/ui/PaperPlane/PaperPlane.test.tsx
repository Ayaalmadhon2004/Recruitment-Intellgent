import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { plane } from '@/design/motion';
import { Button } from '../Button';
import { PaperPlaneProvider, flightPath, isInternalHref } from './PaperPlaneProvider';

const mockReducedMotion = (reduced: boolean): void => {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

describe('PaperPlane flight', () => {
  const animate = vi.fn(() => ({ finished: new Promise(() => undefined) }));
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockReducedMotion(false);
    animate.mockClear();
    Element.prototype.animate = animate as unknown as typeof Element.prototype.animate;
  });
  afterEach(() => vi.useRealTimers());

  it('sends the plane from a link button and opens the page while it is in the air', async () => {
    const navigate = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <PaperPlaneProvider navigate={navigate}>
        <Button href="/quick-start">Start</Button>
      </PaperPlaneProvider>,
    );
    await user.click(screen.getByRole('link', { name: 'Start' }));
    expect(animate).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(plane.navigateAt + 20);
    });
    expect(navigate).toHaveBeenCalledWith('/quick-start');
  });

  it('opens the page at once under reduced motion', async () => {
    mockReducedMotion(true);
    const navigate = vi.fn();
    const user = userEvent.setup();
    render(
      <PaperPlaneProvider navigate={navigate}>
        <Button href="/quick-start">Start</Button>
      </PaperPlaneProvider>,
    );
    await user.click(screen.getByRole('link', { name: 'Start' }));
    expect(animate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/quick-start');
  });

  it('leaves outside links and new-tab links to the browser', async () => {
    const navigate = vi.fn();
    const user = userEvent.setup();
    render(
      <PaperPlaneProvider navigate={navigate}>
        <Button href="https://example.org">Outside</Button>
        <Button href="/x" target="_blank">
          Tab
        </Button>
      </PaperPlaneProvider>,
    );
    await user.click(screen.getByRole('link', { name: 'Outside' }));
    await user.click(screen.getByRole('link', { name: 'Tab' }));
    expect(animate).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('keeps the plane out of the accessibility tree', () => {
    const { container } = render(<PaperPlaneProvider navigate={vi.fn()}>x</PaperPlaneProvider>);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('flight helpers', () => {
  it('tells this site apart from outside links', () => {
    expect(isInternalHref('/report')).toBe(true);
    expect(isInternalHref('//evil.example')).toBe(false);
    expect(isInternalHref('https://example.org')).toBe(false);
    expect(isInternalHref('#top')).toBe(false);
  });

  it('flies up and out past the top-right corner', () => {
    const path = flightPath({ x: 200, y: 600 }, { width: 1000, height: 800 });
    expect(path[0]).toMatchObject({ x: 200, y: 600 });
    const last = path[path.length - 1];
    expect(last?.x).toBeGreaterThan(1000);
    expect(last?.y).toBeLessThan(0);
  });
});
