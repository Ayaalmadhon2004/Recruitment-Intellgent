import type { ReactNode } from 'react';
import { stagesConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { scoreAreaIds } from '@/domain/types';
import { ActionListSkeleton, StageCardSkeleton } from '@/patterns';
import { Skeleton, SkeletonGroup } from '@/ui';
import { AreaGridSkeleton } from '../AreaGrid';
import { ReportHeroSkeleton } from '../ReportHero';
import styles from './ReportSection.module.css';

const NEXT_STEPS_PLACEHOLDERS = 4;

/** The interactive report while it is being built: hero, stage, area cards and next steps. */
export function ReportSkeleton(): ReactNode {
  return (
    <SkeletonGroup label={en.skeleton.report}>
      <div className={styles.root}>
        <ReportHeroSkeleton />
        <StageCardSkeleton steps={stagesConfig.stages.length} />
        <div className={styles.group}>
          <Skeleton shape="line" width="min(320px, 70%)" height="var(--text-h2-size)" />
          <AreaGridSkeleton areas={scoreAreaIds.length} />
        </div>
        <div className={styles.group}>
          <Skeleton shape="line" width="min(260px, 60%)" height="var(--text-h2-size)" />
          <ActionListSkeleton items={NEXT_STEPS_PLACEHOLDERS} />
        </div>
      </div>
    </SkeletonGroup>
  );
}
