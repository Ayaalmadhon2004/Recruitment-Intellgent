import type { BandId, Confidence, NotScorable, QuestionId, Scored, ScoredGauge } from '../types';

function assertInRange(value: number, max: number, what: string): void {
  if (!Number.isFinite(value) || value < 0 || value > max) {
    throw new RangeError(`${what} must be a finite number from 0 to ${max}, got ${value}`);
  }
}

/** The only way to make a Scored: value, band and confidence are all required and checked. */
export function scored(value: number, band: BandId, confidence: Confidence): Scored {
  assertInRange(value, 100, 'Score');
  return { kind: 'scored', value, band, confidence };
}

export function scoredGauge(value: number, confidence: Confidence): ScoredGauge {
  assertInRange(value, 10, 'Gauge');
  return { kind: 'scored-gauge', value, confidence };
}

export function notScorable(
  reason: NotScorable['reason'],
  missing: readonly QuestionId[],
): NotScorable {
  return { kind: 'not-scorable', reason, missing };
}
