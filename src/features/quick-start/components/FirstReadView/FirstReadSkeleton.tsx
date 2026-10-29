import type { ReactNode } from 'react';
import { stagesConfig } from '@/domain/config';
import { scoreAreaIds } from '@/domain/types';
import { ScoreCardSkeleton, StageCardSkeleton } from '@/patterns';
import { Skeleton } from '@/ui';
import styles from './FirstReadView.module.css';

/** Hero, stage, one score card per area and the call to action. Place inside a SkeletonGroup. */
export function FirstReadSkeleton(): ReactNode {
  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
          <Skeleton shape="line" width="70%" height="var(--text-h1-line)" />
          <Skeleton shape="line" />
          <Skeleton shape="line" width="80%" />
          <div className={styles.chips}>
            <Skeleton shape="pill" width="140px" height="var(--space-7)" />
            <Skeleton shape="pill" width="140px" height="var(--space-7)" />
          </div>
        </div>
        <div className={styles.heroProgress}>
          <Skeleton shape="line" width="100%" height="var(--space-3)" />
        </div>
      </div>
      <StageCardSkeleton steps={stagesConfig.stages.length} />
      <div className={styles.group}>
        <Skeleton shape="line" width="min(320px, 70%)" height="var(--text-h2-size)" />
        <div className={styles.grid}>
          {scoreAreaIds.map((id) => (
            <ScoreCardSkeleton key={id} />
          ))}
        </div>
      </div>
      <Skeleton shape="block" height="200px" />
    </div>
  );
}
