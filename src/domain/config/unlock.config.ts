import type { CopyKey } from '../copy';
import type { ConfigStatus } from '../types';

/** A stand-in option shown while `tbcConfig.unlockPaths` is null. Selectable, never a real path. */
export type PlaceholderUnlockPath = { readonly id: string; readonly labelKey: CopyKey };

export type UnlockConfig = {
  readonly status: ConfigStatus;
  /** Three options, as in the design, until Capstone confirms the real paths. */
  readonly placeholderPaths: readonly PlaceholderUnlockPath[];
};

/** PLACEHOLDER. Drop the placeholder paths when Capstone decides (open item 5). */
export const unlockConfig: UnlockConfig = {
  status: 'placeholder',
  placeholderPaths: [
    { id: 'placeholder-1', labelKey: 'unlock.choose.placeholders.one' },
    { id: 'placeholder-2', labelKey: 'unlock.choose.placeholders.two' },
    { id: 'placeholder-3', labelKey: 'unlock.choose.placeholders.three' },
  ],
};
