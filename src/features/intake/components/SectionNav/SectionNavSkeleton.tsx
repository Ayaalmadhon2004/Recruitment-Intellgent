import type { ReactNode } from 'react';
import { Skeleton } from '@/ui';
import styles from './SectionNav.module.css';

export type SectionNavSkeletonProps = {
  /** Number of sections, as `sections.length` of the real SectionNav. */
  sections: number;
};

/** One card per section, in the real grid. Place inside a SkeletonGroup. */
export function SectionNavSkeleton({ sections }: SectionNavSkeletonProps): ReactNode {
  return (
    <div className={styles.cards}>
      {Array.from({ length: sections }, (_, i) => (
        <Skeleton key={i} shape="block" height="var(--space-10)" />
      ))}
    </div>
  );
}
