import { describe, expect, it } from 'vitest';
import { forecast } from './forecast';

const base = { qualifiedApplications: 120, offerRate: 0.55, enrolmentYield: 0.3, visaRetentionAdjustment: 0.85 };

describe('forecast', () => {
  it('multiplies applications x offer rate x yield x adjustment and shows each step', () => {
    const result = forecast(base);
    expect(result.qualifiedApplications).toBe(120);
    expect(result.offers).toBeCloseTo(66, 10);
    expect(result.enrolled).toBeCloseTo(19.8, 10);
    expect(result.retained).toBeCloseTo(16.83, 10);
  });

  it('is exactly the product of the four inputs', () => {
    expect(forecast(base).retained).toBeCloseTo(120 * 0.55 * 0.3 * 0.85, 10);
  });

  it('is zero with no applications or a zero rate', () => {
    expect(forecast({ ...base, qualifiedApplications: 0 }).retained).toBe(0);
    expect(forecast({ ...base, offerRate: 0 }).retained).toBe(0);
  });

  it('passes applications through when every rate is 1', () => {
    expect(forecast({ qualifiedApplications: 40, offerRate: 1, enrolmentYield: 1, visaRetentionAdjustment: 1 })).toEqual({
      qualifiedApplications: 40,
      offers: 40,
      enrolled: 40,
      retained: 40,
    });
  });

  it.each([-1, NaN, Infinity])('rejects %s applications', (qualifiedApplications) => {
    expect(() => forecast({ ...base, qualifiedApplications })).toThrow(RangeError);
  });

  it.each(['offerRate', 'enrolmentYield', 'visaRetentionAdjustment'] as const)('rejects a %s outside 0 to 1', (key) => {
    expect(() => forecast({ ...base, [key]: 1.01 })).toThrow(RangeError);
    expect(() => forecast({ ...base, [key]: -0.01 })).toThrow(RangeError);
    expect(() => forecast({ ...base, [key]: NaN })).toThrow(RangeError);
  });
});
