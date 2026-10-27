import { en } from '@/domain/copy';
import type { StageId } from '@/domain/types';
import type { ScoreCardLabels, StageCardLabels } from '@/patterns';

/** Replaces each "{name}" placeholder in a copy template with its value. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template,
  );

/** Label bundles for the score patterns, built from copy. Shared by Quick Start and Report. */
export const notScorableLabels = {
  title: en.status.notScorable,
  reasons: en.notScorable.reasons,
  missingHeading: en.notScorable.missingHeading,
};

export const scoreCardLabels: ScoreCardLabels = {
  bands: en.bands,
  outOf: en.scoreCard.outOf,
  ringAria: (name, value) => fill(en.firstRead.ringAria, { name, value: Math.round(value) }),
  evidenceTags: en.evidenceTags,
  confidence: en.confidence.label,
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
