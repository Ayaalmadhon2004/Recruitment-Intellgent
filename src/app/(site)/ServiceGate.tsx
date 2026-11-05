'use client';

import type { ReactNode } from 'react';
import { devServicesEnabled, routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ErrorState } from '@/shell';
import { Button } from '@/ui';

const copy = en.errorPages.serviceNotReady;

export type ServiceGateProps = {
  children: ReactNode;
  /** Overridden in tests; the build decides it otherwise. */
  enabled?: boolean;
};

/**
 * Wraps every page that needs an account or an unlock. Until a real provider exists, a production build
 * shows "not open yet" instead of the development services, which verify nothing (docs/DECISIONS.md 6).
 */
export function ServiceGate({
  children,
  enabled = devServicesEnabled,
}: ServiceGateProps): ReactNode {
  if (enabled) return children;
  return (
    <ErrorState eyebrow={copy.eyebrow} title={copy.title} body={copy.body}>
      <Button href={routes.home}>{copy.home}</Button>
      <Button href={routes.advisor} variant="outline">
        {copy.advisor}
      </Button>
    </ErrorState>
  );
}
