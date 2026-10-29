import type { ReactNode } from 'react';
import { ScoreDetailSkeleton } from '../ScoreDetail';
import styles from './ScoreDetailPage.module.css';

/** The score detail page frame around its skeleton, for the route's `loading.tsx`. */
export function ScoreDetailPageLoading(): ReactNode {
  return (
    <div className={styles.root}>
      <ScoreDetailSkeleton />
    </div>
  );
}
