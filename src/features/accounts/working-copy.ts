import type { AnswerStore, StoredAudit } from '@/features/intake';
import type { AccountsRuntime } from './runtime';
import { AccountError } from './service/errors';
import type { SavedAudit } from './types';

/**
 * Moves answers between the device (the working copy the Intake and Report use) and the account.
 * See docs/DECISIONS.md 6. Only answers and the config version travel; scores are never stored.
 */

const emptyStored = (runtime: AccountsRuntime): StoredAudit => ({
  configVersion: runtime.config.version,
  answers: [],
  confirmedTagIds: [],
  sectionIndex: 0,
});

export type AdoptResult =
  | { adopted: false; reason: 'nothing-to-adopt' | 'already-synced' }
  | { adopted: true; audit: SavedAudit; source: 'intake' | 'quick-start' };

/**
 * Moves anonymous work into the signed-in account, once. The device Intake answers win; if there are none,
 * the Quick Start answers are used. The Quick Start copy is cleared afterwards (moved, not copied), and the
 * adopted answers stay as the device working copy so the Report keeps working.
 */
export async function adoptLocalAudit(runtime: AccountsRuntime): Promise<AdoptResult> {
  const activeId = runtime.active.get();
  if (activeId !== null) {
    if ((await runtime.service.getAudit(activeId)) !== null) {
      return { adopted: false, reason: 'already-synced' };
    }
    // The pointer is stale (another account, or the audit is gone): the working copy is anonymous again.
    runtime.active.clear();
  }

  const local = runtime.localStore.load();
  const quickStart = runtime.quickStart.read();
  let stored: StoredAudit;
  let source: 'intake' | 'quick-start';
  if (local !== null && local.answers.length > 0) {
    stored = local;
    source = 'intake';
  } else if (quickStart !== undefined && quickStart.length > 0) {
    // Quick Start answers are kept without a config version, so they take the current one.
    stored = { ...emptyStored(runtime), answers: [...quickStart] };
    source = 'quick-start';
  } else {
    return { adopted: false, reason: 'nothing-to-adopt' };
  }

  const audit = await runtime.service.saveAudit({ stored });
  runtime.active.set(audit.id);
  if (source === 'quick-start') {
    runtime.localStore.save(stored);
    runtime.quickStart.clear();
  }
  return { adopted: true, audit, source };
}

/** Makes an account audit the device working copy, so the Intake and Report open on it. */
export async function resumeAudit(runtime: AccountsRuntime, id: string): Promise<SavedAudit> {
  const audit = await runtime.service.getAudit(id);
  if (audit === null) throw new AccountError('not-found');
  runtime.localStore.save(audit.stored);
  runtime.active.set(audit.id);
  return audit;
}

/** Empties the working copy. The first save from the Intake then creates a new account audit. */
export function startNewAudit(runtime: AccountsRuntime): void {
  runtime.localStore.save(emptyStored(runtime));
  runtime.active.clear();
  runtime.quickStart.clear();
}

/**
 * Signs out. A working copy that belongs to an account audit is cleared (it is synced, and the device may be
 * shared). Anonymous work stays: it was never in an account.
 */
export async function signOutAndClear(runtime: AccountsRuntime): Promise<void> {
  await runtime.service.signOut();
  if (runtime.active.get() !== null) {
    runtime.localStore.save(emptyStored(runtime));
    runtime.active.clear();
  }
}

/**
 * An `AnswerStore` for the Intake: every save lands on the device first (never lost). If someone is signed
 * in, it is then sent to the account, one at a time. The first save of a new audit creates it and remembers
 * its id. Signed out, it behaves exactly like the device store.
 */
export function createSyncingStore(
  runtime: AccountsRuntime,
  onSyncError: (error: unknown) => void = () => undefined,
): { store: AnswerStore; settled: () => Promise<void> } {
  let queue: Promise<void> = Promise.resolve();
  const store: AnswerStore = {
    load: () => runtime.localStore.load(),
    save: (stored: StoredAudit): void => {
      runtime.localStore.save(stored);
      queue = queue
        .then(async () => {
          // Signed out: the device copy is all there is (anonymous work waits to be adopted).
          if ((await runtime.service.currentUser()) === null) return;
          const id = runtime.active.get();
          try {
            const saved = await runtime.service.saveAudit(
              id === null ? { stored } : { id, stored },
            );
            if (id === null) runtime.active.set(saved.id);
          } catch (error) {
            // The audit was removed elsewhere: next save starts a new one instead of failing forever.
            if (id !== null && error instanceof AccountError && error.code === 'not-found') {
              runtime.active.clear();
            }
            throw error;
          }
        })
        .catch(onSyncError);
    },
  };
  return { store, settled: () => queue };
}
