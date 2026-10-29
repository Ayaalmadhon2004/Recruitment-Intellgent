import type { ReactNode } from 'react';
import { Skeleton, StepperSkeleton } from '@/ui';
import styles from './FlowShell.module.css';

export type FlowShellSkeletonProps = {
  /** Number of steps, as `steps.length` of the real FlowShell. */
  steps: number;
  /** The first step's placeholder, for example a QuestionCardSkeleton. */
  children: ReactNode;
};

/** The stepper, the step panel and the next button. Place inside a SkeletonGroup. */
export function FlowShellSkeleton({ steps, children }: FlowShellSkeletonProps): ReactNode {
  return (
    <div className={styles.shell}>
      <StepperSkeleton steps={steps} />
      <div className={styles.panel}>{children}</div>
      <div className={styles.actions}>
        <span />
        <Skeleton shape="pill" width="180px" height="52px" />
      </div>
    </div>
  );
}
