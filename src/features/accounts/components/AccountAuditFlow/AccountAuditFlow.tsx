'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuditFlow } from '@/features/intake';
import type { AuditFlowProps } from '@/features/intake';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import { useAccountSession } from '../../useAccountSession';
import { useRequireSession } from '../../useRequireSession';
import { createSyncingStore } from '../../working-copy';
import { SessionWait } from '../SessionWait';

export type AccountAuditFlowProps = Omit<AuditFlowProps, 'store'> & {
  /** Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
};

/**
 * The continuous audit, behind sign-in. Someone who is not signed in is sent to the sign-in page (and back here) before
 * the first question. Signed in, every answer saves to the device and to the account.
 */
export function AccountAuditFlow({
  runtime: runtimeProp,
  ...flow
}: AccountAuditFlowProps): ReactNode {
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const [{ store }] = useState(() => createSyncingStore(runtime));
  const { session } = useAccountSession(runtime);
  const { allowed, redirecting } = useRequireSession(session);
  if (!allowed) return <SessionWait redirecting={redirecting} />;
  return <AuditFlow {...flow} store={store} />;
}
