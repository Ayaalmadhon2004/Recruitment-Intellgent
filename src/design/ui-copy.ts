/**
 * Presentational strings used by shared primitives (close marks, default labels).
 * Plain data, no imports. Page and domain copy stays in domain/copy/en.ts.
 */
export const uiCopy = {
  toast: {
    regionLabel: 'Notifications',
    dismiss: 'Dismiss notification',
    status: { success: 'Done', error: 'Problem', info: 'Note' },
  },
  bubble: {
    openLabel: 'More information',
    closeLabel: 'Close information',
  },
  sheet: {
    close: 'Close',
  },
  step: {
    step: 'Step',
    question: 'Question',
    of: 'of',
  },
  kite: {
    label: 'Paper kite',
  },
  companion: {
    label: 'Page progress',
  },
} as const;
