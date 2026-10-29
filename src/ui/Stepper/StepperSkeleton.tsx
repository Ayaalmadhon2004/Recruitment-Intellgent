import type { CSSProperties, ReactNode } from 'react';
import { Skeleton } from '../Skeleton';
import styles from './StepperSkeleton.module.css';

export type StepperSkeletonProps = {
  /** Number of steps, as `steps.length` of the real Stepper. */
  steps: number;
};

/** One node and one label per step, in the Stepper's grid. Place inside a SkeletonGroup. */
export function StepperSkeleton({ steps }: StepperSkeletonProps): ReactNode {
  return (
    <div className={styles.list} style={{ ['--steps' as string]: steps } as CSSProperties}>
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className={styles.step}>
          <Skeleton shape="circle" width="var(--tap-target)" />
          <Skeleton shape="line" width="80%" />
        </div>
      ))}
    </div>
  );
}
