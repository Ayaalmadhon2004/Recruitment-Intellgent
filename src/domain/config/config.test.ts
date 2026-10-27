import { describe, expect, it } from 'vitest';
import { t } from '../copy';
import type { CopyKey } from '../copy';
import { affordabilityComponentIds, agentFactorIds, scoreAreaIds, gaugeIds } from '../types';
import { agentsConfig, domainConfig, questionsConfig, scoringConfig, stagesConfig, tbcConfig } from '.';

function numbers(value: unknown, path = ''): Array<[string, number]> {
  if (typeof value === 'number') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => numbers(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => numbers(v, `${path}.${k}`));
  }
  return [];
}

function exists(key: CopyKey): boolean {
  const text = t(key);
  return typeof text === 'string' && text.length > 0;
}

describe('weights', () => {
  it('Affordability weights sum to 100 and cover exactly the six components', () => {
    const weights = scoringConfig.affordabilityWeights;
    expect(Object.keys(weights).sort()).toEqual([...affordabilityComponentIds].sort());
    expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBe(100);
    expect(weights).toEqual({
      'net-annual-cost': 30,
      'scholarship-attainability': 15,
      'cost-transparency': 10,
      'graduate-outcomes': 20,
      'academic-career-value': 15,
      'financial-risk-mitigation': 10,
    });
  });

  it('agent factor weights are the seven sample weights and sum to 100', () => {
    expect(agentsConfig.factors.map((f) => f.id)).toEqual(agentFactorIds);
    expect(agentsConfig.factors.map((f) => f.weight)).toEqual([20, 18, 15, 14, 13, 10, 10]);
    expect(agentsConfig.factors.reduce((s, f) => s + f.weight, 0)).toBe(100);
  });

  it('the pilot is 6 months, 3 agents, non-exclusive, 10 to 15 percent commission', () => {
    expect(agentsConfig.pilot).toEqual({
      durationMonths: 6,
      agentCount: 3,
      exclusive: false,
      commissionBenchmarkPercent: { min: 10, max: 15 },
    });
  });
});

describe('ranges', () => {
  it('stages run from 0 with no gaps or overlaps and an open top stage', () => {
    const stages = stagesConfig.stages;
    expect(stages[0]?.min).toBe(0);
    for (let i = 1; i < stages.length; i += 1) {
      expect(stages[i]?.min).toBe((stages[i - 1]?.max ?? NaN) + 1);
    }
    expect(stages.at(-1)?.max).toBeNull();
  });

  it('price bands are contiguous from $0 with an open top band', () => {
    const bands = scoringConfig.priceBands;
    expect(bands[0]?.minUsd).toBe(0);
    for (let i = 1; i < bands.length; i += 1) {
      expect(bands[i]?.minUsd).toBe(bands[i - 1]?.maxUsd);
    }
    expect(bands.at(-1)?.maxUsd).toBeNull();
  });

  it('score areas and gauges are all listed', () => {
    expect(scoringConfig.areas.map((a) => a.id)).toEqual(scoreAreaIds);
    expect(scoringConfig.gauges.map((g) => g.id)).toEqual(gaugeIds);
  });
});

describe('placeholders are never taken for real values', () => {
  it('no number anywhere in config is NaN or infinite', () => {
    for (const [path, n] of numbers(domainConfig)) {
      expect(Number.isFinite(n), `config${path} is ${n}`).toBe(true);
    }
  });

  it('band cut-offs, sample weights and temporary content carry their status', () => {
    expect(scoringConfig.bandsStatus).toBe('placeholder');
    expect(agentsConfig.factorsStatus).toBe('sample');
    expect(stagesConfig.sourceStatus).toBe('temporary');
    expect(scoringConfig.affordabilityWeightsStatus).toBe('confirmed');
    expect(questionsConfig.every((q) => q.temporary)).toBe(true);
  });

  it('every area and gauge formula is absent, so nothing is invented', () => {
    expect(Object.values(scoringConfig.formulas).every((f) => f === null)).toBe(true);
    expect(Object.keys(scoringConfig.formulas).sort()).toEqual([...scoreAreaIds, ...gaugeIds].sort());
  });

  it('every unknown is null in tbc.config', () => {
    for (const [key, value] of Object.entries(tbcConfig)) {
      expect(value, `tbc.${key}`).toBeNull();
    }
  });

  it('the temporary Quick Start questions are exactly A1, B1, C1, D1 and F1', () => {
    const quick = questionsConfig.filter((q) => q.quickStart);
    expect(quick.map((q) => q.id)).toEqual(['A1', 'B1', 'C1', 'D1', 'F1']);
    expect(quick.every((q) => q.temporary)).toBe(true);
  });
});

describe('questions', () => {
  it('has unique ids whose letter matches the section', () => {
    const ids = questionsConfig.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of questionsConfig) expect(q.id.startsWith(q.section)).toBe(true);
  });

  it('covers sections A to F', () => {
    expect(new Set(questionsConfig.map((q) => q.section))).toEqual(new Set(['A', 'B', 'C', 'D', 'E', 'F']));
  });

  it('every text, help, option and control key resolves in copy', () => {
    for (const q of questionsConfig) {
      expect(exists(q.textKey), q.textKey).toBe(true);
      expect(exists(q.helpKey), q.helpKey).toBe(true);
      if (q.type === 'number') {
        for (const key of [q.controlLabelKey, q.unitKey, q.placeholderKey]) expect(exists(key), key).toBe(true);
      }
      if (q.type === 'select' || q.type === 'radio' || q.type === 'chips') {
        if (q.controlLabelKey) expect(exists(q.controlLabelKey), q.controlLabelKey).toBe(true);
        const values = q.options.map((o) => o.value);
        expect(new Set(values).size).toBe(values.length);
        for (const o of q.options) {
          expect(exists(o.labelKey), o.labelKey).toBe(true);
          if (o.descriptionKey) expect(exists(o.descriptionKey), o.descriptionKey).toBe(true);
        }
      }
    }
  });

  it('every name and label key used by config resolves in copy', () => {
    const keys: CopyKey[] = [
      ...scoringConfig.areas.map((a) => a.nameKey),
      ...scoringConfig.gauges.map((g) => g.nameKey),
      ...scoringConfig.bands.map((b) => b.labelKey),
      ...scoringConfig.priceBands.map((b) => b.labelKey),
      ...stagesConfig.stages.map((s) => s.labelKey),
      ...agentsConfig.factors.map((f) => f.nameKey),
    ];
    for (const key of keys) expect(exists(key), key).toBe(true);
  });

  it('the stage source question exists and is a number question', () => {
    const source = questionsConfig.find((q) => q.id === stagesConfig.source.questionId);
    expect(source?.type).toBe('number');
  });
});
