import type { ReactNode } from 'react';
import { questionsConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { FlowShellSkeleton, QuestionCardSkeleton } from '@/patterns';
import { Skeleton, SkeletonGroup } from '@/ui';
import styles from './QuickStartFlow.module.css';

const stepCount = questionsConfig.filter((q) => q.quickStart).length;

/** The Quick Start page while it loads: intro, stepper, the first question and the next button. */
export function QuickStartSkeleton(): ReactNode {
  return (
    <div className={styles.root}>
      <SkeletonGroup label={en.skeleton.quickStart}>
        <div className={styles.skeletonBody}>
          <div className={styles.intro}>
            <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
            <Skeleton shape="line" width="min(480px, 90%)" height="var(--text-h1-line)" />
            <Skeleton shape="line" width="min(640px, 100%)" />
          </div>
          <FlowShellSkeleton steps={stepCount}>
            <QuestionCardSkeleton />
          </FlowShellSkeleton>
        </div>
      </SkeletonGroup>
    </div>
  );
}
