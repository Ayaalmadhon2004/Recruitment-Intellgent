import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { ActionListSkeleton, ScoreRingSkeleton } from '@/patterns';
import { Card, Skeleton, SkeletonGroup } from '@/ui';
import styles from './ScoreDetail.module.css';

const EVIDENCE_PLACEHOLDERS = 3;
const STEP_PLACEHOLDERS = 3;

/** One score area while its report is being built: back link, hero, build, evidence and steps. */
export function ScoreDetailSkeleton(): ReactNode {
  return (
    <SkeletonGroup label={en.skeleton.scoreDetail}>
      <div className={styles.root}>
        <Skeleton shape="line" width="120px" height="var(--tap-target)" />
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <Skeleton shape="line" width="120px" height="var(--text-eyebrow-size)" />
            <Skeleton shape="line" width="min(320px, 100%)" height="var(--text-h1-line)" />
          </div>
          <div className={styles.result}>
            <ScoreRingSkeleton />
            <div className={styles.resultMeta}>
              <Skeleton shape="pill" width="120px" height="var(--space-7)" />
              <Skeleton shape="pill" width="140px" height="var(--space-6)" />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <Skeleton shape="line" width="min(260px, 60%)" height="var(--text-h2-size)" />
          <Skeleton shape="line" />
          <Card radius="md">
            <Skeleton shape="block" height="120px" />
          </Card>
        </div>
        <div className={styles.section}>
          <Skeleton shape="line" width="min(220px, 50%)" height="var(--text-h2-size)" />
          <div className={styles.rows}>
            {Array.from({ length: EVIDENCE_PLACEHOLDERS }, (_, i) => (
              <Skeleton key={i} shape="block" height="64px" />
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <Skeleton shape="line" width="min(260px, 60%)" height="var(--text-h2-size)" />
          <ActionListSkeleton items={STEP_PLACEHOLDERS} />
        </div>
      </div>
    </SkeletonGroup>
  );
}
