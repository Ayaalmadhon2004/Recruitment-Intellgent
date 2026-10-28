import { notScorable, scored, scoredGauge } from '@/domain/scoring';
import { isOpenArea } from '@/features/report/contract';
import type { OpenReportArea, ReportModel } from '@/features/report/contract';
import { buildReportModel } from '@/features/report/server';
import { northbridge } from './northbridge';

/** SYNTHETIC numbers for UI work only. Not scoring output. */
const READINESS = 68;
const COMPETITIVENESS = 54;
const AFFORDABILITY = 78;
const SCHOOL_FIT = 7;
const AGENT_ATTRACTIVENESS = 5.5;
const SYNTHETIC = {
  readiness: READINESS,
  competitiveness: COMPETITIVENESS,
  affordability: AFFORDABILITY,
  schoolFit: SCHOOL_FIT,
  agentAttractiveness: AGENT_ATTRACTIVENESS,
} as const;

/** One area of a model that must be open (not locked): throws otherwise, so a test fails loudly. */
export function openArea(model: ReportModel, id: OpenReportArea['id']): OpenReportArea {
  const area = model.areas.find((a) => a.id === id);
  if (area === undefined || !isOpenArea(area)) throw new Error(`No open area ${id}`);
  return area;
}

/** The real model for the Northbridge sample under the real config: every score is NotScorable. */
export function northbridgeReportModel(): ReportModel {
  return buildReportModel(northbridge.audit, { isSample: true });
}

/**
 * SYNTHETIC. Made-up numbers for UI work, stories and tests ONLY. It is not scoring output, not a
 * worked example and not a statement about any institution. Never show it as real data.
 * Three scored areas, one NotScorable area, two locked areas; both gauges scored.
 */
export function syntheticScoredReportModel(): ReportModel {
  const base = northbridgeReportModel();
  const byId = (id: OpenReportArea['id']): OpenReportArea => openArea(base, id);
  return {
    ...base,
    areas: [
      { ...byId('readiness'), result: scored(SYNTHETIC.readiness, 'developing', 'medium') },
      {
        ...byId('competitiveness'),
        result: scored(SYNTHETIC.competitiveness, 'needs-attention', 'low'),
      },
      { ...byId('affordability'), result: scored(SYNTHETIC.affordability, 'strong', 'high') },
      { ...byId('digital-visibility'), result: notScorable('missing-answers', ['D1']) },
      { id: 'trust-network', locked: true },
      { id: 'community-influence', locked: true },
    ],
    gauges: [
      { id: 'school-fit', result: scoredGauge(SYNTHETIC.schoolFit, 'medium') },
      { id: 'agent-attractiveness', result: scoredGauge(SYNTHETIC.agentAttractiveness, 'low') },
    ],
  };
}
