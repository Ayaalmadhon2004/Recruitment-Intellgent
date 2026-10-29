import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { Skeleton, SkeletonGroup } from '@/ui';
import { FreeVsFullSkeleton } from '../FreeVsFull';
import styles from './UnlockPage.module.css';

/** The Unlock page while the route loads: its hero lines and the free and full cards. */
export function UnlockPageLoading(): ReactNode {
  return (
    <PageContainer className={styles.page}>
      <SkeletonGroup label={en.skeleton.unlock}>
        <div className={styles.skeletonBody}>
          <div className={styles.hero}>
            <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
            <Skeleton shape="line" width="min(420px, 90%)" height="var(--text-h1-line)" />
            <Skeleton shape="line" width="min(520px, 100%)" />
          </div>
          <FreeVsFullSkeleton />
        </div>
      </SkeletonGroup>
    </PageContainer>
  );
}
