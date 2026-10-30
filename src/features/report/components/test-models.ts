import { agentsConfig } from '@/domain/config';
import { notScorable, scored, scoredGauge } from '@/domain/scoring';
import { scoreAreaIds } from '@/domain/types';
import type { NotScorable, QuestionId, ScoreAreaId, ScoreResult } from '@/domain/types';
import type { OpenReportArea, ReportModel } from '../contract';

/**
 * Report models for stories and tests, built with the domain helpers.
 * SYNTHETIC: no scoring formulas exist yet, so every number here is for layout and tests only.
 * The real case below is what the server returns today: a stage and six areas that cannot be scored.
 */
const pilot = agentsConfig.pilot;

const noFormula = (missing: readonly QuestionId[]): NotScorable =>
  notScorable('no-formula', missing);

const area = (
  id: ScoreAreaId,
  result: ScoreResult,
  extra: Partial<OpenReportArea> = {},
): OpenReportArea => ({
  id,
  result,
  evidence: [],
  gaps: [],
  locked: false,
  ...extra,
});

/** Today's real answer: stage known, six NotScorable areas, two NotScorable gauges, no recommendations. */
export const realCaseModel = (): ReportModel => ({
  configVersion: 'test',
  institutionName: 'Example University',
  isSample: false,
  stage: { kind: 'staged', stage: 'building' },
  completeness: { handled: 5, total: 24, unknown: 0 },
  areas: scoreAreaIds.map((id) =>
    area(id, noFormula(['B2', 'B3']), { gaps: [{ questionId: 'B2' }] }),
  ),
  gauges: [
    { id: 'school-fit', result: noFormula(['A1']) },
    { id: 'agent-attractiveness', result: noFormula(['F4']) },
  ],
  recommendations: [],
  unlocked: false,
  pilot,
});

/** Synthetic: five scored areas with evidence, one NotScorable, two scored gauges, two recommendations. */
export const scoredModel = (): ReportModel => ({
  ...realCaseModel(),
  completeness: { handled: 18, total: 24, unknown: 2 },
  areas: [
    area('readiness', scored(68, 'developing', 'medium'), {
      evidence: [
        { questionId: 'A4', tag: 'institution-reported', confidence: 'medium' },
        { questionId: 'B4', tag: 'estimate', confidence: 'low' },
      ],
      gaps: [{ questionId: 'B2' }],
    }),
    area('competitiveness', scored(54, 'needs-attention', 'low')),
    area('affordability', scored(62, 'developing', 'high')),
    area('digital-visibility', scored(78, 'strong', 'high')),
    area('trust-network', scored(49, 'needs-attention', 'low')),
    area('community-influence', notScorable('missing-answers', ['E1', 'E2'])),
  ],
  gauges: [
    { id: 'school-fit', result: scoredGauge(7, 'medium') },
    { id: 'agent-attractiveness', result: scoredGauge(5.5, 'low') },
  ],
  recommendations: [
    { id: 'r-low', areaId: 'trust-network', titleKey: 'areas.trust-network', impact: 2 },
    { id: 'r-high', areaId: 'readiness', titleKey: 'areas.readiness', impact: 9 },
  ],
});

/** Synthetic: the free preview where three areas are hidden. Their results are real numbers that must not leak. */
export const lockedPreviewModel = (): ReportModel => {
  const base = scoredModel();
  const hidden: readonly ScoreAreaId[] = [
    'competitiveness',
    'trust-network',
    'community-influence',
  ];
  return {
    ...base,
    areas: base.areas.map((a) => (hidden.includes(a.id) ? { id: a.id, locked: true } : a)),
  };
};

/** Synthetic: the Northbridge-style sample, flagged so the sample badge shows. */
export const sampleModel = (): ReportModel => ({
  ...scoredModel(),
  institutionName: 'Northbridge University',
  isSample: true,
});
