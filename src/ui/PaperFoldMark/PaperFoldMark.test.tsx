import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaperFoldMark } from './PaperFoldMark';

describe('PaperFoldMark', () => {
  it('is hidden from assistive tech when decorative', () => {
    const { container } = render(<PaperFoldMark />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes a name when a title is given', () => {
    render(<PaperFoldMark title="Mark" />);
    expect(screen.getByRole('img', { name: 'Mark' })).toBeInTheDocument();
  });
});
