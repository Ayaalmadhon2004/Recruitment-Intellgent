import type { ReactNode } from 'react';

/** The parts of the printed report a person can switch on or off, in the order they print. */
export const printSectionIds = ['scores', 'steps', 'afford', 'pilot', 'evidence'] as const;
export type PrintSectionId = (typeof printSectionIds)[number];

/** What is on when the options open. Evidence notes are opt-in, as in the design. */
export const defaultPrintSections: readonly PrintSectionId[] = [
  'scores',
  'steps',
  'afford',
  'pilot',
];

export type PrintOptions = {
  /** Which parts to print. Defaults to `defaultPrintSections`. */
  sections?: readonly PrintSectionId[];
  /** Brand bar for the top of the cover (logos). The caller owns the images. */
  brand?: ReactNode;
};
