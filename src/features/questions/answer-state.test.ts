import { describe, expect, it } from 'vitest';
import { known } from '@/fixtures/builders';
import { domainConfig } from '@/domain/config';
import {
  answerFor,
  countHandled,
  isUnsure,
  knownFor,
  setAnswer,
  setEvidence,
  toggleUnsure,
} from './answer-state';

describe('setAnswer', () => {
  it('adds a known answer with the default tag when none is asked, and confidence from config', () => {
    const next = setAnswer([], 'B1', 9, domainConfig);
    expect(next).toEqual([
      {
        kind: 'known',
        questionId: 'B1',
        value: 9,
        evidence: 'institution-reported',
        confidence: 'medium',
      },
    ]);
  });

  it('uses the given tag and the confidence that follows it', () => {
    expect(knownFor(setAnswer([], 'B1', 9, domainConfig, 'verified'), 'B1')).toMatchObject({
      evidence: 'verified',
      confidence: 'high',
    });
  });

  it('keeps an existing tag when the value changes', () => {
    const first = setAnswer([], 'B1', 9, domainConfig, 'estimate');
    expect(knownFor(setAnswer(first, 'B1', 12, domainConfig), 'B1')).toMatchObject({
      value: 12,
      evidence: 'estimate',
      confidence: 'low',
    });
  });

  it('replaces the previous answer instead of adding a second', () => {
    const next = setAnswer([known('B1', 3)], 'B1', 9, domainConfig);
    expect(next.filter((a) => a.questionId === 'B1')).toHaveLength(1);
  });

  it('answering a question marked Not sure replaces the mark', () => {
    const next = setAnswer(toggleUnsure([], 'B1'), 'B1', 9, domainConfig);
    expect(isUnsure(next, 'B1')).toBe(false);
    expect(knownFor(next, 'B1')?.value).toBe(9);
  });

  it('does not change the list it was given', () => {
    const before = [known('A1', 'x')];
    setAnswer(before, 'B1', 1, domainConfig);
    expect(before).toHaveLength(1);
  });
});

describe('setEvidence', () => {
  it('changes the tag and the confidence, keeping the value', () => {
    const next = setEvidence([known('B1', 9, 'verified', 'high')], 'B1', 'estimate', domainConfig);
    expect(knownFor(next, 'B1')).toMatchObject({
      value: 9,
      evidence: 'estimate',
      confidence: 'low',
    });
  });

  it('does nothing when the question has no answer', () => {
    expect(setEvidence([], 'B1', 'verified', domainConfig)).toEqual([]);
  });
});

describe('toggleUnsure', () => {
  it('marks Not sure and drops the value', () => {
    const next = toggleUnsure([known('B1', 9)], 'B1');
    expect(isUnsure(next, 'B1')).toBe(true);
    expect(knownFor(next, 'B1')).toBeUndefined();
  });

  it('toggles back to no answer', () => {
    expect(answerFor(toggleUnsure(toggleUnsure([], 'B1'), 'B1'), 'B1')).toBeUndefined();
  });
});

describe('countHandled', () => {
  it('counts answered and Not sure, ignores untouched and other questions', () => {
    const answers = [known('A1', 'x'), ...toggleUnsure([], 'B1'), known('D2', 'y')];
    expect(countHandled(answers, ['A1', 'B1', 'C1'])).toBe(2);
  });
});
