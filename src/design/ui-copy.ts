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
  home: {
    /** {quickStart} is filled from auditScope.quickStartQuestions. */
    introLead: 'Answer {quickStart} short questions and get a free first read of your university.',
    skipIntro: 'Skip intro',
    stagesUnit: 'stages',
    stepsFigure: 'First',
    kiteFolded: 'Paper kite, folded',
    kiteLeft: 'Paper kite, left wing open',
    kiteRight: 'Paper kite, right wing open',
  },
} as const;
