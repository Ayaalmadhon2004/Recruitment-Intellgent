import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';

export type ScoreRingSkeletonProps = {
  /** Ring diameter in px, as the real ScoreRing's `size`. */
  size?: number;
};

/** A ring-sized circle. Place inside a SkeletonGroup. */
export function ScoreRingSkeleton({ size = 160 }: ScoreRingSkeletonProps): ReactNode {
  return <Skeleton shape="circle" width={`${size}px`} />;
}
