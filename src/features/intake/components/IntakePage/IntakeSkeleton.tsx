import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { sectionIds } from '@/domain/types';
import { SkeletonGroup } from '@/ui';
import { IntakeOverviewSkeleton } from '../IntakeOverview';
import { IntakeSectionSkeleton } from '../IntakeSection';
import { SectionNavSkeleton } from '../SectionNav';
import styles from './IntakePage.module.css';

/** The Intake page while this device's saved answers are read: overview, section cards, first questions. */
export function IntakeSkeleton(): ReactNode {
  return (
    <SkeletonGroup label={en.skeleton.intake}>
      <div className={styles.root}>
        <IntakeOverviewSkeleton />
        <SectionNavSkeleton sections={sectionIds.length} />
        <IntakeSectionSkeleton />
      </div>
    </SkeletonGroup>
  );
}
