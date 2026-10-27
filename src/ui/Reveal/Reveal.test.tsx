import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('always renders its children', () => {
    render(
      <Reveal delay={2}>
        <p>Entrance content</p>
      </Reveal>,
    );
    expect(screen.getByText('Entrance content')).toBeInTheDocument();
  });

  it('shows content immediately when IntersectionObserver is unavailable', () => {
    render(<Reveal>Plain</Reveal>);
    expect(screen.getByText('Plain').closest('[data-reveal]')).toHaveAttribute(
      'data-reveal',
      'visible',
    );
  });
});
