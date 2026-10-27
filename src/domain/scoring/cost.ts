import type { PriceBand, PriceBandId } from '../types';

export type NetAnnualCostInput = {
  /** US dollars per year. */
  tuition: number;
  /** US dollars per year. */
  living: number;
  includeLiving: boolean;
  /** US dollars per year. Counts only up to the tuition. */
  scholarship: number;
};

const PERCENT = 100;
const YEARS_OF_STUDY = 4;

function assertAmount(name: string, value: number): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite number of zero or more, got ${value}`);
  }
}

/** The scholarship that actually reduces the price: it cannot go above tuition. */
export function appliedScholarship(tuition: number, scholarship: number): number {
  assertAmount('tuition', tuition);
  assertAmount('scholarship', scholarship);
  return Math.min(scholarship, tuition);
}

/**
 * Net annual cost in US dollars:
 *   max(0, tuition + (includeLiving ? living : 0) - min(scholarship, tuition))
 * No exchange rate is used anywhere.
 */
export function netAnnualCost({
  tuition,
  living,
  includeLiving,
  scholarship,
}: NetAnnualCostInput): number {
  assertAmount('living', living);
  const applied = appliedScholarship(tuition, scholarship);
  return Math.max(0, tuition + (includeLiving ? living : 0) - applied);
}

/** Percent of tuition covered by the scholarship, 0 to 100. Zero when tuition is zero. */
export function scholarshipCoverage(tuition: number, scholarship: number): number {
  const applied = appliedScholarship(tuition, scholarship);
  return tuition === 0 ? 0 : (applied / tuition) * PERCENT;
}

/**
 * The price band for a net cost. A boundary belongs to the higher band (20000 is "20-30k").
 * Bands are passed in from config, so changing the config changes the result.
 */
export function priceBandFor(netUsd: number, bands: readonly PriceBand[]): PriceBandId {
  assertAmount('net cost', netUsd);
  if (bands.length === 0) throw new RangeError('At least one price band is required');
  const sorted = [...bands].sort((a, b) => b.minUsd - a.minUsd);
  const match = sorted.find((b) => netUsd >= b.minUsd);
  if (!match) throw new RangeError('No price band matches: the lowest band must start at 0');
  return match.id;
}

/** Four years at the same net annual cost. No inflation or other assumption is applied. */
export function fourYearCost(netUsd: number): number {
  assertAmount('net cost', netUsd);
  return netUsd * YEARS_OF_STUDY;
}
