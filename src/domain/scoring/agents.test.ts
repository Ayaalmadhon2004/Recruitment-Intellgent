import { describe, expect, it } from 'vitest';
import { agentsConfig } from '../config';
import type { AgentFactor, AgentRatings } from '../types';
import { strongestAndWeakest, weightedAgentScore } from './agents';

const { factors, rating } = agentsConfig;

const ratings = (values: readonly number[]): AgentRatings =>
  Object.fromEntries(factors.map((f, i) => [f.id, values[i]])) as AgentRatings;

describe('weightedAgentScore', () => {
  it('is sum(weight x rating) / 100', () => {
    // 20*4 + 18*3 + 15*4 + 14*5 + 13*4 + 10*3 + 10*4 = 386
    expect(weightedAgentScore(ratings([4, 3, 4, 5, 4, 3, 4]), factors, rating)).toBeCloseTo(
      3.86,
      10,
    );
  });

  it('is the rating itself when every factor has the same rating', () => {
    expect(weightedAgentScore(ratings([5, 5, 5, 5, 5, 5, 5]), factors, rating)).toBe(5);
    expect(weightedAgentScore(ratings([1, 1, 1, 1, 1, 1, 1]), factors, rating)).toBe(1);
  });

  it('changes when the weights in a config copy change, with no code edit', () => {
    const r = ratings([5, 1, 1, 1, 1, 1, 1]);
    const before = weightedAgentScore(r, factors, rating);
    const reweighted: AgentFactor[] = factors.map((f, i) => ({
      ...f,
      weight: i === 0 ? 38 : i === 1 ? 0 : f.weight,
    }));
    const after = weightedAgentScore(r, reweighted, rating);
    expect(before).toBeCloseTo((20 * 5 + 80) / 100, 10);
    expect(after).toBeCloseTo((38 * 5 + 62) / 100, 10);
    expect(after).toBeGreaterThan(before);
  });

  it('rejects weights that do not sum to 100', () => {
    const broken = factors.map((f, i) => (i === 0 ? { ...f, weight: 21 } : f));
    expect(() => weightedAgentScore(ratings([3, 3, 3, 3, 3, 3, 3]), broken, rating)).toThrow(
      RangeError,
    );
  });

  it('rejects a missing factor', () => {
    const r = ratings([3, 3, 3, 3, 3, 3, 3]) as Partial<Record<string, number>>;
    delete r['compliance'];
    expect(() => weightedAgentScore(r as AgentRatings, factors, rating)).toThrow(/Missing rating/);
  });

  it.each([0, 6, 2.5, Number.NaN, -1])('rejects the rating %s', (bad) => {
    expect(() => weightedAgentScore(ratings([3, 3, 3, 3, 3, 3, bad]), factors, rating)).toThrow(
      RangeError,
    );
  });

  it('uses the rating range from config', () => {
    expect(() =>
      weightedAgentScore(ratings([6, 6, 6, 6, 6, 6, 6]), factors, { min: 1, max: 10 }),
    ).not.toThrow();
  });
});

describe('strongestAndWeakest', () => {
  it('finds the highest and lowest rated factor', () => {
    const result = strongestAndWeakest(ratings([5, 2, 2, 4, 3, 5, 5]), factors);
    expect(result.strongest).toEqual({ id: 'student-fit', rating: 5 });
    expect(result.weakest).toEqual({ id: 'market-presence', rating: 2 });
  });

  it('breaks ties by factor order', () => {
    const result = strongestAndWeakest(ratings([4, 3, 4, 5, 4, 3, 5]), factors);
    expect(result.strongest.id).toBe('counselling');
    expect(result.weakest.id).toBe('market-presence');
  });

  it('gives the first factor as both when every rating is equal', () => {
    const result = strongestAndWeakest(ratings([3, 3, 3, 3, 3, 3, 3]), factors);
    expect(result.strongest.id).toBe('student-fit');
    expect(result.weakest.id).toBe('student-fit');
  });

  it('follows the order of the factors passed in', () => {
    const reversed = [...factors].reverse();
    const result = strongestAndWeakest(ratings([5, 2, 2, 4, 3, 5, 5]), reversed);
    expect(result.strongest.id).toBe('commission-fit');
    expect(result.weakest.id).toBe('city-coverage');
  });

  it('rejects a missing factor and an empty factor list', () => {
    const r = ratings([3, 3, 3, 3, 3, 3, 3]) as Partial<Record<string, number>>;
    delete r['student-fit'];
    expect(() => strongestAndWeakest(r as AgentRatings, factors)).toThrow(/Missing rating/);
    expect(() => strongestAndWeakest(ratings([3, 3, 3, 3, 3, 3, 3]), [])).toThrow(RangeError);
  });

  it('rejects a rating that is not a number', () => {
    expect(() => strongestAndWeakest(ratings([3, 3, 3, 3, 3, 3, Number.NaN]), factors)).toThrow(
      RangeError,
    );
  });
});
