/** Copy for the error and not-found pages. No error details are ever shown to the visitor. */
export const errorPages = {
  error: {
    eyebrow: 'SOMETHING WENT WRONG',
    title: 'This page could not load',
    body: 'Something went wrong on our side. Your answers are kept on this device. Please try again.',
    retry: 'Try again',
    home: 'Go to the home page',
  },
  globalError: {
    eyebrow: 'SOMETHING WENT WRONG',
    title: 'The site could not load',
    body: 'Something went wrong while starting the site. Please try again.',
    retry: 'Try again',
    home: 'Go to the home page',
    documentTitle: 'Something went wrong',
  },
  serviceNotReady: {
    eyebrow: 'NOT OPEN YET',
    title: 'This part is not open yet',
    body: 'Accounts and saved audits are not switched on yet. You can look around the rest of the site, or talk to an advisor about the audit.',
    home: 'Go to the home page',
    advisor: 'Talk to an advisor',
  },
  notFound: {
    eyebrow: 'PAGE NOT FOUND',
    title: 'We could not find that page',
    body: 'The link may be out of date or mistyped. You can go back to the home page or start the audit.',
    home: 'Go to the home page',
    start: 'Start the audit',
    documentTitle: 'Page not found',
  },
} as const;
