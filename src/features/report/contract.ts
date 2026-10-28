import type {
  Confidence,
  GaugeId,
  GaugeResult,
  KnownEvidenceTag,
  PilotPlan,
  QuestionId,
  Recommendation,
  ScoreAreaId,
  ScoreResult,
  StageResult,
} from '@/domain/types';

/** How a report is shown. One model, three modes, one implementation. */
export type ReportMode = 'interactive' | 'preview' | 'print';

/** One answer that backs an area, with how it is known. */
export type ReportEvidence = {
  readonly questionId: QuestionId;
  readonly tag: KnownEvidenceTag;
  readonly confidence: Confidence;
};

/** A question that would feed an area but has no real answer yet. */
export type ReportGap = {
  readonly questionId: QuestionId;
};

export type ReportArea = {
  readonly id: ScoreAreaId;
  readonly result: ScoreResult;
  /** Answers that feed this area (empty while no question is mapped to it). */
  readonly evidence: readonly ReportEvidence[];
  /** "Missing evidence": questions that feed this area and are unanswered or marked Not sure. */
  readonly gaps: readonly ReportGap[];
  /**
   * True when this audit is free and the area is in `config.access.lockedWhenFree`. The server then sends no
   * real result, evidence or gaps for it: `result` is a stand-in that must never be drawn. Which areas are
   * hidden is unknown (open item 5), so this is false everywhere until the config lists areas.
   */
  readonly locked: boolean;
};

export type ReportGauge = {
  readonly id: GaugeId;
  readonly result: GaugeResult;
};

/** Everything the report renders. Built on the server from an Audit and a config. Never stored. */
export type ReportModel = {
  /** The config version the scores were computed with (the server's current config). */
  readonly configVersion: string;
  /** Present and true when the audit was stored under a different config version than the one used to score it. */
  readonly configVersionMismatch?: true;
  readonly institutionName: string;
  /** True when the audit is the Northbridge sample: the UI must show the sample badge. */
  readonly isSample: boolean;
  readonly stage: StageResult;
  readonly completeness: {
    /** Questions with an answer or marked Not sure. */
    readonly handled: number;
    readonly total: number;
    /** Questions marked Not sure. */
    readonly unknown: number;
  };
  /** All six areas, in config order. */
  readonly areas: readonly ReportArea[];
  readonly gauges: readonly ReportGauge[];
  /** Ranked by impact, most first. Empty when there is no confirmed recommendation content. */
  readonly recommendations: readonly Recommendation[];
  readonly unlocked: boolean;
  readonly pilot: PilotPlan;
};
