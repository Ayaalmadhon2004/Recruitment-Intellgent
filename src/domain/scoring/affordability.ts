import type {
  AffordabilityComponentId,
  Answer,
  Confidence,
  DomainConfig,
  QuestionId,
  ScoreResult,
} from '../types';
import { affordabilityComponentIds } from '../types';
import { isAnswered } from './answers';
import { bandFor } from './bands';
import { notScorable, scored } from './result';

export type AffordabilityComponents = Partial<Record<AffordabilityComponentId, number>>;

export function assertWeightsSumTo100(
  weights: Readonly<Record<AffordabilityComponentId, number>>,
): void {
  const sum = affordabilityComponentIds.reduce((total, id) => total + weights[id], 0);
  if (Math.abs(sum - 100) > 1e-9)
    throw new RangeError(`Affordability weights must sum to 100, got ${sum}`);
}

/**
 * Weighted sum of the six Affordability components, each a 0-100 score:
 *   sum(weight x component) / 100
 *
 * Only the weighting is specified. How answers become component scores, and how confidence is derived,
 * are open items, so the caller supplies both. A missing component gives NotScorable, listing the
 * unanswered questions that feed it.
 */
export function scoreAffordability(
  components: AffordabilityComponents,
  confidence: Confidence,
  answers: readonly Answer[],
  config: DomainConfig,
): ScoreResult {
  const weights = config.scoring.affordabilityWeights;
  assertWeightsSumTo100(weights);

  const missingComponents = affordabilityComponentIds.filter((id) => components[id] === undefined);
  if (missingComponents.length > 0) {
    const missing: QuestionId[] = config.questions
      .filter((q) =>
        q.feeds.some(
          (f) =>
            f.area === 'affordability' &&
            f.component !== undefined &&
            missingComponents.includes(f.component),
        ),
      )
      .filter((q) => !isAnswered(answers, q.id))
      .map((q) => q.id);
    return notScorable('missing-answers', missing);
  }

  let total = 0;
  for (const id of affordabilityComponentIds) {
    const value = components[id];
    if (value === undefined || !Number.isFinite(value) || value < 0 || value > 100) {
      throw new RangeError(`Component ${id} must be a finite number from 0 to 100, got ${value}`);
    }
    total += weights[id] * value;
  }
  const value = total / 100;
  return scored(value, bandFor(value, config.scoring.bands), confidence);
}
