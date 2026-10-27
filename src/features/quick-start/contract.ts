import type { Answer, ScoreAreaId, ScoreResult, StageResult } from '@/domain/types';

/** Body of POST /api/first-read. The browser sends answers; scores are computed on the server. */
export type FirstReadRequest = {
  readonly answers: readonly Answer[];
};

/** What the server returns. The browser only renders it. */
export type FirstReadResponse = {
  readonly configVersion: string;
  /** How many of the Quick Start questions have a real answer ("Not sure" does not count). */
  readonly answeredCount: number;
  readonly quickStartTotal: number;
  readonly stage: StageResult;
  /** Every area, always present. Areas with no formula or missing answers are NotScorable. */
  readonly areas: Readonly<Record<ScoreAreaId, ScoreResult>>;
};

export type FirstReadError = {
  readonly error: 'invalid-request';
  readonly message: string;
};
