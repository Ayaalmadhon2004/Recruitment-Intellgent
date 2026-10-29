import type { ReactNode } from 'react';
import { QuestionCardSkeleton } from '@/patterns';
import { Card, Skeleton } from '@/ui';
import styles from './IntakeSection.module.css';

const QUESTION_PLACEHOLDERS = 2;

/** The section heading, its progress and the first questions. Place inside a SkeletonGroup. */
export function IntakeSectionSkeleton(): ReactNode {
  return (
    <Card as="div" radius="lg" className={styles.root}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <Skeleton shape="line" width="120px" height="var(--text-eyebrow-size)" />
          <Skeleton shape="line" width="min(320px, 100%)" height="var(--text-h2-size)" />
        </div>
        <div className={styles.progress}>
          <Skeleton shape="line" height="var(--space-3)" />
        </div>
      </div>
      <div className={styles.questions}>
        {Array.from({ length: QUESTION_PLACEHOLDERS }, (_, i) => (
          <QuestionCardSkeleton key={i} />
        ))}
      </div>
    </Card>
  );
}
