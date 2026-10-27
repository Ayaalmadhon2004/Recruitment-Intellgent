import { describe, expect, it } from 'vitest';
import { domainConfig } from '../config';
import { evidenceTags } from '../types';
import { confidenceFor } from './evidence';

describe('confidenceFor', () => {
  it('maps every known evidence tag to a confidence', () => {
    for (const tag of evidenceTags.filter((t) => t !== 'unknown')) {
      expect(['high', 'medium', 'low']).toContain(confidenceFor(tag, domainConfig));
    }
  });

  it('orders verified above institution-reported above estimate (placeholder rule)', () => {
    expect(confidenceFor('verified', domainConfig)).toBe('high');
    expect(confidenceFor('institution-reported', domainConfig)).toBe('medium');
    expect(confidenceFor('estimate', domainConfig)).toBe('low');
  });

  it('is read from config, so changing config changes the result', () => {
    const config = {
      ...domainConfig,
      evidence: {
        ...domainConfig.evidence,
        confidenceByTag: { ...domainConfig.evidence.confidenceByTag, estimate: 'high' as const },
      },
    };
    expect(confidenceFor('estimate', config)).toBe('high');
  });

  it('is labelled a placeholder until Capstone confirms the rule', () => {
    expect(domainConfig.evidence.status).toBe('placeholder');
  });
});
