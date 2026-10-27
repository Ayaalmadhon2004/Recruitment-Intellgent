import { en } from '@/domain/copy';
import type { StageId } from '@/domain/types';

/** Label bundles for pattern stories and tests, built from copy so no test invents its own wording. */
export const notScorableLabels = {
  title: en.status.notScorable,
  reasons: en.notScorable.reasons,
  missingHeading: en.notScorable.missingHeading,
};

export const scoreCardLabels = {
  bands: en.bands,
  outOf: en.scoreCard.outOf,
  ringAria: (name: string, value: number): string =>
    `${name} score ${Math.round(value)} out of 100`,
  evidenceTags: en.evidenceTags,
  confidence: en.confidence.label,
  confidenceLevels: {
    high: en.confidence.high,
    medium: en.confidence.medium,
    low: en.confidence.low,
  },
  notScorable: notScorableLabels,
};

export const stageCardLabels = {
  listLabel: 'Recruitment stages',
  stateLabels: en.stageStates,
  notScorable: notScorableLabels,
  headline: (stage: StageId): string => `You are ${en.stages[stage].label.toLowerCase()}`,
};

export const rangeLabels: Record<StageId, string> = {
  starting: en.stages.starting.range,
  building: en.stages.building.range,
  growing: en.stages.growing.range,
  established: en.stages.established.range,
};

export const radarLabels = {
  title: 'Scores by area',
  areaHeader: 'Area',
  scoreHeader: 'Score',
  notScorable: en.status.notScorable,
  valueText: (value: number): string => `${Math.round(value)} out of 100`,
};

export const questionText = (id: string): string => `Question ${id}`;
