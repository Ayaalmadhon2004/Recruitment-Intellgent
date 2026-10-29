import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonGroup } from '../Skeleton';
import { StepperSkeleton } from './StepperSkeleton';

describe('StepperSkeleton', () => {
  it('holds a node and a label for every step, as hidden shapes', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <StepperSkeleton steps={4} />
      </SkeletonGroup>,
    );
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(8);
    expect(container.textContent).toBe('Loading');
  });
});
