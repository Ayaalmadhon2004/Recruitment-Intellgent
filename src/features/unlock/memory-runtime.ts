import { createMemoryStorage } from '@/features/accounts';
import { createDevEntitlementService } from './service/dev-service';
import type { UnlockRuntime } from './runtime';

export type MemoryRuntimeOptions = {
  auditKey?: string;
  hasAudit?: boolean;
  /** Path ids the service accepts. Defaults to the options the screen shows. */
  knownPathIds?: () => readonly string[];
  now?: () => Date;
};

/** A runtime that touches no browser storage, for stories and tests. Still the development service. */
export function createMemoryRuntime({
  auditKey = 'story-audit',
  hasAudit = true,
  knownPathIds,
  now,
}: MemoryRuntimeOptions = {}): UnlockRuntime {
  const storage = createMemoryStorage();
  return {
    service: createDevEntitlementService({
      getStorage: () => storage,
      ...(knownPathIds ? { knownPathIds } : {}),
      ...(now ? { now } : {}),
    }),
    auditKey: () => auditKey,
    hasAudit: () => hasAudit,
    isDevelopment: true,
  };
}
