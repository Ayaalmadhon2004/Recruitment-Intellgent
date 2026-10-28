import type { Recommendation } from '@/domain/types';
import type { OpenReportArea } from '../../contract';

/**
 * SYNTHETIC data for tests and stories only. None of it is a real result: the scoring formulas are
 * not confirmed, so these numbers are made up to exercise each state of the view.
 */

const SCORE = 68;

export const scoredArea: OpenReportArea = {
  id: 'readiness',
  result: { kind: 'scored', value: SCORE, band: 'developing', confidence: 'medium' },
  evidence: [
    { questionId: 'A4', tag: 'verified', confidence: 'high' },
    { questionId: 'B4', tag: 'estimate', confidence: 'low' },
  ],
  gaps: [{ questionId: 'A1' }],
  locked: false,
};

export const scoredAreaNoGaps: OpenReportArea = { ...scoredArea, gaps: [] };

export const noFormulaArea: OpenReportArea = {
  id: 'trust-network',
  result: { kind: 'not-scorable', reason: 'no-formula', missing: [] },
  evidence: [],
  gaps: [],
  locked: false,
};

export const missingAnswersArea: OpenReportArea = {
  id: 'digital-visibility',
  result: { kind: 'not-scorable', reason: 'missing-answers', missing: ['D1', 'D2'] },
  evidence: [{ questionId: 'D3', tag: 'institution-reported', confidence: 'medium' }],
  gaps: [{ questionId: 'D1' }, { questionId: 'D2' }],
  locked: false,
};

export const affordabilityArea: OpenReportArea = {
  id: 'affordability',
  result: { kind: 'scored', value: SCORE, band: 'developing', confidence: 'low' },
  evidence: [{ questionId: 'C1', tag: 'estimate', confidence: 'low' }],
  gaps: [],
  locked: false,
};

export const emptyEvidenceArea: OpenReportArea = { ...scoredAreaNoGaps, evidence: [] };

const HIGH_IMPACT = 9;
const MID_IMPACT = 5;
const LOW_IMPACT = 2;

/** Titles reuse existing copy keys as stand-ins: no recommendation copy exists yet. */
export const recommendations: readonly Recommendation[] = [
  { id: 'r-low', areaId: 'readiness', titleKey: 'questions.B4.text', impact: LOW_IMPACT },
  { id: 'r-high', areaId: 'readiness', titleKey: 'questions.A4.text', impact: HIGH_IMPACT },
  { id: 'r-mid', areaId: 'readiness', titleKey: 'questions.A1.text', impact: MID_IMPACT },
  { id: 'r-other', areaId: 'affordability', titleKey: 'questions.C1.text', impact: HIGH_IMPACT },
];

export const questionHref = (id: string): string => `#question-${id}`;
