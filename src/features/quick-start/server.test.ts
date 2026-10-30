import { describe, expect, it } from 'vitest';
import { northbridge } from '@/fixtures/northbridge';
import { known, unknown } from '@/fixtures/builders';
import { scoreAreaIds } from '@/domain/types';
import { MAX_ANSWERS, computeFirstRead, parseFirstReadRequest } from './server';

const validKnown = {
  kind: 'known',
  questionId: 'B1',
  value: 9,
  evidence: 'verified',
  confidence: 'high',
};

function parse(answers: unknown): ReturnType<typeof parseFirstReadRequest> {
  return parseFirstReadRequest({ answers });
}

describe('parseFirstReadRequest', () => {
  it('accepts known and unknown answers', () => {
    const result = parse([validKnown, { kind: 'unknown', questionId: 'A1' }]);
    expect(result).toEqual({
      ok: true,
      answers: [
        { kind: 'known', questionId: 'B1', value: 9, evidence: 'verified', confidence: 'high' },
        { kind: 'unknown', questionId: 'A1' },
      ],
    });
  });

  it('accepts boolean, string and string-array values and keeps duplicates', () => {
    const result = parse([
      { ...validKnown, questionId: 'A4', value: true },
      { ...validKnown, questionId: 'A1', value: 'private-university' },
      { ...validKnown, questionId: 'A3', value: ['bachelor', 'master'] },
      validKnown,
      validKnown,
    ]);
    expect(result.ok && result.answers).toHaveLength(5);
  });

  it('drops extra keys from the parsed answer', () => {
    const result = parse([{ kind: 'unknown', questionId: 'A1', extra: 'x' }]);
    expect(result).toEqual({ ok: true, answers: [{ kind: 'unknown', questionId: 'A1' }] });
  });

  it.each([
    ['null body', null],
    ['array body', []],
    ['missing answers', {}],
    ['answers not an array', { answers: 'x' }],
    ['empty answers', { answers: [] }],
  ])('rejects %s', (_name, body) => {
    expect(parseFirstReadRequest(body).ok).toBe(false);
  });

  it('rejects more than the maximum number of answers', () => {
    const tooMany = Array.from({ length: MAX_ANSWERS + 1 }, () => ({
      kind: 'unknown',
      questionId: 'A1',
    }));
    expect(parse(tooMany).ok).toBe(false);
    expect(parse(tooMany.slice(0, MAX_ANSWERS)).ok).toBe(true);
  });

  it.each([
    ['non-object item', 'x'],
    ['missing questionId', { kind: 'unknown' }],
    ['malformed questionId', { kind: 'unknown', questionId: 'b1' }],
    ['questionId with bad section', { kind: 'unknown', questionId: 'G1' }],
    ['questionId not in config', { kind: 'unknown', questionId: 'A99' }],
    ['bad kind', { kind: 'maybe', questionId: 'A1' }],
    ['missing value', { ...validKnown, value: undefined }],
    ['null value', { ...validKnown, value: null }],
    ['object value', { ...validKnown, value: {} }],
    ['non-finite number', { ...validKnown, value: Number.POSITIVE_INFINITY }],
    ['NaN', { ...validKnown, value: Number.NaN }],
    ['empty array value', { ...validKnown, value: [] }],
    ['array of numbers', { ...validKnown, value: [1] }],
    ['overlong array', { ...validKnown, value: Array.from({ length: 51 }, () => 'a') }],
    ['overlong string', { ...validKnown, value: 'a'.repeat(201) }],
    ['evidence unknown', { ...validKnown, evidence: 'unknown' }],
    ['bad evidence', { ...validKnown, evidence: 'guess' }],
    ['missing evidence', { ...validKnown, evidence: undefined }],
    ['bad confidence', { ...validKnown, confidence: 'certain' }],
    ['missing confidence', { ...validKnown, confidence: undefined }],
  ])('rejects %s', (_name, item) => {
    const result = parse([item]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('answers[0]');
  });
});

describe('computeFirstRead', () => {
  it('with no answers: stage is NotScorable (missing B1) and all six areas are NotScorable', () => {
    const result = computeFirstRead([]);
    expect(result.stage).toMatchObject({ kind: 'not-scorable', missing: ['B1'] });
    expect(Object.keys(result.areas).sort()).toEqual([...scoreAreaIds].sort());
    for (const id of scoreAreaIds) {
      expect(result.areas[id]).toMatchObject({ kind: 'not-scorable', reason: 'no-formula' });
    }
    expect(result.answeredCount).toBe(0);
    expect(result.quickStartTotal).toBe(5);
    expect(result.configVersion).toBeTruthy();
  });

  it('Northbridge sample gives the building stage, still no area scores', () => {
    const result = computeFirstRead(northbridge.audit.answers);
    expect(result.stage).toEqual({ kind: 'staged', stage: 'building' });
    for (const id of scoreAreaIds) expect(result.areas[id].kind).toBe('not-scorable');
    expect(result.answeredCount).toBe(5);
  });

  it('"Not sure" does not count as answered', () => {
    const result = computeFirstRead([
      known('B1', 9, 'verified', 'high'),
      unknown('A1'),
      unknown('C1'),
    ]);
    expect(result.answeredCount).toBe(1);
    expect(computeFirstRead([unknown('B1')]).stage.kind).toBe('not-scorable');
  });

  it('only counts Quick Start questions', () => {
    const result = computeFirstRead([known('A2', 'building', 'verified', 'high')]);
    expect(result.answeredCount).toBe(0);
  });
});
