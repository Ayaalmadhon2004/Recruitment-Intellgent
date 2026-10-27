import { describe, expect, it } from 'vitest';
import type { Recommendation } from '@/domain/types';
import { rankRecommendations } from './rank';

const LOW = 1;
const MID = 5;
const HIGH = 9;

/** Synthetic recommendations. The real list is not defined yet. Titles reuse any existing copy key. */
const rec = (id: string, areaId: Recommendation['areaId'], impact: number): Recommendation => ({
  id,
  areaId,
  titleKey: 'questions.A4.text',
  impact,
});

describe('rankRecommendations', () => {
  it('orders by impact, largest first', () => {
    const input = [
      rec('a', 'readiness', LOW),
      rec('b', 'readiness', HIGH),
      rec('c', 'readiness', MID),
    ];
    expect(rankRecommendations(input, 'readiness').map((r) => r.id)).toEqual(['b', 'c', 'a']);
  });

  it('keeps the input order for equal impact', () => {
    const input = [
      rec('a', 'readiness', MID),
      rec('b', 'readiness', MID),
      rec('c', 'readiness', MID),
    ];
    expect(rankRecommendations(input, 'readiness').map((r) => r.id)).toEqual(['a', 'b', 'c']);
  });

  it('does not change its input', () => {
    const input = [rec('a', 'readiness', LOW), rec('b', 'readiness', HIGH)];
    const copy = [...input];
    rankRecommendations(input, 'readiness');
    expect(input).toEqual(copy);
  });

  it('keeps only the given area', () => {
    const input = [rec('a', 'readiness', LOW), rec('b', 'affordability', HIGH)];
    expect(rankRecommendations(input, 'affordability').map((r) => r.id)).toEqual(['b']);
    expect(rankRecommendations(input, 'trust-network')).toEqual([]);
  });
});
