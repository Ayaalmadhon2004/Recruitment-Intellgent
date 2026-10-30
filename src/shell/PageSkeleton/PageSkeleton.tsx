import type { ReactNode } from 'react';
import { Skeleton, SkeletonGroup } from '@/ui';
import { PageContainer } from '../PageContainer';
import styles from './PageSkeleton.module.css';

export type PageSkeletonProps = {
  /** Announced once to screen readers, for example "Loading the page". Comes from `en`. */
  label: string;
};

const SECTION_PLACEHOLDERS = 2;

/** A generic page while its route loads: a hero band, then plain sections. For pages that wait for no data. */
export function PageSkeleton({ label }: PageSkeletonProps): ReactNode {
  return (
    <SkeletonGroup label={label}>
      <div className={styles.band}>
        <PageContainer>
          <div className={styles.hero}>
            <Skeleton shape="pill" width="180px" height="var(--space-6)" />
            <Skeleton shape="line" width="min(520px, 90%)" height="var(--text-h1-line)" />
            <Skeleton shape="line" width="min(640px, 100%)" />
            <Skeleton shape="pill" width="160px" height="var(--tap-target)" />
          </div>
        </PageContainer>
      </div>
      <PageContainer>
        <div className={styles.page}>
          {Array.from({ length: SECTION_PLACEHOLDERS }, (_, i) => (
            <div key={i} className={styles.section}>
              <Skeleton shape="line" width="120px" height="var(--text-eyebrow-size)" />
              <Skeleton shape="line" width="min(360px, 80%)" height="var(--text-h2-line)" />
              <Skeleton shape="line" width="min(640px, 100%)" />
              <Skeleton shape="line" width="min(560px, 90%)" />
            </div>
          ))}
        </div>
      </PageContainer>
    </SkeletonGroup>
  );
}
