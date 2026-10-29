import type { CSSProperties, ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './StageCard.module.css';
import stepStyles from './StageCardSkeleton.module.css';

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
      <div className={stepStyles.steps} style={{ ['--steps' as string]: steps } as CSSProperties}>
        {Array.from({ length: steps }, (_, i) => (
          <div key={i} className={stepStyles.step}>
            <Skeleton shape="circle" width="var(--tap-target)" />
            <Skeleton shape="line" width="80%" />
          </div>
        ))}
      </div>
    </div>
  );
}
