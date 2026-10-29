import type { ReactNode } from 'react';
import { Skeleton, SkeletonGroup } from '@/ui';
import { PageContainer } from '../PageContainer';
import styles from './PageSkeleton.module.css';

export type PageSkeletonProps = {
  /** Announced once to screen readers, for example "Loading the page". Comes from `en`. */
  label: string;
};

const CARD_PLACEHOLDERS = 3;

/** A generic page while its route loads: an intro and a row of cards. For pages that wait for no data. */
export function PageSkeleton({ label }: PageSkeletonProps): ReactNode {
  return (
    <PageContainer>
      <SkeletonGroup label={label}>
        <div className={styles.page}>
          <div className={styles.intro}>
            <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
            <Skeleton shape="line" width="min(480px, 90%)" height="var(--text-h1-line)" />
            <Skeleton shape="line" width="min(640px, 100%)" />
          </div>
          <div className={styles.grid}>
            {Array.from({ length: CARD_PLACEHOLDERS }, (_, i) => (
              <Skeleton key={i} shape="block" height="240px" />
            ))}
          </div>
        </div>
      </SkeletonGroup>
    </PageContainer>
  );
}
