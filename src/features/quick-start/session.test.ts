import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Answer } from '@/domain/types';
import type { FirstReadResponse } from './contract';
import { computeFirstRead } from './server';
import { clear, loadAnswers, loadFirstRead, saveFirstRead } from './session';

const answers: Answer[] = [
  { kind: 'known', questionId: 'B1', value: 9, evidence: 'estimate', confidence: 'low' },
  { kind: 'unknown', questionId: 'F1' },
];

beforeEach(() => {
  window.sessionStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('quick start session', () => {
  it('round-trips answers and the result', () => {
    const result: FirstReadResponse = computeFirstRead(answers);
    saveFirstRead(answers, result);
    expect(loadAnswers()).toEqual(answers);
    expect(loadFirstRead()).toEqual({ answers, result });
  });

  it('returns only answers when no plausible result is stored', () => {
    saveFirstRead(answers);
    expect(loadFirstRead()).toEqual({ answers });
  });

  it('drops invalid JSON and clears it', () => {
    window.sessionStorage.setItem('vri.quick-start', '{not json');
    expect(loadAnswers()).toBeUndefined();
    expect(window.sessionStorage.getItem('vri.quick-start')).toBeNull();
  });

  it.each([
    ['wrong shape', '{"answers":"nope"}'],
    ['unknown question', '{"answers":[{"kind":"unknown","questionId":"A9"}]}'],
    [
      'bad evidence',
      '{"answers":[{"kind":"known","questionId":"B1","value":1,"evidence":"x","confidence":"low"}]}',
    ],
    ['empty list', '{"answers":[]}'],
    ['null', 'null'],
  ])('drops stored data with %s', (_name, raw) => {
    window.sessionStorage.setItem('vri.quick-start', raw);
    expect(loadAnswers()).toBeUndefined();
    expect(loadFirstRead()).toBeUndefined();
  });

  it('clear removes the stored data', () => {
    saveFirstRead(answers);
    clear();
    expect(loadAnswers()).toBeUndefined();
  });

  it('does not throw when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => saveFirstRead(answers)).not.toThrow();
    expect(loadAnswers()).toBeUndefined();
    expect(loadFirstRead()).toBeUndefined();
    expect(() => clear()).not.toThrow();
  });
});
