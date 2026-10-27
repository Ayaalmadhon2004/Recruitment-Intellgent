import type { AccessConfig } from '../types';

/**
 * PLACEHOLDER. Which areas the free preview hides is unknown (open item 5: the free vs locked line),
 * so nothing is locked. Fill `lockedWhenFree` only when Capstone confirms the line.
 */
export const accessConfig: AccessConfig = {
  status: 'placeholder',
  lockedWhenFree: [],
};
