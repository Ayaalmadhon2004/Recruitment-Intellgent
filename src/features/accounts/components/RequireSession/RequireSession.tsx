'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import { useAccountSession } from '../../useAccountSession';
import { useRequireSession } from '../../useRequireSession';
import { SessionWait } from '../SessionWait';

export type RequireSessionProps = {
  children: ReactNode;
  /** Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
};

/** Wraps a gated page: children render only for a signed-in person; everyone else is redirected to sign in. */
export function RequireSession({ children, runtime: runtimeProp }: RequireSessionProps): ReactNode {
  const [runtime] = useState(() => runtimeProp ?? getDefaultRuntime());
  const { session } = useAccountSession(runtime);
  const { allowed, redirecting } = useRequireSession(session);
  return allowed ? children : <SessionWait redirecting={redirecting} />;
}
