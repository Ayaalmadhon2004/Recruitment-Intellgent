import { domainConfig } from '@/domain/config';
import { isAnswered, pickStage, scoreArea } from '@/domain/scoring';
import {
  scoreAreaIds,
  type Answer,
  type DomainConfig,
  type ScoreAreaId,
  type ScoreResult,
} from '@/domain/types';
import { fail, isRecord, parseAnswerList, type ParseResult } from '@/domain/validation/answers';
import type { FirstReadResponse } from './contract';

/** Server-only helpers for POST /api/first-read. No React, nothing stored. */

export { MAX_ANSWERS } from '@/domain/validation/answers';
export type { ParseResult };

/** Strict validation of the request body. */
export function parseFirstReadRequest(body: unknown): ParseResult {
  if (!isRecord(body)) return fail('Body must be an object with an "answers" array.');
  if (Array.isArray(body.answers) && body.answers.length === 0)
    return fail('"answers" must not be empty.');
  return parseAnswerList(body.answers, 'answers');
}

/** Stage and all six areas from stored answers. Areas without a formula stay NotScorable. */
export function computeFirstRead(
  answers: readonly Answer[],
  config: DomainConfig = domainConfig,
): FirstReadResponse {
  const quickStartIds = config.questions.filter((q) => q.quickStart).map((q) => q.id);
  const areas = Object.fromEntries(
    scoreAreaIds.map((id) => [id, scoreArea(id, answers, config)]),
  ) as Record<ScoreAreaId, ScoreResult>;
  return {
    configVersion: config.version,
    answeredCount: quickStartIds.filter((id) => isAnswered(answers, id)).length,
    quickStartTotal: quickStartIds.length,
    stage: pickStage(answers, config),
    areas,
  };
}
