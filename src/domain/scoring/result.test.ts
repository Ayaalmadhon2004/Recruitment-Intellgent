import { describe, expect, it } from 'vitest';
import { notScorable, scored, scoredGauge } from './result';

describe('result constructors', () => {
  it('scored always carries a band and a confidence', () => {
    expect(scored(68, 'developing', 'medium')).toEqual({
      kind: 'scored',
      value: 68,
      band: 'developing',
      confidence: 'medium',
    });
  });

  it.each([-0.1, 100.1, NaN])('refuses a score of %s', (value) => {
    expect(() => scored(value, 'strong', 'high')).toThrow(RangeError);
  });

  it('gauges are 0 to 10', () => {
    expect(scoredGauge(7, 'low')).toEqual({ kind: 'scored-gauge', value: 7, confidence: 'low' });
    expect(() => scoredGauge(10.1, 'low')).toThrow(RangeError);
    expect(() => scoredGauge(NaN, 'low')).toThrow(RangeError);
  });

  it('not-scorable keeps the reason and the missing question ids', () => {
    expect(notScorable('missing-answers', ['E1', 'E2'])).toEqual({
      kind: 'not-scorable',
      reason: 'missing-answers',
      missing: ['E1', 'E2'],
    });
  });
});
