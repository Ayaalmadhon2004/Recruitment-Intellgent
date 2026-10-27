export { findAnswer, findKnownAnswer, isAnswered } from './answers';
export { scoreAffordability, assertWeightsSumTo100 } from './affordability';
export type { AffordabilityComponents } from './affordability';
export { assertValidBands, bandFor } from './bands';
export { confidenceFor } from './evidence';
export { forecast } from './forecast';
export { notScorable, scored, scoredGauge } from './result';
export { scoreArea, scoreGauge } from './score-area';
export { pickStage } from './stage';
export {
  appliedScholarship,
  fourYearCost,
  netAnnualCost,
  priceBandFor,
  scholarshipCoverage,
} from './cost';
export type { NetAnnualCostInput } from './cost';
