import type { CopyKey } from '../copy';
import type { Confidence } from './answer';
import type { BandId, GaugeId, QuestionId, ScoreAreaId } from './ids';

export type Band = {
  readonly id: BandId;
  readonly labelKey: CopyKey;
  /** Lowest score that falls in this band, inclusive. */
  readonly min: number;
};

/** A real 0-100 score. Always has a band and a confidence. */
export type Scored = {
  readonly kind: 'scored';
  readonly value: number;
  readonly band: BandId;
  readonly confidence: Confidence;
};

/**
 * A score we cannot compute yet. Never rendered as a number.
 * `missing` lists the unanswered questions that would feed it.
 * `reason` says whether a formula is missing, answers are missing, or an answer is not usable.
 */
export type NotScorable = {
  readonly kind: 'not-scorable';
  readonly reason: 'no-formula' | 'missing-answers' | 'invalid-answer';
  readonly missing: readonly QuestionId[];
};

export type ScoreResult = Scored | NotScorable;

/** A real 0-10 gauge reading. */
export type ScoredGauge = {
  readonly kind: 'scored-gauge';
  readonly value: number;
  readonly confidence: Confidence;
};

export type GaugeResult = ScoredGauge | NotScorable;

export type ScoreArea = {
  readonly id: ScoreAreaId;
  readonly nameKey: CopyKey;
};

export type Gauge = {
  readonly id: GaugeId;
  readonly nameKey: CopyKey;
};
