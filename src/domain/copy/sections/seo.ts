/**
 * Page descriptions for search results and link previews. Titles live with each page's own copy.
 * Only restates what the product does; no statistics or claims.
 */
export const seo = {
  titleTemplate: '%s | Vietnam Recruitment Intelligence',
  siteDescription:
    'Find out how ready your university is to recruit students in Vietnam. A Capstone Education audit tool.',
  locale: 'en_US',
  pages: {
    quickStart:
      'Answer a few questions and get a free first read of your Vietnam recruitment readiness.',
    report: 'Your Vietnam recruitment readiness report, built from your answers.',
    scoreDetail: 'The detail behind one area of your Vietnam recruitment readiness score.',
    costCalc: 'Work out what recruiting students in Vietnam could cost your university.',
    advisor: 'Talk through your results with a Capstone Education advisor.',
    signIn: 'Sign in to see and continue your audits.',
    dashboard: 'See and continue your saved audits.',
    unlock: 'See what is free and what opens up in the full report.',
    pdfExport: 'Choose what goes into your report and preview it as a PDF.',
  },
} as const;
