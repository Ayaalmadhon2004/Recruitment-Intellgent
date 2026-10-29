import type { ReactNode } from 'react';
import { Card, Skeleton } from '@/ui';
import styles from './FreeVsFull.module.css';

const COLUMNS = 2;
const ROW_PLACEHOLDERS = 4;

/** The free and full report cards, side by side. Place inside a SkeletonGroup. */
export function FreeVsFullSkeleton(): ReactNode {
  return (
    <div className={styles.section}>
      <Skeleton shape="line" width="min(360px, 80%)" height="var(--text-h2-size)" />
      <div className={styles.grid}>
        {Array.from({ length: COLUMNS }, (_, column) => (
          <Card key={column} radius="lg" className={styles.card}>
            <div className={styles.head}>
              <Skeleton shape="line" width="120px" height="var(--text-h3-size)" />
              <Skeleton shape="pill" width="64px" height="var(--space-6)" />
            </div>
            {Array.from({ length: ROW_PLACEHOLDERS }, (_, row) => (
              <Skeleton key={row} shape="line" />
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
