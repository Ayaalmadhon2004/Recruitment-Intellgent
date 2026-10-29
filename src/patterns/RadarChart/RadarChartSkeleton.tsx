import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './RadarChart.module.css';

export type RadarChartSkeletonProps = {
  /** Number of areas, so the legend takes the same space as the real one. */
  axes: number;
};

/** The chart area and its legend. Place inside a SkeletonGroup. */
export function RadarChartSkeleton({ axes }: RadarChartSkeletonProps): ReactNode {
  return (
    <div className={styles.figure}>
      <Skeleton shape="circle" width="220px" />
      <div className={styles.legend}>
        {Array.from({ length: axes }, (_, i) => (
          <Skeleton key={i} shape="line" width="88px" />
        ))}
      </div>
    </div>
  );
}
