import type { Entitlement } from '@/domain/types';

/** What an audit is entitled to, and how it got there. `free` has no path and no date. */
export type EntitlementRecord = {
  readonly entitlement: Entitlement;
  /** The `UnlockPath.id` that was used, or null while free. */
  readonly pathId: string | null;
  /** ISO 8601, or null while free. */
  readonly grantedAt: string | null;
};

export type UnlockRequest = {
  /** The audit being unlocked: the active account audit id, or the anonymous working copy's id. */
  readonly auditKey: string;
  readonly pathId: string;
};

/**
 * Who may read the full report. A real unlock path (payment, a code, an advisor's approval) implements this;
 * the screens do not change. Methods reject with `UnlockError` for expected problems and with anything else
 * for outages. Nothing here ever carries a score: an entitlement only decides what the server may send.
 */
export interface EntitlementService {
  /** `free` when the audit has never been unlocked. */
  getEntitlement(auditKey: string): Promise<EntitlementRecord>;
  /**
   * Asks to unlock an audit with one of the paths. Resolves with the new record once the audit is unlocked.
   * A path that needs time (payment, approval) will need a pending outcome added here; none exists yet.
   */
  requestUnlock(request: UnlockRequest): Promise<EntitlementRecord>;
}
