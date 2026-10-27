import { CONFIG_VERSION } from '@/domain/config';
import type { Audit, GaugeId, ScoreAreaId, StageId } from '@/domain/types';
import { known } from './builders';

/**
 * Sample audit used in the design screens. Always shown with the "Sample data" badge.
 *
 * `audit.answers` are the 13 answers visible in the Intake design, with the evidence tags shown there.
 * Confidence per answer is not in the design; here it follows the tag (verified high, institution-reported
 * medium, estimate low) for the fixture only. That is a sample assumption, not a rule of the product.
 *
 * `design` holds the numbers printed in the design. They are design fixtures, NOT validated scoring output.
 */
export const northbridge = {
  isSample: true as const,
  audit: {
    id: 'sample-northbridge',
    institutionName: 'Northbridge University',
    status: 'in-progress',
    configVersion: CONFIG_VERSION,
    entitlement: 'free',
    answers: [
      known('A1', 'private-university', 'verified', 'high'),
      known('A2', 'building', 'verified', 'high'),
      known('A3', ['bachelor', 'master'], 'institution-reported', 'medium'),
      known('A4', true, 'verified', 'high'),
      known('B1', 9, 'verified', 'high'),
      known('B2', 'flat', 'institution-reported', 'medium'),
      known('B3', 'agents', 'estimate', 'low'),
      known('B4', true, 'institution-reported', 'medium'),
      known('C1', '30-40k', 'verified', 'high'),
      known('C3', ['tuition', 'housing'], 'institution-reported', 'medium'),
      known('D1', true, 'verified', 'high'),
      known('D2', '24-48-hours', 'institution-reported', 'medium'),
      known('F1', 'grow-steadily', 'estimate', 'low'),
    ],
  } satisfies Audit,
  design: {
    stage: 'building' as StageId,
    answeredOf40: 28,
    scores: {
      readiness: 68,
      competitiveness: 54,
      affordability: 62,
      'digital-visibility': 78,
      'trust-network': 49,
      'community-influence': null,
    } satisfies Record<ScoreAreaId, number | null>,
    gauges: { 'school-fit': 7.0, 'agent-attractiveness': 5.5 } satisfies Record<GaugeId, number>,
  },
};
