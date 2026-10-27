import type { StagesConfig } from '../types';

/** Stages from the design: Starting 0-5, Building 6-15, Growing 16-30, Established 31+ Vietnamese students. */
export const stagesConfig: StagesConfig = {
  status: 'confirmed',
  stages: [
    { id: 'starting', labelKey: 'stages.starting.label', min: 0, max: 5 },
    { id: 'building', labelKey: 'stages.building.label', min: 6, max: 15 },
    { id: 'growing', labelKey: 'stages.growing.label', min: 16, max: 30 },
    { id: 'established', labelKey: 'stages.established.label', min: 31, max: null },
  ],
  /**
   * TEMPORARY: the headcount question that decides the stage. Assumed to be B1 (students enrolled this
   * year) from the design. To be confirmed with the real question list.
   */
  source: { questionId: 'B1' },
  sourceStatus: 'temporary',
};
