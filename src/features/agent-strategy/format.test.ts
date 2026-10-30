import { describe, expect, it } from 'vitest';
import { agentsConfig } from '@/domain/config';
import { enrolmentShare, fill, fmt1, parseForecast, toCount, toPercent } from './format';
import { monthKeys } from './PilotTimeline';

describe('format', () => {
  it('fills known holes and leaves unknown ones visible', () => {
    expect(fill('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });

  it('formats one decimal place', () => {
    expect(fmt1(16.83)).toBe('16.8');
    expect(fmt1(1234)).toBe('1,234.0');
  });

  it('treats empty, negative and non-numeric text as 0', () => {
    expect(toCount('')).toBe(0);
    expect(toCount('-5')).toBe(0);
    expect(toCount('abc')).toBe(0);
    expect(toCount('12')).toBe(12);
  });

  it('clamps percents to 100', () => {
    expect(toPercent('250')).toBe(100);
    expect(toPercent('40')).toBe(40);
  });

  it('converts percents to ratios for forecast()', () => {
    const { inputs, percents } = parseForecast({
      applications: '120',
      offerRate: '55',
      enrolmentYield: '30',
      visaRetention: '150',
    });
    expect(inputs).toEqual({
      qualifiedApplications: 120,
      offerRate: 0.55,
      enrolmentYield: 0.3,
      visaRetentionAdjustment: 1,
    });
    expect(percents.visaRetention).toBe(100);
  });

  it('has copy for every month of the configured pilot', () => {
    expect(monthKeys).toHaveLength(agentsConfig.pilot.durationMonths);
  });

  it('works out the enrolled share of applications for the ring, guarding empty input', () => {
    expect(enrolmentShare(16.8, 120)).toBeCloseTo(14);
    expect(enrolmentShare(5, 0)).toBe(0);
    expect(enrolmentShare(Number.NaN, 10)).toBe(0);
    expect(enrolmentShare(30, 10)).toBe(100);
  });
});
