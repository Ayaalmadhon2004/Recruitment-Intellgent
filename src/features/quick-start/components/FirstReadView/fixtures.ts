import { notScorable, scored } from '@/domain/scoring';
import type { ScoreAreaId, ScoreResult } from '@/domain/types';
import type { FirstReadResponse } from '../../contract';

/** Shapes of First Read results for stories and tests. Built with the domain helpers, never typed by hand. */
const noFormula = (): ScoreResult => notScorable('no-formula', ['B2', 'B3']);

/** What the server returns today: a stage, and six areas with no formula yet. */
export const realCaseResult: FirstReadResponse = {
  configVersion: 'test',
  answeredCount: 5,
  quickStartTotal: 40,
  stage: { kind: 'staged', stage: 'building' },
  areas: {
    readiness: noFormula(),
    competitiveness: noFormula(),
    affordability: noFormula(),
    'digital-visibility': noFormula(),
    'trust-network': noFormula(),
    'community-influence': noFormula(),
  },
};

/** Nothing answered yet: the stage cannot be picked either. */
export const nothingAnsweredResult: FirstReadResponse = {
  ...realCaseResult,
  answeredCount: 0,
  stage: notScorable('missing-answers', ['A2']),
  areas: {
    ...realCaseResult.areas,
    readiness: notScorable('missing-answers', ['A2']),
  },
};

const threeScored: Partial<Record<ScoreAreaId, ScoreResult>> = {
  readiness: scored(72, 'strong', 'medium'),
  competitiveness: scored(48, 'developing', 'low'),
  affordability: scored(30, 'needs-attention', 'high'),
};

/** Synthetic only: no formulas exist, so these numbers are for layout and tests. */
export const threeScoredResult: FirstReadResponse = {
  ...realCaseResult,
  areas: { ...realCaseResult.areas, ...threeScored },
};
