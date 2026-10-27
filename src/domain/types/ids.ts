export const sectionIds = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type SectionId = (typeof sectionIds)[number];

/** Question ids are a section letter and a number, for example "C3". */
export type QuestionId = `${SectionId}${number}`;

/** The six 0-100 score areas. */
export const scoreAreaIds = [
  'readiness',
  'competitiveness',
  'affordability',
  'digital-visibility',
  'trust-network',
  'community-influence',
] as const;
export type ScoreAreaId = (typeof scoreAreaIds)[number];

/** The two 0-10 gauges. */
export const gaugeIds = ['school-fit', 'agent-attractiveness'] as const;
export type GaugeId = (typeof gaugeIds)[number];

export const affordabilityComponentIds = [
  'net-annual-cost',
  'scholarship-attainability',
  'cost-transparency',
  'graduate-outcomes',
  'academic-career-value',
  'financial-risk-mitigation',
] as const;
export type AffordabilityComponentId = (typeof affordabilityComponentIds)[number];

export const stageIds = ['starting', 'building', 'growing', 'established'] as const;
export type StageId = (typeof stageIds)[number];

export const bandIds = ['strong', 'developing', 'needs-attention'] as const;
export type BandId = (typeof bandIds)[number];

export const agentFactorIds = [
  'student-fit',
  'market-presence',
  'city-coverage',
  'counselling',
  'compliance',
  'response-speed',
  'commission-fit',
] as const;
export type AgentFactorId = (typeof agentFactorIds)[number];

export const priceBandIds = ['under-20k', '20-30k', '30-40k', '40-50k', '50k-plus'] as const;
export type PriceBandId = (typeof priceBandIds)[number];
