import { parseStoredAudit } from './parse';
import type { AnswerStore, StoredAudit } from './types';

export const INTAKE_STORAGE_KEY = 'vri.intake.v1';

/** Reads `window.localStorage`, which can be missing or throw (private mode, blocked site data). */
const browserStorage = (): Storage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

/**
 * Keeps the audit in the browser. Every failure (no storage, quota, bad JSON, foreign data) reads as "no
 * saved audit" or drops the write, so the Intake always works.
 */
export function createLocalStorageStore(
  getStorage: () => Storage | undefined = browserStorage,
  key: string = INTAKE_STORAGE_KEY,
): AnswerStore {
  return {
    load(): StoredAudit | null {
      try {
        const text = getStorage()?.getItem(key);
        return text ? parseStoredAudit(JSON.parse(text)) : null;
      } catch {
        return null;
      }
    },
    save(stored: StoredAudit): void {
      try {
        getStorage()?.setItem(key, JSON.stringify(stored));
      } catch {
        // Nothing to do: the person keeps working, the answers stay on screen.
      }
    },
  };
}
