import { describe, expect, it } from 'vitest';
import { known, unknown } from '@/fixtures/builders';
import { domainConfig } from '../config';
import type { DomainConfig, Question } from '../types';
import { gaugeIds, scoreAreaIds } from '../types';
import { scoreArea, scoreGauge } from './score-area';

const withFeeds = (feeds: Question['feeds'], id: Question['id'] = 'E1'): Question => ({
  id,
  section: 'E',
  textKey: 'questions.E1.text',
  helpKey: 'questions.E1.help',
  feeds,
  quickStart: false,
  temporary: true,
  type: 'toggle',
});

const configWith = (questions: readonly Question[]): DomainConfig => ({
  ...domainConfig,
  questions,
});

describe('scoreArea', () => {
  it.each(scoreAreaIds)('%s is NotScorable because no formula exists', (areaId) => {
    const result = scoreArea(areaId, [], domainConfig);
    expect(result.kind).toBe('not-scorable');
    if (result.kind === 'not-scorable') expect(result.reason).toBe('no-formula');
  });

  it('never returns a number, even with every answer present', () => {
    const answers = domainConfig.questions.map((q) => known(q.id, true));
    for (const areaId of scoreAreaIds) {
      expect(scoreArea(areaId, answers, domainConfig).kind).toBe('not-scorable');
    }
  });

  it('lists the unanswered questions that feed the area', () => {
    const config = configWith([
      withFeeds([{ area: 'community-influence' }], 'E1'),
      withFeeds([{ area: 'community-influence' }], 'E2'),
      withFeeds([{ area: 'readiness' }], 'D1'),
    ]);
    const result = scoreArea('community-influence', [known('E1', true)], config);
    expect(result).toEqual({ kind: 'not-scorable', reason: 'no-formula', missing: ['E2'] });
  });

  it('counts "Not sure" as missing', () => {
    const config = configWith([withFeeds([{ area: 'trust-network' }], 'E1')]);
    const result = scoreArea('trust-network', [unknown('E1')], config);
    expect(result).toMatchObject({ kind: 'not-scorable', missing: ['E1'] });
  });
});

describe('scoreGauge', () => {
  it.each(gaugeIds)('%s is NotScorable because no formula exists', (gaugeId) => {
    expect(scoreGauge(gaugeId, [], domainConfig)).toMatchObject({
      kind: 'not-scorable',
      reason: 'no-formula',
    });
  });

  it('lists the unanswered questions that feed the gauge', () => {
    const config = configWith([withFeeds([{ area: 'school-fit' }], 'A1')]);
    expect(scoreGauge('school-fit', [], config)).toMatchObject({ missing: ['A1'] });
  });
});
