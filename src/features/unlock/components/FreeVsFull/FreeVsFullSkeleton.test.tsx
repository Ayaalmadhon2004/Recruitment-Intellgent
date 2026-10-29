import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonGroup } from '@/ui';
import { FreeVsFullSkeleton } from './FreeVsFullSkeleton';

describe('FreeVsFullSkeleton', () => {
  it('draws only hidden shapes and no text', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <FreeVsFullSkeleton />
      </SkeletonGroup>,
    );
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(13);
    expect(container.textContent).toBe('Loading');
  });
});
