import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { printSectionIds } from '@/features/report';
import { Skeleton, SkeletonGroup } from '@/ui';
import styles from './PdfExportPage.module.css';
import skeletonStyles from './PdfExportSkeleton.module.css';

/** The PDF page while the report is being built: intro, the A4 sheet and the options panel. */
export function PdfExportSkeleton(): ReactNode {
  return (
    <div className={styles.root}>
      <SkeletonGroup label={en.skeleton.pdfExport}>
        <div className={skeletonStyles.body}>
          <div className={styles.intro}>
            <Skeleton shape="line" width="140px" height="var(--text-eyebrow-size)" />
            <Skeleton shape="line" width="min(360px, 80%)" height="var(--text-h1-line)" />
            <Skeleton shape="line" width="min(520px, 100%)" />
            <Skeleton shape="pill" width="160px" />
          </div>
          <div className={styles.workspace}>
            <div className={styles.canvas}>
              <Skeleton shape="pill" width="200px" />
              <Skeleton shape="block" className={skeletonStyles.paper} />
            </div>
            <div className={skeletonStyles.options}>
              <Skeleton shape="line" width="60%" height="var(--text-h2-size)" />
              {printSectionIds.map((id) => (
                <div key={id} className={skeletonStyles.row}>
                  <Skeleton shape="line" width="55%" />
                  <Skeleton shape="pill" width="var(--space-10)" height="var(--space-7)" />
                </div>
              ))}
              <Skeleton shape="pill" />
            </div>
          </div>
        </div>
      </SkeletonGroup>
    </div>
  );
}
