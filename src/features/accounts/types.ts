import type { StoredAudit } from '@/features/intake';

/** The signed-in person. The id is the service's; the email is what they typed (trimmed, lower case). */
export type AccountUser = {
  readonly id: string;
  readonly email: string;
};

/**
 * An audit kept in an account: the answers and the config version they were given under (inside `stored`),
 * never a score, a stage or a status. Those are computed on read.
 */
export type SavedAudit = {
  readonly id: string;
  /** No question asks for the institution name yet, so this is null and the UI says "Untitled audit". */
  readonly institutionName: string | null;
  readonly stored: StoredAudit;
  /** ISO 8601, set by the service on every save. */
  readonly updatedAt: string;
};

export type SaveAuditInput = {
  /** Omit to create a new audit. */
  readonly id?: string;
  readonly institutionName?: string | null;
  readonly stored: StoredAudit;
};

export type SignInLinkResult = {
  readonly email: string;
  /**
   * DEVELOPMENT ONLY. The development service returns the token so the flow can be walked through without
   * email. A real provider never hands the token to the browser; the link in the email carries it.
   */
  readonly developmentToken?: string;
};
