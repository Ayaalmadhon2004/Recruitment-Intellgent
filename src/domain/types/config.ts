import type { CopyKey } from '../copy';
import type { AgentFactor, PilotPlan } from './agent';
import type {
  AffordabilityComponentId,
  GaugeId,
  PriceBandId,
  ScoreAreaId,
} from './ids';
import type { Question } from './question';
import type { Band, Gauge, ScoreArea } from './score';
import type { Stage, StageSource } from './stage';

/**
 * How far a config value can be trusted.
 * confirmed: given by Capstone or the brief.
 * sample: accepted for now, still to be confirmed.
 * placeholder: a stand-in. Not to be shown as final.
 * temporary: stand-in content replaced when the real list arrives.
 */
export type ConfigStatus = 'confirmed' | 'sample' | 'placeholder' | 'temporary';

export type PriceBand = {
  readonly id: PriceBandId;
  readonly labelKey: CopyKey;
  readonly minUsd: number;
  /** Null for the open-ended top band. */
  readonly maxUsd: number | null;
};

export type ScoringConfig = {
  readonly areas: readonly ScoreArea[];
  readonly gauges: readonly Gauge[];
  readonly affordabilityWeightsStatus: ConfigStatus;
  /** Percent. Sums to 100. */
  readonly affordabilityWeights: Readonly<Record<AffordabilityComponentId, number>>;
  readonly priceBandsStatus: ConfigStatus;
  readonly priceBands: readonly PriceBand[];
  readonly bandsStatus: ConfigStatus;
  readonly bands: readonly Band[];
  /** Formulas per area and gauge. Null means no formula exists yet, so the result is NotScorable. */
  readonly formulas: Readonly<Record<ScoreAreaId | GaugeId, null>>;
};

export type StagesConfig = {
  readonly status: ConfigStatus;
  readonly stages: readonly Stage[];
  readonly source: StageSource;
  readonly sourceStatus: ConfigStatus;
};

export type AgentsConfig = {
  readonly factorsStatus: ConfigStatus;
  readonly factors: readonly AgentFactor[];
  readonly pilotStatus: ConfigStatus;
  readonly pilot: PilotPlan;
  /** Ratings are whole numbers from min to max. */
  readonly rating: { readonly min: number; readonly max: number };
};

/** What the scoring functions read. Passed in explicitly so tests can swap any part. */
export type DomainConfig = {
  readonly version: string;
  readonly questions: readonly Question[];
  readonly scoring: ScoringConfig;
  readonly stages: StagesConfig;
  readonly agents: AgentsConfig;
};
