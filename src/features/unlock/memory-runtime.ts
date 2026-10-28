import { createMemoryStorage } from '@/features/accounts';
import { DEV_ENTITLEMENTS_KEY, createDevEntitlementService } from './service/dev-service';
import { UnlockError } from './service/errors';
import type { UnlockRuntime } from './runtime';

export type MemoryRuntimeOptions = {
  auditKey?: string;
  hasAudit?: boolean;
  /** Path ids the service accepts. Defaults to the options the screen shows. */
  knownPathIds?: () => readonly string[];
  now?: () => Date;
  /** Start already unlocked with this path id. */
  unlockedWith?: string;
  /** Make the service fail: reading the entitlement, or asking to unlock. */
  fail?: 'load' | 'request';
};

/** A runtime that touches no browser storage, for stories and tests. Still the development service. */
export function createMemoryRuntime({
  auditKey = 'story-audit',
  hasAudit = true,
  knownPathIds,
  now,
  unlockedWith,
  fail,
}: MemoryRuntimeOptions = {}): UnlockRuntime {
  const storage = createMemoryStorage();
  if (unlockedWith !== undefined) {
    storage.setItem(
      DEV_ENTITLEMENTS_KEY,
      JSON.stringify({
        grants: { [auditKey]: { pathId: unlockedWith, grantedAt: '2026-10-28T10:00:00.000Z' } },
      }),
    );
  }
  const service = createDevEntitlementService({
    getStorage: () => storage,
    ...(knownPathIds ? { knownPathIds } : {}),
    ...(now ? { now } : {}),
  });
  return {
    service: {
      getEntitlement: (key) =>
        fail === 'load'
          ? Promise.reject(new UnlockError('unavailable'))
          : service.getEntitlement(key),
      requestUnlock: (request) =>
        fail === 'request'
          ? Promise.reject(new UnlockError('unavailable'))
          : service.requestUnlock(request),
    },
    auditKey: () => auditKey,
    hasAudit: () => hasAudit,
    isDevelopment: true,
  };
}
