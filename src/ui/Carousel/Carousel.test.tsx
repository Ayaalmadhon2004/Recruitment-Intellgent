import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from './Carousel';

const slides = [
  { id: '1', content: 'Slide one' },
  { id: '2', content: 'Slide two' },
  { id: '3', content: 'Slide three' },
];
const labels = {
  previous: 'Previous slide',
  next: 'Next slide',
  dots: 'Slide position',
  goTo: (n: number) => `Go to slide ${n}`,
  slide: (n: number, total: number) => `${n} of ${total}`,
};

const current = (): HTMLElement => screen.getByRole('group', { name: /of 3/, hidden: false });

describe('Carousel', () => {
  it('is a labelled carousel with labelled controls and dots', () => {
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    expect(screen.getByRole('region', { name: 'Pilot plan' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(3);
  });

  it('shows only the current slide to assistive tech', () => {
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    expect(current()).toHaveTextContent('Slide one');
    expect(screen.getByText('Slide two').closest('[role="group"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('moves with the buttons and wraps around', async () => {
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(current()).toHaveTextContent('Slide two');
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(current()).toHaveTextContent('Slide three');
  });

  it('moves with the arrow keys', async () => {
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    screen.getByRole('button', { name: 'Next slide' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(current()).toHaveTextContent('Slide two');
    await userEvent.keyboard('{ArrowLeft}');
    expect(current()).toHaveTextContent('Slide one');
  });

  it('jumps with the dots', async () => {
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    expect(current()).toHaveTextContent('Slide three');
  });

  it('swipes left to go next and right to go back', () => {
    const { container } = render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    const viewport = container.querySelector('[class*="viewport"]') as HTMLElement;
    fireEvent.pointerDown(viewport, { clientX: 200 });
    fireEvent.pointerUp(viewport, { clientX: 100 });
    expect(current()).toHaveTextContent('Slide two');
    fireEvent.pointerDown(viewport, { clientX: 100 });
    fireEvent.pointerUp(viewport, { clientX: 200 });
    expect(current()).toHaveTextContent('Slide one');
  });

  it('does not autoplay', () => {
    vi.useFakeTimers();
    render(<Carousel slides={slides} label="Pilot plan" labels={labels} />);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(current()).toHaveTextContent('Slide one');
    vi.useRealTimers();
  });
});
