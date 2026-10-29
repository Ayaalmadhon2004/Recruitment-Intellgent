import type { ReactNode } from 'react';
import { ScoreCardSkeleton } from '@/patterns';
import styles from './AreaGrid.module.css';

export type AreaGridSkeletonProps = {
  /** Number of areas, as `areas.length` of the real grid. */
  areas: number;
};

/** One score card placeholder per area, in the real grid. Place inside a SkeletonGroup. */
export function AreaGridSkeleton({ areas }: AreaGridSkeletonProps): ReactNode {
  return (
    <div className={styles.grid}>
      {Array.from({ length: areas }, (_, i) => (
        <div key={i} className={styles.item}>
          <ScoreCardSkeleton />
        </div>
      ))}
    </div>
  );
}
