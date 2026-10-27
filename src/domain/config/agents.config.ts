import type { AgentsConfig } from '../types';

export const agentsConfig: AgentsConfig = {
  /** Sample factors and weights, accepted for now (docs/DOMAIN-AND-OPEN-ITEMS.md). */
  factorsStatus: 'sample',
  factors: [
    { id: 'student-fit', nameKey: 'agentFactors.student-fit', weight: 20 },
    { id: 'market-presence', nameKey: 'agentFactors.market-presence', weight: 18 },
    { id: 'city-coverage', nameKey: 'agentFactors.city-coverage', weight: 15 },
    { id: 'counselling', nameKey: 'agentFactors.counselling', weight: 14 },
    { id: 'compliance', nameKey: 'agentFactors.compliance', weight: 13 },
    { id: 'response-speed', nameKey: 'agentFactors.response-speed', weight: 10 },
    { id: 'commission-fit', nameKey: 'agentFactors.commission-fit', weight: 10 },
  ],
  pilotStatus: 'confirmed',
  pilot: {
    durationMonths: 6,
    agentCount: 3,
    exclusive: false,
    commissionBenchmarkPercent: { min: 10, max: 15 },
  },
  /** Ratings are 1 to 5 per agent per factor. */
  rating: { min: 1, max: 5 },
};
