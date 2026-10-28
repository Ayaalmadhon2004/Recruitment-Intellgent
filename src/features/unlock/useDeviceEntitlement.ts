'use client';

import { useSyncExternalStore } from 'react';
import type { Entitlement } from '@/domain/types';
import { readDeviceEntitlement } from './deviceAudit';

const subscribe = (notify: () => void): (() => void) => {
  window.addEventListener('storage', notify);
  return () => window.removeEventListener('storage', notify);
};
// The server has no device storage: "not read yet" (undefined) differs from a real answer.
const serverSnapshot = (): undefined => undefined;

/**
 * DEVELOPMENT. The entitlement of the audit on this device, read without a mismatch on first render.
 * `undefined` means not read yet. A real unlock path replaces this with a server lookup.
 */
export function useDeviceEntitlement(): Entitlement | undefined {
  return useSyncExternalStore(subscribe, readDeviceEntitlement, serverSnapshot);
}
