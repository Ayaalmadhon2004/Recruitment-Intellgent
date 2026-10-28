import type { Answer, StageResult } from '@/domain/types';

/** Body of POST /api/audit-summaries: the stored answers of each audit, never scores. */
export type AuditSummariesRequest = {
  readonly audits: readonly {
    readonly id: string;
    readonly configVersion: string;
    readonly answers: readonly Answer[];
  }[];
};

export type AuditSummary = {
  readonly id: string;
  /** Computed on the server from the answers and the CURRENT config, whatever version the audit was saved under. */
  readonly stage: StageResult;
};

export type AuditSummariesResponse = {
  /** The config version the stages were computed with. */
  readonly configVersion: string;
  readonly summaries: readonly AuditSummary[];
};
