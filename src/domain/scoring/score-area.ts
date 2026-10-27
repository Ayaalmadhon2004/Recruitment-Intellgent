import type {
  Answer,
  DomainConfig,
  GaugeId,
  GaugeResult,
  QuestionId,
  ScoreAreaId,
  ScoreResult,
} from '../types';
import { isAnswered } from './answers';
import { notScorable } from './result';

function unansweredFeeding(
  target: ScoreAreaId | GaugeId,
  answers: readonly Answer[],
  config: DomainConfig,
): QuestionId[] {
  return config.questions
    .filter((q) => q.feeds.some((f) => f.area === target))
    .filter((q) => !isAnswered(answers, q.id))
    .map((q) => q.id);
}

/**
 * Score one of the six areas from stored answers.
 * No area has a confirmed formula yet, so every area is NotScorable with the questions still unanswered.
 * Never invent a formula to fill the gap: add it to scoring.config when it is confirmed.
 */
export function scoreArea(areaId: ScoreAreaId, answers: readonly Answer[], config: DomainConfig): ScoreResult {
  const formula = config.scoring.formulas[areaId];
  if (formula === null) return notScorable('no-formula', unansweredFeeding(areaId, answers, config));
  throw new Error(`Formula for ${areaId} is configured but not implemented`);
}

/** Same rule for the two 0-10 gauges. */
export function scoreGauge(gaugeId: GaugeId, answers: readonly Answer[], config: DomainConfig): GaugeResult {
  const formula = config.scoring.formulas[gaugeId];
  if (formula === null) return notScorable('no-formula', unansweredFeeding(gaugeId, answers, config));
  throw new Error(`Formula for ${gaugeId} is configured but not implemented`);
}
