import { describe, expect, it } from 'vitest';
import { northbridge } from '@/fixtures/northbridge';
import { CONFIG_VERSION, questionsConfig } from '../config';
import { evidenceTags } from './answer';

describe('Northbridge sample audit', () => {
  it('is flagged as sample data', () => {
    expect(northbridge.isSample).toBe(true);
  });

  it('stores answers and the config version, never scores', () => {
    expect(northbridge.audit.configVersion).toBe(CONFIG_VERSION);
    expect(Object.keys(northbridge.audit)).not.toContain('scores');
  });

  it('only answers questions that exist, once each', () => {
    const ids = northbridge.audit.answers.map((a) => a.questionId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(questionsConfig.some((q) => q.id === id)).toBe(true);
  });

  it('every known answer has a real evidence tag', () => {
    for (const a of northbridge.audit.answers) {
      if (a.kind === 'known') expect(evidenceTags).toContain(a.evidence);
    }
  });

  it('keeps the design numbers as display fixtures, with Community Influence not scorable', () => {
    expect(northbridge.design.scores['community-influence']).toBeNull();
    expect(northbridge.design.scores.readiness).toBe(68);
    expect(northbridge.design.answeredOf40).toBe(28);
  });
});
