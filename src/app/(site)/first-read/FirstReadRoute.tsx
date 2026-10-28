'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { FirstReadPage } from '@/features/quick-start';
import { useDeviceEntitlement } from '@/features/unlock';

/**
 * Composes the First Read with the audit's entitlement. Quick Start cannot read entitlement itself
 * (quick-start -> unlock -> accounts -> quick-start would be a cycle), so the route passes the link only
 * when the audit is known to be free. While the entitlement is unread, or once unlocked, no action shows.
 */
export function FirstReadRoute(): ReactNode {
  const entitlement = useDeviceEntitlement();
  return <FirstReadPage unlockHref={entitlement === 'free' ? routes.unlock : undefined} />;
}
