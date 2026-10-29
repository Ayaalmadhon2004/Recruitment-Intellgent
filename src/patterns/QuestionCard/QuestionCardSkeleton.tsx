import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './QuestionCard.module.css';

export type QuestionCardSkeletonProps = {
  /** Number of answer cards to hold space for (a choice question). */
  options?: number;
};

/** Badge, question text, help line and answer cards. Place inside a SkeletonGroup. */
export function QuestionCardSkeleton({ options = 4 }: QuestionCardSkeletonProps): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titleBlock}>
          <Skeleton shape="pill" width="44px" height="var(--space-7)" />
          <div className={styles.titles}>
            <Skeleton shape="line" width="min(420px, 100%)" height="var(--text-h3-size)" />
            <Skeleton shape="line" width="min(300px, 80%)" />
          </div>
        </div>
        <Skeleton shape="pill" width="88px" height="var(--space-6)" />
      </div>
      <div className={styles.radios}>
        {Array.from({ length: options }, (_, i) => (
          <Skeleton key={i} shape="block" height="64px" />
        ))}
      </div>
    </div>
  );
}
