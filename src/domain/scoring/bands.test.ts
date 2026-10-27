import { describe, expect, it } from 'vitest';
import { scoringConfig } from '../config';
import type { Band } from '../types';
import { assertValidBands, bandFor } from './bands';

const bands = scoringConfig.bands;

describe('bandFor with the placeholder bands', () => {
  it.each([
    [0, 'needs-attention'],
    [54, 'needs-attention'],
    [54.9, 'needs-attention'],
    [55, 'developing'],
    [74, 'developing'],
    [74.9, 'developing'],
    [75, 'strong'],
    [100, 'strong'],
  ] as const)('%s is %s', (value, expected) => {
    expect(bandFor(value, bands)).toBe(expected);
  });

  it('does not depend on the order of the bands', () => {
    expect(bandFor(60, [...bands].reverse())).toBe('developing');
  });

  it.each([-1, 100.1, NaN, Infinity])('rejects %s', (value) => {
    expect(() => bandFor(value, bands)).toThrow(RangeError);
  });
});

describe('assertValidBands', () => {
  const band = (id: Band['id'], min: number): Band => ({ id, labelKey: 'bands.strong', min });

  it('rejects an empty list', () => {
    expect(() => assertValidBands([])).toThrow('At least one band');
  });

  it('rejects duplicate cut-offs', () => {
    expect(() => assertValidBands([band('strong', 0), band('developing', 0)])).toThrow('unique');
  });

  it('rejects bands that leave low scores without a band', () => {
    expect(() => assertValidBands([band('strong', 75), band('developing', 55)])).toThrow('start at 0');
  });

  it('rejects cut-offs outside 0 to 100', () => {
    expect(() => assertValidBands([band('strong', 101), band('developing', 0)])).toThrow('0 to 100');
  });
});
