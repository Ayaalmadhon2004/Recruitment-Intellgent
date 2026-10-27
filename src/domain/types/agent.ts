import type { CopyKey } from '../copy';
import type { AgentFactorId } from './ids';

export type AgentFactor = {
  readonly id: AgentFactorId;
  readonly nameKey: CopyKey;
  /** Percent. The seven weights sum to 100. */
  readonly weight: number;
};

export type PilotPlan = {
  readonly durationMonths: number;
  readonly agentCount: number;
  readonly exclusive: boolean;
  readonly commissionBenchmarkPercent: { readonly min: number; readonly max: number };
};

/** One agent's rating (a whole number within the configured range) for every factor. */
export type AgentRatings = Readonly<Record<AgentFactorId, number>>;

export type RatedFactor = {
  readonly id: AgentFactorId;
  readonly rating: number;
};

export type StrongestAndWeakest = {
  readonly strongest: RatedFactor;
  readonly weakest: RatedFactor;
};
