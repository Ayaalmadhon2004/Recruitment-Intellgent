import type { Answer } from '@/domain/types';
import { domainConfig } from '@/domain/config';
import { createMemoryStore } from '@/features/intake';
import type { AnswerStore, StoredAudit } from '@/features/intake';
import type { AccountsRuntime } from './runtime';
import { createActiveAuditPointer } from './service/active-audit';
import { createDevAccountService } from './service/dev-service';
import { createMemoryStorage } from './service/storage';

export type MemoryRuntimeOptions = {
  /** Working copy on the device. */
  local?: StoredAudit | null;
  /** Quick Start answers waiting in the tab. */
  quickStart?: readonly Answer[];
  newId?: () => string;
  now?: () => Date;
};

/** A runtime that touches no browser storage, for stories and tests. Still the development service. */
export function createMemoryRuntime({
  local = null,
  quickStart,
  newId,
  now,
}: MemoryRuntimeOptions = {}): AccountsRuntime & { localStore: AnswerStore } {
  const storage = createMemoryStorage();
  const getStorage = (): typeof storage => storage;
  let quick = quickStart;
  return {
    service: createDevAccountService({
      getStorage,
      ...(newId ? { newId } : {}),
      ...(now ? { now } : {}),
    }),
    localStore: createMemoryStore(local),
    active: createActiveAuditPointer(getStorage),
    quickStart: {
      read: () => quick,
      clear: () => {
        quick = undefined;
      },
    },
    config: domainConfig,
    isDevelopment: true,
  };
}
