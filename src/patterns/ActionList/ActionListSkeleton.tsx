import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './ActionList.module.css';

export type ActionListSkeletonProps = {
  /** Number of steps to hold space for. */
  items: number;
};

/** The numbered rail with one placeholder row per step. Place inside a SkeletonGroup. */
export function ActionListSkeleton({ items }: ActionListSkeletonProps): ReactNode {
  return (
    <div className={styles.list}>
      <div className={styles.line} />
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className={styles.item}>
          <Skeleton shape="circle" width="40px" />
          <div className={styles.body}>
            <Skeleton shape="block" height="64px" />
          </div>
        </div>
      ))}
    </div>
  );
}
