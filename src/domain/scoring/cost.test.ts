import { describe, expect, it } from 'vitest';
import { scoringConfig } from '../config';
import type { PriceBand } from '../types';
import {
  appliedScholarship,
  fourYearCost,
  netAnnualCost,
  priceBandFor,
  scholarshipCoverage,
} from './cost';

const base = { tuition: 34000, living: 9000, includeLiving: true, scholarship: 6000 };
const bands = scoringConfig.priceBands;

describe('netAnnualCost', () => {
  it('adds living costs and subtracts the scholarship', () => {
    expect(netAnnualCost(base)).toBe(37000);
  });
  it('leaves living costs out when excluded', () => {
    expect(netAnnualCost({ ...base, includeLiving: false })).toBe(28000);
  });
  it('is zero for zero tuition without living costs', () => {
    expect(netAnnualCost({ tuition: 0, living: 5000, includeLiving: false, scholarship: 0 })).toBe(
      0,
    );
  });
  it('keeps living costs when tuition is zero and they are included', () => {
    expect(
      netAnnualCost({ tuition: 0, living: 5000, includeLiving: true, scholarship: 3000 }),
    ).toBe(5000);
  });
  it('caps the scholarship at tuition', () => {
    expect(netAnnualCost({ ...base, scholarship: 99999 })).toBe(9000);
    expect(netAnnualCost({ ...base, includeLiving: false, scholarship: 99999 })).toBe(0);
  });
  it('rejects negative, NaN and infinite amounts', () => {
    expect(() => netAnnualCost({ ...base, tuition: -1 })).toThrow(RangeError);
    expect(() => netAnnualCost({ ...base, living: -1 })).toThrow(RangeError);
    expect(() => netAnnualCost({ ...base, scholarship: -1 })).toThrow(RangeError);
    expect(() => netAnnualCost({ ...base, tuition: Number.NaN })).toThrow(RangeError);
    expect(() => netAnnualCost({ ...base, living: Number.NaN })).toThrow(RangeError);
    expect(() => netAnnualCost({ ...base, scholarship: Number.POSITIVE_INFINITY })).toThrow(
      RangeError,
    );
  });
});

describe('appliedScholarship and scholarshipCoverage', () => {
  it('applies at most the tuition', () => {
    expect(appliedScholarship(1000, 5000)).toBe(1000);
    expect(appliedScholarship(1000, 400)).toBe(400);
  });
  it('gives the percent of tuition covered', () => {
    expect(scholarshipCoverage(34000, 6000)).toBeCloseTo(17.647, 3);
    expect(scholarshipCoverage(10000, 10000)).toBe(100);
    expect(scholarshipCoverage(10000, 20000)).toBe(100);
    expect(scholarshipCoverage(10000, 0)).toBe(0);
  });
  it('is 0 when tuition is 0', () => {
    expect(scholarshipCoverage(0, 0)).toBe(0);
    expect(scholarshipCoverage(0, 5000)).toBe(0);
  });
  it('rejects bad input', () => {
    expect(() => scholarshipCoverage(-1, 0)).toThrow(RangeError);
    expect(() => scholarshipCoverage(100, Number.NaN)).toThrow(RangeError);
  });
});

describe('priceBandFor', () => {
  it.each([
    [0, 'under-20k'],
    [19999, 'under-20k'],
    [20000, '20-30k'],
    [29999, '20-30k'],
    [30000, '30-40k'],
    [39999, '30-40k'],
    [40000, '40-50k'],
    [49999, '40-50k'],
    [50000, '50k-plus'],
    [250000, '50k-plus'],
  ])('puts %d in %s', (net, id) => {
    expect(priceBandFor(net, bands)).toBe(id);
  });
  it('does not depend on the order of the bands', () => {
    expect(priceBandFor(25000, [...bands].reverse())).toBe('20-30k');
  });
  it('rejects bad input', () => {
    expect(() => priceBandFor(-1, bands)).toThrow(RangeError);
    expect(() => priceBandFor(Number.NaN, bands)).toThrow(RangeError);
    expect(() => priceBandFor(10, [])).toThrow(RangeError);
    expect(() => priceBandFor(10, [{ ...bands[1]!, minUsd: 20000 }])).toThrow(RangeError);
  });
  it('follows the config: changed bands change the result with no code edit', () => {
    const changed: PriceBand[] = [
      { ...bands[0]!, maxUsd: 25000 },
      { ...bands[1]!, minUsd: 25000, maxUsd: 30000 },
      ...bands.slice(2),
    ];
    expect(priceBandFor(22000, bands)).toBe('20-30k');
    expect(priceBandFor(22000, changed)).toBe('under-20k');
    expect(priceBandFor(25000, changed)).toBe('20-30k');
  });
});

describe('fourYearCost', () => {
  it('multiplies by four', () => {
    expect(fourYearCost(37000)).toBe(148000);
    expect(fourYearCost(0)).toBe(0);
  });
  it('rejects bad input', () => {
    expect(() => fourYearCost(-5)).toThrow(RangeError);
  });
});
