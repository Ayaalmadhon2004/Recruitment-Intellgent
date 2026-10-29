import type { ReactNode } from 'react';
import { Card, Skeleton } from '@/ui';
import styles from './ScoreCard.module.css';

export type ScoreCardSkeletonProps = {
  /** Ring diameter in px. Match the size the real ScoreCard's ring uses. */
  ringSize?: number;
};

/** Shapes only, so the card keeps the real card's padding and gaps. Place inside a SkeletonGroup. */
export function ScoreCardSkeleton({ ringSize = 160 }: ScoreCardSkeletonProps): ReactNode {
  return (
    <Card as="div" radius="lg" className={styles.card}>
      <Skeleton shape="circle" width={`${ringSize}px`} />
      <Skeleton shape="line" width="50%" height="var(--text-h3-size)" />
      <Skeleton shape="pill" width="120px" height="var(--space-7)" />
      <Skeleton shape="line" width="90%" />
      <Skeleton shape="line" width="70%" />
      <div className={styles.chips}>
        <Skeleton shape="pill" width="96px" height="var(--space-6)" />
        <Skeleton shape="pill" width="96px" height="var(--space-6)" />
      </div>
    </Card>
  );
}
