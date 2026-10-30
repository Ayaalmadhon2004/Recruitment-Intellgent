'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { AuditFlow } from '@/features/intake';
import type { AuditFlowProps } from '@/features/intake';
import { Skeleton, SkeletonGroup } from '@/ui';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import { useAccountSession } from '../../useAccountSession';
import { createSyncingStore } from '../../working-copy';
import styles from './AccountAuditFlow.module.css';

export type AccountAuditFlowProps = Omit<AuditFlowProps, 'store'> & {
  /** Where someone who is not signed in is sent first. It should bring them back here afterwards. */
  signInHref: string;
  /** Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
};

/**
 * The continuous audit, behind sign-in. Someone who is not signed in is sent to the sign-in page before
 * the first question. Signed in, every answer saves to the device and to the account.
 */
export function AccountAuditFlow({
  runtime: runtimeProp,
  signInHref,
  ...flow
}: AccountAuditFlowProps): ReactNode {
  const router = useRouter();
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const [{ store }] = useState(() => createSyncingStore(runtime));
  const { session } = useAccountSession(runtime);
  // A session that could not be read counts as signed out: no question is shown without a sign-in.
  const needsSignIn = session.status === 'signed-out' || session.status === 'error';

  useEffect(() => {
    if (needsSignIn) router.replace(signInHref);
  }, [needsSignIn, router, signInHref]);

  if (session.status !== 'signed-in') {
    return (
      <div className={styles.wait}>
        <SkeletonGroup label={needsSignIn ? uiCopy.flow.signInRedirect : uiCopy.flow.opening}>
          <Skeleton shape="line" width="40%" />
          <Skeleton shape="line" width="75%" />
          <Skeleton shape="line" width="60%" />
        </SkeletonGroup>
      </div>
    );
  }
  return <AuditFlow {...flow} store={store} />;
}
