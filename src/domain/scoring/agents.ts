import type { AgentFactor, AgentRatings, RatedFactor, StrongestAndWeakest } from '../types';

export type RatingRange = { readonly min: number; readonly max: number };

export function assertAgentWeightsSumTo100(factors: readonly AgentFactor[]): void {
  const sum = factors.reduce((total, f) => total + f.weight, 0);
  if (Math.abs(sum - 100) > 1e-9)
    throw new RangeError(`Agent factor weights must sum to 100, got ${sum}`);
}

function ratingFor(ratings: AgentRatings, factor: AgentFactor): number {
  const value: number | undefined = ratings[factor.id];
  if (value === undefined) throw new RangeError(`Missing rating for factor ${factor.id}`);
  return value;
}

function assertInRange(factor: AgentFactor, value: number, range: RatingRange): void {
  if (!Number.isInteger(value) || value < range.min || value > range.max) {
    throw new RangeError(
      `Rating for ${factor.id} must be a whole number from ${range.min} to ${range.max}, got ${value}`,
    );
  }
}

/**
 * Weighted score of one agent, out of the top of the rating range:
 *   sum(weight x rating) / 100
 * Weights come from config and are passed in, so changing them changes the result with no code edit.
 */
export function weightedAgentScore(
  ratings: AgentRatings,
  factors: readonly AgentFactor[],
  rating: RatingRange,
): number {
  assertAgentWeightsSumTo100(factors);
  let total = 0;
  for (const factor of factors) {
    const value = ratingFor(ratings, factor);
    assertInRange(factor, value, rating);
    total += factor.weight * value;
  }
  return total / 100;
}

/** Highest and lowest rated factor. A tie goes to the factor that comes first in `factors`. */
export function strongestAndWeakest(
  ratings: AgentRatings,
  factors: readonly AgentFactor[],
): StrongestAndWeakest {
  if (factors.length === 0) throw new RangeError('At least one factor is required');
  const rated: RatedFactor[] = factors.map((factor) => {
    const value = ratingFor(ratings, factor);
    if (!Number.isFinite(value)) throw new RangeError(`Rating for ${factor.id} must be a number`);
    return { id: factor.id, rating: value };
  });
  let strongest = rated[0]!;
  let weakest = rated[0]!;
  for (const item of rated) {
    if (item.rating > strongest.rating) strongest = item;
    if (item.rating < weakest.rating) weakest = item;
  }
  return { strongest, weakest };
}
