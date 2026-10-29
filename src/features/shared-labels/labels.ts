import { en, fill } from '@/domain/copy';
import type { StageId } from '@/domain/types';
import type { ScoreCardLabels, StageCardLabels } from '@/patterns';

/** Label bundles for the score patterns, built from copy. Shared by Quick Start and Report. */
export const notScorableLabels = {
  title: en.status.notScorable,
  explainer: en.notScorable.explainer,
  reasons: en.notScorable.reasons,
  missingHeading: en.notScorable.missingHeading,
};

export const scoreCardLabels: ScoreCardLabels = {
  bands: en.bands,
  outOf: en.scoreCard.outOf,
  ringAria: (name, value) => fill(en.firstRead.ringAria, { name, value: Math.round(value) }),
  evidenceTags: en.evidenceTags,
  evidenceHints: en.intake.evidenceHelp,
  confidence: en.confidence.label,
  confidenceHint: en.confidence.hint,
  confidenceLevels: {
    high: en.confidence.high,
    medium: en.confidence.medium,
    low: en.confidence.low,
  },
  notScorable: notScorableLabels,
};

export const stageName = (stage: StageId): string => en.stages[stage].label;

export const stageCardLabels: StageCardLabels = {
  listLabel: en.firstRead.stageListLabel,
  stateLabels: en.stageStates,
  notScorable: notScorableLabels,
  headline: (stage) => fill(en.firstRead.stageHeadline, { stage: stageName(stage).toLowerCase() }),
};

export const stageChipText = (stage: StageId): string =>
  fill(en.firstRead.stageChip, { stage: stageName(stage) });

export const progressText = (answered: number, total: number): string =>
  fill(en.firstRead.progressText, { answered, total });

export const rangeLabels: Record<StageId, string> = {
  starting: en.stages.starting.range,
  building: en.stages.building.range,
  growing: en.stages.growing.range,
  established: en.stages.established.range,
};
