'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { IntakePage } from '@/features/intake';
import type { IntakePageProps } from '@/features/intake';
import { getDefaultRuntime } from '../../runtime';
import type { AccountsRuntime } from '../../runtime';
import { createSyncingStore } from '../../working-copy';

export type AccountIntakeProps = Omit<IntakePageProps, 'store'> & {
  /** Defaults to this browser. Keep stable. */
  runtime?: AccountsRuntime;
};

/**
 * The Intake, saving to the device as before and, while someone is signed in, to their account too.
 * Signed out it behaves exactly like the plain Intake.
 */
export function AccountIntake({ runtime: runtimeProp, ...intake }: AccountIntakeProps): ReactNode {
  const [store] = useState(() => createSyncingStore(runtimeProp ?? getDefaultRuntime()).store);
  return <IntakePage {...intake} store={store} />;
}
