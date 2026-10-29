import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { Card, Skeleton, SkeletonGroup, StepperSkeleton } from '@/ui';
import styles from './SignInPage.module.css';

const STEPS = 3;

/** The sign in page's column while the route loads: intro, steps and the email card. */
export function SignInSkeleton(): ReactNode {
  return (
    <PageContainer className={styles.page}>
      <div className={styles.column}>
        <SkeletonGroup label={en.skeleton.signIn}>
          <div className={styles.skeletonBody}>
            <div className={styles.intro}>
              <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
              <Skeleton shape="line" width="min(360px, 90%)" height="var(--text-h1-line)" />
              <Skeleton shape="line" width="min(420px, 100%)" />
            </div>
            <StepperSkeleton steps={STEPS} />
            <Card radius="lg" className={styles.card}>
              <Skeleton shape="line" width="80px" />
              <Skeleton shape="block" height="var(--space-9)" />
              <Skeleton shape="pill" height="var(--space-9)" />
            </Card>
          </div>
        </SkeletonGroup>
      </div>
    </PageContainer>
  );
}
