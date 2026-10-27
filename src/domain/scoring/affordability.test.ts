import { describe, expect, it } from 'vitest';
import { known } from '@/fixtures/builders';
import { domainConfig } from '../config';
import type { DomainConfig, Question } from '../types';
import { affordabilityComponentIds } from '../types';
import { assertWeightsSumTo100, scoreAffordability } from './affordability';
import type { AffordabilityComponents } from './affordability';

const all = (value: number): AffordabilityComponents =>
  Object.fromEntries(affordabilityComponentIds.map((id) => [id, value]));

const feedQuestion = (id: Question['id'], component: (typeof affordabilityComponentIds)[number]): Question => ({
  id,
  section: 'C',
  textKey: 'questions.C1.text',
  helpKey: 'questions.C1.help',
  feeds: [{ area: 'affordability', component }],
  quickStart: false,
  temporary: true,
  type: 'toggle',
});

describe('scoreAffordability', () => {
  it('weights the six components 30/15/10/20/15/10', () => {
    const result = scoreAffordability(
      {
        'net-annual-cost': 80,
        'scholarship-attainability': 60,
        'cost-transparency': 40,
        'graduate-outcomes': 70,
        'academic-career-value': 50,
        'financial-risk-mitigation': 90,
      },
      'medium',
      [],
      domainConfig,
    );
    // (30x80 + 15x60 + 10x40 + 20x70 + 15x50 + 10x90) / 100
    expect(result).toEqual({ kind: 'scored', value: 67.5, band: 'developing', confidence: 'medium' });
  });

  it('gives 100 when every component is 100 and 0 when every component is 0', () => {
    expect(scoreAffordability(all(100), 'high', [], domainConfig)).toMatchObject({ value: 100, band: 'strong' });
    expect(scoreAffordability(all(0), 'low', [], domainConfig)).toMatchObject({
      value: 0,
      band: 'needs-attention',
    });
  });

  it('uses the band cut-offs at the boundaries', () => {
    expect(scoreAffordability(all(54), 'low', [], domainConfig)).toMatchObject({ band: 'needs-attention' });
    expect(scoreAffordability(all(55), 'low', [], domainConfig)).toMatchObject({ band: 'developing' });
    expect(scoreAffordability(all(75), 'low', [], domainConfig)).toMatchObject({ band: 'strong' });
  });

  it('changing the weights in config changes the result with no code change', () => {
    const config: DomainConfig = {
      ...domainConfig,
      scoring: {
        ...domainConfig.scoring,
        affordabilityWeights: {
          'net-annual-cost': 100,
          'scholarship-attainability': 0,
          'cost-transparency': 0,
          'graduate-outcomes': 0,
          'academic-career-value': 0,
          'financial-risk-mitigation': 0,
        },
      },
    };
    const components = { ...all(10), 'net-annual-cost': 90 };
    expect(scoreAffordability(components, 'high', [], config)).toMatchObject({ value: 90 });
    expect(scoreAffordability(components, 'high', [], domainConfig)).toMatchObject({ value: 10 + 0.3 * 80 });
  });

  it('is NotScorable when a component is missing, listing unanswered questions that feed it', () => {
    const config: DomainConfig = {
      ...domainConfig,
      questions: [
        feedQuestion('C1', 'net-annual-cost'),
        feedQuestion('C2', 'scholarship-attainability'),
        feedQuestion('C3', 'cost-transparency'),
      ],
    };
    const components = { ...all(50) };
    delete components['scholarship-attainability'];
    delete components['cost-transparency'];
    const result = scoreAffordability(components, 'high', [known('C3', true)], config);
    expect(result).toEqual({ kind: 'not-scorable', reason: 'missing-answers', missing: ['C2'] });
  });

  it('is NotScorable with an empty list when no configured question feeds the missing component', () => {
    const result = scoreAffordability({}, 'high', [], domainConfig);
    expect(result).toEqual({ kind: 'not-scorable', reason: 'missing-answers', missing: [] });
  });

  it.each([-1, 101, NaN])('rejects a component of %s', (value) => {
    expect(() => scoreAffordability({ ...all(50), 'net-annual-cost': value }, 'high', [], domainConfig)).toThrow(
      RangeError,
    );
  });
});

describe('assertWeightsSumTo100', () => {
  it('rejects weights that do not sum to 100', () => {
    const weights = { ...domainConfig.scoring.affordabilityWeights, 'net-annual-cost': 31 };
    expect(() => assertWeightsSumTo100(weights)).toThrow('sum to 100');
    const config: DomainConfig = { ...domainConfig, scoring: { ...domainConfig.scoring, affordabilityWeights: weights } };
    expect(() => scoreAffordability(all(50), 'high', [], config)).toThrow('sum to 100');
  });

  it('accepts the configured weights', () => {
    expect(() => assertWeightsSumTo100(domainConfig.scoring.affordabilityWeights)).not.toThrow();
  });
});
