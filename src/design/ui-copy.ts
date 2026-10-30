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
  track: {
    previous: 'Previous',
    current: 'Current',
    next: 'Next',
  },
  flow: {
    howSure: 'How sure are you?',
    /** {name} is a section name. */
    continueTo: 'Continue to {name}',
    backTo: 'Back to {name}',
    opening: 'Opening your audit',
    signInRedirect: 'Taking you to sign in',
    sectionsTrack: 'Audit sections',
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

// --- My report redesign (appended block) ---------------------------------------------------------
export const reportUiCopy = {
  kite: {
    /** {answered} and {total} come from the report model. */
    label: 'Your audit as a kite: {answered} of {total} questions answered',
    legendTitle: 'What each cell shows',
    empty: 'Not answered yet',
    strong: 'Answered, high confidence',
    medium: 'Answered, medium confidence',
    weak: 'Answered, low confidence or not sure',
    sectionCount: '{answered} of {total} answered',
    sectionsList: 'Answers by section',
  },
  scores: {
    title: 'Your scores',
    pick: 'Pick a score to see',
    percent: '{value}%',
    completenessLine: '{handled} of {total} questions answered, {unknown} marked Not sure',
  },
  gauges: {
    scoreLine: '{value} out of 10',
  },
  closing: {
    agentMatrix: 'Agent matrix',
    actionsLabel: 'Save this report',
  },
} as const;

/** Agent strategy and price band presentation (appended block). {tokens} are filled by the feature. */
export const strategyCopy = {
  pilotSliderLabel: 'Pilot month',
  /** Spelled-out month names, in order. Beyond the list the feature falls back to monthFallback. */
  monthNames: ['Month one', 'Month two', 'Month three', 'Month four', 'Month five', 'Month six'],
  monthFallback: 'Month {n}',
  agentDetails: 'Strengths and weaknesses',
  agentDetailsAria: 'Strengths and weaknesses of {name}',
  sheetScore: 'Overall score',
  sheetStrength: 'Strength',
  sheetWeakness: 'Weakness',
  sheetSample: 'Sample ratings, not real.',
  forecastLive: 'Live result',
  priceMin: 'Band start',
  priceMax: 'Band end',
  priceExpected: 'Your net price',
  priceOpenEnd: 'No upper limit',
  priceLineLabel: 'Where your net price sits in the {band} band',
  priceDetailsLabel: 'About the price band',
  priceDetails:
    'The line shows the band your net annual price falls in. The small dots are where the band starts and ends. The large dot is your net price.',
} as const;
