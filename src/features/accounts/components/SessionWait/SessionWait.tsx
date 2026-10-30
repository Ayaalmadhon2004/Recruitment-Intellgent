import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { Skeleton, SkeletonGroup } from '@/ui';
import styles from './SessionWait.module.css';

/** What a gated page shows while the session is read or the person is on the way to sign in. Never content. */
export function SessionWait({ redirecting }: { redirecting: boolean }): ReactNode {
  return (
    <div className={styles.wait}>
      <SkeletonGroup label={redirecting ? uiCopy.flow.signInRedirect : uiCopy.flow.opening}>
        <Skeleton shape="line" width="40%" />
        <Skeleton shape="line" width="75%" />
        <Skeleton shape="line" width="60%" />
      </SkeletonGroup>
    </div>
  );
}
