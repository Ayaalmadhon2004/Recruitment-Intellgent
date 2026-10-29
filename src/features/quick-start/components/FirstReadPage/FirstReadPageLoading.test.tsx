import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { FirstReadPage } from './FirstReadPage';
import { FirstReadPageLoading } from './FirstReadPageLoading';

describe('FirstReadPage loading', () => {
  it('the loading frame is one busy status with no text of its own but the label', () => {
    const { container } = render(<FirstReadPageLoading />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.textContent).toBe(en.skeleton.firstRead);
  });

  it('shows that skeleton, not a heading, while loading', () => {
    render(<FirstReadPage previewState="loading" />);
    expect(screen.getByRole('status')).toHaveTextContent(en.skeleton.firstRead);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
