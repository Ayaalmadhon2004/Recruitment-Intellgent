/** Public page paths. One place, so links never drift. Labels live in copy (`en.nav.items`). */
export const routes = {
  home: '/',
  quickStart: '/quick-start',
  firstRead: '/first-read',
  intake: '/intake',
  report: '/report',
  reportPdf: '/report/pdf',
  costCalc: '/cost-calc',
  agentStrategy: '/agent-strategy',
  advisor: '/advisor',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  unlock: '/unlock',
  reportArea: (area: string): string => `/report/${area}`,
} as const;

/**
 * Pages worth listing in the sitemap: public and the same for every visitor. Left out on purpose:
 * personal pages (report, dashboard, sign in, unlock), redirects (first read, intake) and the PDF preview.
 */
export const sitemapPaths = [
  routes.home,
  routes.quickStart,
  routes.costCalc,
  routes.agentStrategy,
  routes.advisor,
] as const;
