import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { QuickStartSkeleton } from './QuickStartSkeleton';

describe('QuickStartSkeleton', () => {
  it('is one busy status with no text of its own but the label', () => {
    const { container } = render(<QuickStartSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.textContent).toBe(en.skeleton.quickStart);
  });
});
