import type { Answer } from './answer';

export type Entitlement = 'free' | 'unlocked';
export type AuditStatus = 'in-progress' | 'complete';

/** Stores answers and the config version used. Scores are computed on read, never stored. */
export type Audit = {
  readonly id: string;
  readonly institutionName: string;
  readonly answers: readonly Answer[];
  readonly status: AuditStatus;
  readonly configVersion: string;
  readonly entitlement: Entitlement;
};
