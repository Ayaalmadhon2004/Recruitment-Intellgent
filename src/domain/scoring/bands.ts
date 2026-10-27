import type { Band, BandId } from '../types';

/** Bands must be non-empty, have unique cut-offs, and the lowest must start at 0 so every score has a band. */
export function assertValidBands(bands: readonly Band[]): void {
  if (bands.length === 0) throw new RangeError('At least one band is required');
  const mins = bands.map((b) => b.min);
  if (new Set(mins).size !== mins.length) throw new RangeError('Band cut-offs must be unique');
  if (mins.some((m) => !Number.isFinite(m) || m < 0 || m > 100)) {
    throw new RangeError('Band cut-offs must be finite numbers from 0 to 100');
  }
  if (Math.min(...mins) !== 0) throw new RangeError('The lowest band must start at 0');
}

/** The band whose cut-off is the highest one at or below the value. Boundaries belong to the higher band. */
export function bandFor(value: number, bands: readonly Band[]): BandId {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`Score must be a finite number from 0 to 100, got ${value}`);
  }
  assertValidBands(bands);
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  const match = sorted.find((b) => value >= b.min);
  if (!match) throw new RangeError('No band matches');
  return match.id;
}
