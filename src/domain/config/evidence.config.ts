import type { EvidenceConfig } from '../types';

/**
 * PLACEHOLDER. The design says the evidence tag "sets your confidence" but gives no mapping, so this
 * follows the obvious order (verified > institution-reported > estimate) and is NOT a confirmed rule.
 * `defaultTag` covers Quick Start, which asks no tag: answers there come from the institution's own team.
 */
export const evidenceConfig: EvidenceConfig = {
  status: 'placeholder',
  confidenceByTag: {
    verified: 'high',
    'institution-reported': 'medium',
    estimate: 'low',
    judgement: 'low',
  },
  defaultTag: 'institution-reported',
};
