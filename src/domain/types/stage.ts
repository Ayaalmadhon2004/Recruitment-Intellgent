import type { CopyKey } from '../copy';
import type { NotScorable } from './score';
import type { QuestionId, StageId } from './ids';

export type Stage = {
  readonly id: StageId;
  readonly labelKey: CopyKey;
  /** Whole number of Vietnamese students, inclusive. `max` is null for the open-ended top stage. */
  readonly min: number;
  readonly max: number | null;
};

export type StageResult = { readonly kind: 'staged'; readonly stage: StageId } | NotScorable;

export type StageSource = { readonly questionId: QuestionId };
