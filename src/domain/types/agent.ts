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
