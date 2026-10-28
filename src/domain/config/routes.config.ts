/** Public page paths. One place, so links never drift. Labels live in copy (`en.nav.items`). */
export const routes = {
  home: '/',
  quickStart: '/quick-start',
  firstRead: '/first-read',
  intake: '/intake',
  report: '/report',
  costCalc: '/cost-calc',
  agentStrategy: '/agent-strategy',
  advisor: '/advisor',
  reportArea: (area: string): string => `/report/${area}`,
} as const;
