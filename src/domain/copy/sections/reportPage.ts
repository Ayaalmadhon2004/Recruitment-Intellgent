/** Copy for the report pages (/report and /report/[area]). */
export const reportPage = {
  pageTitle: 'Your report',
  scoreDetailPageTitle: 'Score detail',
  /** Intake does not ask for a name, so the report uses this neutral label. */
  institutionName: 'Your institution',
  errorTitle: 'We could not load your report',
  errorBody: 'Something went wrong. Your answers are kept on this device. Please try again.',
  retry: 'Try again',
  emptyTitle: 'No answers yet',
  emptyBody:
    'Your report is built from your answers. Answer a few questions and it will appear here.',
  emptyQuickStart: 'Start with the Quick Start',
  emptyIntake: 'Go to the full audit',
  versionNoticeTitle: 'Questions have changed since you answered',
  versionNoticeBody:
    'Your answers were saved under an earlier version of the audit. Review them in the audit so the report matches the current questions.',
  versionNoticeLink: 'Review my answers',
} as const;
