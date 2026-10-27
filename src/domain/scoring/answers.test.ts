import { describe, expect, it } from 'vitest';
import { known, unknown } from '@/fixtures/builders';
import { findAnswer, findKnownAnswer, isAnswered } from './answers';

describe('answer lookup', () => {
  it('returns the latest answer for a question', () => {
    const answers = [known('B1', 3), known('B1', 9)];
    expect(findAnswer(answers, 'B1')).toEqual(known('B1', 9));
  });

  it('returns undefined when there is no answer', () => {
    expect(findAnswer([], 'B1')).toBeUndefined();
  });

  it('treats "Not sure" as not answered', () => {
    const answers = [unknown('B1')];
    expect(findAnswer(answers, 'B1')?.kind).toBe('unknown');
    expect(findKnownAnswer(answers, 'B1')).toBeUndefined();
    expect(isAnswered(answers, 'B1')).toBe(false);
  });

  it('treats a known answer as answered', () => {
    expect(isAnswered([known('B1', 0)], 'B1')).toBe(true);
  });
});
