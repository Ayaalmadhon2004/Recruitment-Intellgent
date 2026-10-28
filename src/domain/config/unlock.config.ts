import type { CopyKey } from '../copy';
import type { ConfigStatus } from '../types';

/** One line in the Free and Full lists on the Unlock screen. */
export type UnlockExampleItem = { readonly id: string; readonly labelKey: CopyKey };

/** A stand-in option shown while `tbcConfig.unlockPaths` is null. Selectable, never a real path. */
export type PlaceholderUnlockPath = { readonly id: string; readonly labelKey: CopyKey };

export type UnlockConfig = {
  readonly status: ConfigStatus;
  /**
   * The free and full lists from the Unlock design. An example only: the free vs locked line is unknown
   * (open item 5), so the screen shows this beside `tbcConfig.freeVsLockedLine`. What the server really hides
   * is `access.config.ts` `lockedWhenFree`.
   */
  readonly exampleSplit: {
    readonly free: readonly UnlockExampleItem[];
    readonly full: readonly UnlockExampleItem[];
  };
  /** Three options, as in the design, until Capstone confirms the real paths. */
  readonly placeholderPaths: readonly PlaceholderUnlockPath[];
};

/** PLACEHOLDER. Replace the example lists and drop the placeholder paths when Capstone decides (open item 5). */
export const unlockConfig: UnlockConfig = {
  status: 'placeholder',
  exampleSplit: {
    free: [
      { id: 'scores-overview', labelKey: 'unlock.split.items.scoresOverview' },
      { id: 'stage', labelKey: 'unlock.split.items.stage' },
      { id: 'next-steps', labelKey: 'unlock.split.items.nextSteps' },
      { id: 'gauges', labelKey: 'unlock.split.items.gauges' },
    ],
    full: [
      { id: 'affordability', labelKey: 'unlock.split.items.affordability' },
      { id: 'agent-matrix', labelKey: 'unlock.split.items.agentMatrix' },
      { id: 'pilot-plan', labelKey: 'unlock.split.items.pilotPlan' },
      { id: 'price-bands', labelKey: 'unlock.split.items.priceBands' },
      { id: 'pdf', labelKey: 'unlock.split.items.pdf' },
    ],
  },
  placeholderPaths: [
    { id: 'placeholder-1', labelKey: 'unlock.choose.placeholders.one' },
    { id: 'placeholder-2', labelKey: 'unlock.choose.placeholders.two' },
    { id: 'placeholder-3', labelKey: 'unlock.choose.placeholders.three' },
  ],
};
