import type { ReactNode } from 'react';
import { stagesConfig } from '@/domain/config';
import { scoreAreaIds } from '@/domain/types';
import { StageCardSkeleton } from '@/patterns';
import { Skeleton } from '@/ui';
import styles from './FirstReadView.module.css';

/** Hero lines, stage, one plain row per area and the closing line. Place inside a SkeletonGroup. */
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
        <div className={styles.rows}>
          {scoreAreaIds.map((id) => (
            <div key={id} className={styles.row}>
              <Skeleton shape="circle" width="var(--space-9)" height="var(--space-9)" />
              <Skeleton shape="line" width="min(240px, 60%)" height="var(--text-h3-line)" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton shape="line" width="min(520px, 90%)" height="var(--text-h2-line)" />
    </div>
  );
}
