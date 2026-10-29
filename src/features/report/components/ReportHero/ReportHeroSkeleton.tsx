import type { ReactNode } from 'react';
import { RadarChartSkeleton } from '@/patterns';
import { Card, Skeleton } from '@/ui';
import { scoreAreaIds } from '@/domain/types';
import styles from './ReportHero.module.css';

/** The hero's text column and the radar card beside it. Place inside a SkeletonGroup. */
export function ReportHeroSkeleton(): ReactNode {
  return (
    <div className={styles.hero}>
      <div className={styles.text}>
        <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
        <Skeleton shape="line" width="80%" height="var(--text-h1-line)" />
        <Skeleton shape="line" />
        <Skeleton shape="line" width="70%" />
        <div className={styles.actions}>
          <Skeleton shape="pill" width="160px" />
          <Skeleton shape="pill" width="160px" />
        </div>
      </div>
      <div className={styles.aside}>
        <Card radius="lg">
          <RadarChartSkeleton axes={scoreAreaIds.length} />
        </Card>
      </div>
    </div>
  );
}
