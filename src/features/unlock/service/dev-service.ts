import { browserStorage } from '@/features/accounts';
import type { KeyValueStorage } from '@/features/accounts';
import { resolveUnlockPaths } from '../paths';
import { UnlockError } from './errors';
import type { EntitlementRecord, EntitlementService, UnlockRequest } from './types';

/**
 * DEVELOPMENT entitlement service. Not a payment, not a check.
 *
 * It grants an unlock the moment it is asked and keeps the grant in this browser's localStorage, keyed by
 * audit. No money moves, nothing is verified, and anyone at the keyboard can unlock or edit the grant. It
 * exists so the Unlock screen and the locked areas can be built and tested before the unlock path, the price
 * and the free vs locked line are decided (open item 5, docs/DECISIONS.md 7). A real path implements
 * `EntitlementService` and replaces it; the server then looks the entitlement up itself.
 */

export const DEV_ENTITLEMENTS_KEY = 'vri.unlock.dev.v1';

type Grant = { readonly pathId: string; readonly grantedAt: string };
type Grants = Readonly<Record<string, Grant>>;

const free: EntitlementRecord = { entitlement: 'free', pathId: null, grantedAt: null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Anything unreadable is dropped, so a corrupt entry reads as "free". */
function parseGrants(raw: unknown): Grants {
  if (!isRecord(raw) || !isRecord(raw.grants)) return {};
  const out: Record<string, Grant> = {};
  for (const [key, value] of Object.entries(raw.grants)) {
    if (
      isRecord(value) &&
      typeof value.pathId === 'string' &&
      typeof value.grantedAt === 'string'
    ) {
      out[key] = { pathId: value.pathId, grantedAt: value.grantedAt };
    }
  }
  return out;
}

function readGrants(storage: KeyValueStorage, key: string): Grants {
  try {
    const text = storage.getItem(key);
    return text ? parseGrants(JSON.parse(text)) : {};
  } catch {
    return {};
  }
}

const recordOf = (grant: Grant | undefined): EntitlementRecord =>
  grant ? { entitlement: 'unlocked', pathId: grant.pathId, grantedAt: grant.grantedAt } : free;

/**
 * Synchronous read of one audit's entitlement from a device storage. The Report loads its audit
 * synchronously, so it needs this; a real service is asynchronous and the server would not trust the device.
 */
export function readStoredEntitlement(
  auditKey: string,
  getStorage: () => KeyValueStorage | undefined = browserStorage,
  key: string = DEV_ENTITLEMENTS_KEY,
): EntitlementRecord {
  const storage = getStorage();
  return storage ? recordOf(readGrants(storage, key)[auditKey]) : free;
}

export type DevEntitlementServiceOptions = {
  getStorage?: () => KeyValueStorage | undefined;
  now?: () => Date;
  key?: string;
  /** Path ids this service accepts. Defaults to the options the screen shows. */
  knownPathIds?: () => readonly string[];
};

export function createDevEntitlementService({
  getStorage = browserStorage,
  now = () => new Date(),
  key = DEV_ENTITLEMENTS_KEY,
  knownPathIds = () => resolveUnlockPaths().map((p) => p.id),
}: DevEntitlementServiceOptions = {}): EntitlementService {
  const storage = (): KeyValueStorage => {
    const found = getStorage();
    if (!found) throw new UnlockError('unavailable');
    return found;
  };

  return {
    async getEntitlement(auditKey: string): Promise<EntitlementRecord> {
      return recordOf(readGrants(storage(), key)[auditKey]);
    },

    async requestUnlock({ auditKey, pathId }: UnlockRequest): Promise<EntitlementRecord> {
      if (!knownPathIds().includes(pathId)) throw new UnlockError('unknown-path');
      const target = storage();
      const grants = readGrants(target, key);
      // Asking again keeps the first grant: an unlock is not moved to another path.
      const grant: Grant = grants[auditKey] ?? { pathId, grantedAt: now().toISOString() };
      try {
        target.setItem(key, JSON.stringify({ grants: { ...grants, [auditKey]: grant } }));
      } catch {
        throw new UnlockError('unavailable');
      }
      return recordOf(grant);
    },
  };
}
