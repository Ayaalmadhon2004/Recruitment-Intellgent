import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonGroup } from '@/ui';
import { AuditCardSkeleton } from './AuditCardSkeleton';

describe('AuditCardSkeleton', () => {
  it('draws only hidden shapes and no text', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <AuditCardSkeleton />
      </SkeletonGroup>,
    );
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(8);
    expect(container.textContent).toBe('Loading');
  });
});
