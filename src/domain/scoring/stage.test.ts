import { describe, expect, it } from 'vitest';
import { known, unknown } from '@/fixtures/builders';
import { northbridge } from '@/fixtures/northbridge';
import { domainConfig } from '../config';
import { pickStage } from './stage';

const stageFor = (headcount: number) => pickStage([known('B1', headcount)], domainConfig);

describe('pickStage', () => {
  it.each([
    [0, 'starting'],
    [5, 'starting'],
    [6, 'building'],
    [15, 'building'],
    [16, 'growing'],
    [30, 'growing'],
    [31, 'established'],
    [5000, 'established'],
  ] as const)('%s students is %s', (headcount, expected) => {
    expect(stageFor(headcount)).toEqual({ kind: 'staged', stage: expected });
  });

  it('is NotScorable when the headcount question is unanswered', () => {
    expect(pickStage([], domainConfig)).toEqual({
      kind: 'not-scorable',
      reason: 'missing-answers',
      missing: ['B1'],
    });
  });

  it('is NotScorable when the answer is "Not sure"', () => {
    expect(pickStage([unknown('B1')], domainConfig)).toMatchObject({ reason: 'missing-answers' });
  });

  it.each([-1, 5.5, NaN, Infinity])(
    'is NotScorable for an unusable headcount of %s',
    (headcount) => {
      expect(stageFor(headcount)).toEqual({
        kind: 'not-scorable',
        reason: 'invalid-answer',
        missing: ['B1'],
      });
    },
  );

  it.each([['9'], [true], [['9']]])(
    'is NotScorable when the value is not a number (%s)',
    (value) => {
      expect(pickStage([known('B1', value)], domainConfig)).toMatchObject({
        reason: 'invalid-answer',
      });
    },
  );

  it('uses the latest answer', () => {
    expect(pickStage([known('B1', 2), known('B1', 20)], domainConfig)).toEqual({
      kind: 'staged',
      stage: 'growing',
    });
  });

  it('is NotScorable when a headcount falls outside every stage', () => {
    const config = {
      ...domainConfig,
      stages: { ...domainConfig.stages, stages: domainConfig.stages.stages.slice(0, 2) },
    };
    expect(pickStage([known('B1', 40)], config)).toMatchObject({ reason: 'invalid-answer' });
  });

  it('puts the Northbridge sample in Building, like the design', () => {
    expect(pickStage(northbridge.audit.answers, domainConfig)).toEqual({
      kind: 'staged',
      stage: northbridge.design.stage,
    });
  });
});
