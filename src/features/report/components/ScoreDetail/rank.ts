import type { Recommendation, ScoreAreaId } from '@/domain/types';

/**
 * The recommendations for one area, most impact first. `impact` is relative: larger comes first.
 * Equal impact keeps the input order. The input is never changed.
 */
export function rankRecommendations(
  recommendations: readonly Recommendation[],
  areaId: ScoreAreaId,
): readonly Recommendation[] {
  return recommendations
    .map((recommendation, index) => ({ recommendation, index }))
    .filter(({ recommendation }) => recommendation.areaId === areaId)
    .sort((a, b) => b.recommendation.impact - a.recommendation.impact || a.index - b.index)
    .map(({ recommendation }) => recommendation);
}
