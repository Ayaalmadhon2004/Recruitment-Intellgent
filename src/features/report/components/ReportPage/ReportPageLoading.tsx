import type { ReactNode } from 'react';
import { ReportSkeleton } from '../ReportSection';
import styles from './ReportPage.module.css';

/** The report page frame around its skeleton, for the route's `loading.tsx`. */
export function ReportPageLoading(): ReactNode {
  return (
    <div className={styles.root}>
      <ReportSkeleton />
    </div>
  );
}
