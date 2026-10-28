import type { AgentRatings } from '@/domain/types';

/**
 * Sample data from the AgentStrategy design. The agents, their ratings and the forecast inputs are
 * NOT real. Always shown with a sample badge.
 */
const ratings = (r: readonly number[]): AgentRatings => ({
  'student-fit': r[0]!,
  'market-presence': r[1]!,
  'city-coverage': r[2]!,
  counselling: r[3]!,
  compliance: r[4]!,
  'response-speed': r[5]!,
  'commission-fit': r[6]!,
});

export const sampleAgents = [
  { id: 'agent-a', name: 'Agent A', ratings: ratings([4, 3, 4, 5, 4, 3, 4]) },
  { id: 'agent-b', name: 'Agent B', ratings: ratings([3, 5, 3, 3, 5, 4, 3]) },
  { id: 'agent-c', name: 'Agent C', ratings: ratings([5, 2, 2, 4, 3, 5, 5]) },
] as const;

/** Text-field values, as typed. Percent values are percents, not ratios. */
export const sampleForecastValues = {
  applications: '120',
  offerRate: '55',
  enrolmentYield: '30',
  visaRetention: '85',
} as const;

export const sampleAgentStrategy = {
  isSample: true as const,
  agents: sampleAgents,
  forecastValues: sampleForecastValues,
};
