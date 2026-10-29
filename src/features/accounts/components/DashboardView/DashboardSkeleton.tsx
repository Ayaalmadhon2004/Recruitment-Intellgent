import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { Skeleton, SkeletonGroup } from '@/ui';
import { AuditCardSkeleton } from '../AuditCard';
import styles from './DashboardView.module.css';

const CARD_PLACEHOLDERS = 3;

/** The Dashboard while the session and saved audits load: intro, filters and a few audit cards. */
export function DashboardSkeleton(): ReactNode {
  return (
    <PageContainer className={styles.page}>
      <SkeletonGroup label={en.skeleton.dashboard}>
        <div className={styles.skeletonBody}>
          <div className={styles.intro}>
            <div className={styles.introText}>
              <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
              <Skeleton shape="line" width="min(320px, 80%)" height="var(--text-h1-line)" />
              <Skeleton shape="line" width="min(480px, 100%)" />
            </div>
            <Skeleton shape="pill" width="220px" height="var(--space-7)" />
          </div>
          <div className={styles.controls}>
            <Skeleton shape="pill" width="280px" />
            <Skeleton shape="pill" width="200px" />
          </div>
          <div className={styles.grid}>
            {Array.from({ length: CARD_PLACEHOLDERS }, (_, i) => (
              <AuditCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </SkeletonGroup>
    </PageContainer>
  );
}
