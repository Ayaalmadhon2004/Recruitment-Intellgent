import type { ScoringConfig } from '../types';

/**
 * Scoring config. Only what is known is here:
 *  - the six Affordability weights (sum 100),
 *  - the price bands,
 *  - placeholder score bands (Strong 75+, Developing 55-74, Needs attention below 55).
 *
 * There are no formulas for any area or gauge. Where a formula is absent the engine returns
 * NotScorable. Do not add one without the confirmed formula.
 */
export const scoringConfig: ScoringConfig = {
  areas: [
    { id: 'readiness', nameKey: 'areas.readiness' },
    { id: 'competitiveness', nameKey: 'areas.competitiveness' },
    { id: 'affordability', nameKey: 'areas.affordability' },
    { id: 'digital-visibility', nameKey: 'areas.digital-visibility' },
    { id: 'trust-network', nameKey: 'areas.trust-network' },
    { id: 'community-influence', nameKey: 'areas.community-influence' },
  ],
  gauges: [
    { id: 'school-fit', nameKey: 'gauges.school-fit' },
    { id: 'agent-attractiveness', nameKey: 'gauges.agent-attractiveness' },
  ],

  affordabilityWeightsStatus: 'confirmed',
  affordabilityWeights: {
    'net-annual-cost': 30,
    'scholarship-attainability': 15,
    'cost-transparency': 10,
    'graduate-outcomes': 20,
    'academic-career-value': 15,
    'financial-risk-mitigation': 10,
  },

  priceBandsStatus: 'confirmed',
  priceBands: [
    { id: 'under-20k', labelKey: 'priceBands.under-20k', minUsd: 0, maxUsd: 20000 },
    { id: '20-30k', labelKey: 'priceBands.20-30k', minUsd: 20000, maxUsd: 30000 },
    { id: '30-40k', labelKey: 'priceBands.30-40k', minUsd: 30000, maxUsd: 40000 },
    { id: '40-50k', labelKey: 'priceBands.40-50k', minUsd: 40000, maxUsd: 50000 },
    { id: '50k-plus', labelKey: 'priceBands.50k-plus', minUsd: 50000, maxUsd: null },
  ],

  /** PLACEHOLDER cut-offs. Final cut-offs are an open item (unknown 4). */
  bandsStatus: 'placeholder',
  bands: [
    { id: 'strong', labelKey: 'bands.strong', min: 75 },
    { id: 'developing', labelKey: 'bands.developing', min: 55 },
    { id: 'needs-attention', labelKey: 'bands.needs-attention', min: 0 },
  ],

  /** Formulas per area and gauge. Null means no formula exists yet. */
  formulas: {
    readiness: null,
    competitiveness: null,
    affordability: null,
    'digital-visibility': null,
    'trust-network': null,
    'community-influence': null,
    'school-fit': null,
    'agent-attractiveness': null,
  },
};
