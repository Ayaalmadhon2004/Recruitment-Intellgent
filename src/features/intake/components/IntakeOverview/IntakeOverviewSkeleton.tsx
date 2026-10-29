import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './IntakeOverview.module.css';

/** The intro text and the progress card. Place inside a SkeletonGroup. */
export function IntakeOverviewSkeleton(): ReactNode {
  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <Skeleton shape="line" width="160px" height="var(--text-eyebrow-size)" />
        <Skeleton shape="line" width="min(360px, 80%)" height="var(--text-h1-line)" />
        <Skeleton shape="line" width="min(520px, 100%)" />
        <Skeleton shape="line" width="min(420px, 80%)" />
      </div>
      <div className={styles.card}>
        <Skeleton shape="line" width="96px" height="var(--text-h1-line)" />
        <Skeleton shape="line" height="var(--space-3)" />
        <Skeleton shape="line" width="70%" />
        <div className={styles.saveRow}>
          <Skeleton shape="line" width="140px" />
          <Skeleton shape="pill" width="96px" height="var(--tap-target)" />
        </div>
      </div>
    </div>
  );
}
