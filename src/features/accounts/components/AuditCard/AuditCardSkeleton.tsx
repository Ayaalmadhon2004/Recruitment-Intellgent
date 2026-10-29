import type { ReactNode } from 'react';
import { Card, Skeleton } from '@/ui';
import styles from './AuditCard.module.css';

/** Ring, name, facts and the two buttons of one saved audit. Place inside a SkeletonGroup. */
export function AuditCardSkeleton(): ReactNode {
  return (
    <Card as="div" className={styles.card}>
      <div className={styles.top}>
        <Skeleton shape="circle" width="92px" />
        <div className={styles.head}>
          <Skeleton shape="line" width="140px" height="var(--text-h3-size)" />
          <Skeleton shape="pill" width="96px" height="var(--space-6)" />
        </div>
      </div>
      <div className={styles.facts}>
        <Skeleton shape="line" width="60%" />
        <Skeleton shape="line" width="70%" />
        <Skeleton shape="line" width="50%" />
      </div>
      <div className={styles.actions}>
        <Skeleton shape="pill" width="96px" height="var(--tap-target)" />
        <Skeleton shape="pill" width="96px" height="var(--tap-target)" />
      </div>
    </Card>
  );
}
