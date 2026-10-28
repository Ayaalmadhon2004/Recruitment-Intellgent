import { browserStorage } from './storage';
import type { KeyValueStorage } from './storage';

export const ACTIVE_AUDIT_KEY = 'vri.accounts.active.v1';

/**
 * Which account audit the device's working copy belongs to. Without it the working copy is anonymous
 * work that has not been moved into an account yet. Holds an id only, never answers.
 */
export interface ActiveAuditPointer {
  get(): string | null;
  set(id: string): void;
  clear(): void;
}

export function createActiveAuditPointer(
  getStorage: () => KeyValueStorage | undefined = browserStorage,
  key: string = ACTIVE_AUDIT_KEY,
): ActiveAuditPointer {
  return {
    get: () => {
      try {
        return getStorage()?.getItem(key) || null;
      } catch {
        return null;
      }
    },
    set: (id) => {
      try {
        getStorage()?.setItem(key, id);
      } catch {
        // The working copy stays; the next save creates a new audit instead of updating this one.
      }
    },
    clear: () => {
      try {
        getStorage()?.removeItem(key);
      } catch {
        // Nothing to clear.
      }
    },
  };
}
