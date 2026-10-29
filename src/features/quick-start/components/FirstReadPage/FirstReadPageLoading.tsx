import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SkeletonGroup } from '@/ui';
import { FirstReadSkeleton } from '../FirstReadView';
import styles from './FirstReadPage.module.css';

/** The First Read frame around its skeleton. Used while loading and by the route's `loading.tsx`. */
export function FirstReadPageLoading(): ReactNode {
  return (
    <div className={styles.root}>
      <SkeletonGroup label={en.skeleton.firstRead}>
        <FirstReadSkeleton />
      </SkeletonGroup>
    </div>
  );
}
