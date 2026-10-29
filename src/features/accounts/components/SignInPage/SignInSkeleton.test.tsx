import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { SignInSkeleton } from './SignInSkeleton';

describe('SignInSkeleton', () => {
  it('is one busy status with no text of its own but the label', () => {
    const { container } = render(<SignInSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.textContent).toBe(en.skeleton.signIn);
  });
});
