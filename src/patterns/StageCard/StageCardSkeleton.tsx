import type { ReactNode } from 'react';
import { Skeleton, StepperSkeleton } from '@/ui';
import styles from './StageCard.module.css';

export type StageCardSkeletonProps = {
  /** Number of stages, as `stages.length` of the real StageCard. */
  steps: number;
};

/** Eyebrow, headline and one node per stage. Place inside a SkeletonGroup. */
export function StageCardSkeleton({ steps }: StageCardSkeletonProps): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <Skeleton shape="line" width="120px" height="var(--text-eyebrow-size)" />
        <Skeleton shape="line" width="55%" height="var(--text-h2-size)" />
      </div>
      <StepperSkeleton steps={steps} />
    </div>
  );
}
