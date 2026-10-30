import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kite } from './Kite';
import type { KiteWings } from './Kite';

describe('Kite', () => {
  it('is decorative by default', () => {
    const { container } = render(<Kite />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('becomes an image when given a title', () => {
    const { getByRole } = render(<Kite title="Paper kite" />);
    expect(getByRole('img', { name: 'Paper kite' })).toBeInTheDocument();
  });

  it.each<[KiteWings, number]>([
    ['closed', 2],
    ['left', 1],
    ['right', 1],
    ['open', 0],
  ])('wings=%s folds %i wing(s)', (wings, folded) => {
    const { container } = render(<Kite wings={wings} />);
    expect(container.querySelector('svg')).toHaveAttribute('data-wings', wings);
    expect(container.querySelectorAll('g[class*="folded"]')).toHaveLength(folded);
  });
});
