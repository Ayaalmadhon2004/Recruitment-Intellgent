import type { CopyKey } from '@/domain/copy';
import type { DomainConfig, StageResult } from '@/domain/types';
import type { SavedAudit } from './types';

/** What a card on the Dashboard shows. Built from stored answers; nothing here is a score. */

/** The stage line has four honest states. `checking` and `unavailable` are not scores and not zero. */
export type StageView =
  | { kind: 'checking' }
  | { kind: 'unavailable' }
  | { kind: 'not-scorable' }
  | { kind: 'staged'; label: string };

export type AuditProgress = 'in-progress' | 'complete';

export type AuditCardModel = {
  id: string;
  /** Null when no institution name is stored; the card then reads "Untitled audit". */
  name: string | null;
  answered: number;
  total: number;
  /** Whole number, 0 to 100. */
  percent: number;
  progress: AuditProgress;
  stage: StageView;
  /** ISO 8601. */
  updatedAt: string;
  /** The config version the answers were saved under, set only when it differs from the current one. */
  olderVersion: string | null;
  /** True for fixture data, which shows the Sample data badge. */
  sample: boolean;
};

export type AuditFilter = 'all' | 'progress' | 'complete';
export type AuditSort = 'updated' | 'name' | 'progress';

/** Questions with an answer or a Not sure mark. Answers for ids the config no longer has do not count. */
export function countHandled(audit: SavedAudit, config: DomainConfig): number {
  const known = new Set(config.questions.map((q) => q.id));
  return new Set(audit.stored.answers.map((a) => a.questionId).filter((id) => known.has(id))).size;
}

export function stageViewOf(
  result: StageResult | undefined,
  config: DomainConfig,
  labelOf: (key: CopyKey) => string,
): StageView {
  if (result === undefined) return { kind: 'checking' };
  if (result.kind === 'not-scorable') return { kind: 'not-scorable' };
  const stage = config.stages.stages.find((s) => s.id === result.stage);
  return stage ? { kind: 'staged', label: labelOf(stage.labelKey) } : { kind: 'unavailable' };
}

export function toCardModel(
  audit: SavedAudit,
  stage: StageView,
  config: DomainConfig,
  sample = false,
): AuditCardModel {
  const total = config.questions.length;
  const answered = countHandled(audit, config);
  return {
    id: audit.id,
    name: audit.institutionName,
    answered,
    total,
    percent: total === 0 ? 0 : Math.round((answered / total) * 100),
    progress: total > 0 && answered === total ? 'complete' : 'in-progress',
    stage,
    updatedAt: audit.updatedAt,
    olderVersion: audit.stored.configVersion === config.version ? null : audit.stored.configVersion,
    sample,
  };
}

export const countByFilter = (cards: readonly AuditCardModel[]): Record<AuditFilter, number> => ({
  all: cards.length,
  progress: cards.filter((c) => c.progress === 'in-progress').length,
  complete: cards.filter((c) => c.progress === 'complete').length,
});

export function filterCards(
  cards: readonly AuditCardModel[],
  filter: AuditFilter,
): AuditCardModel[] {
  return cards.filter((c) => filter === 'all' || c.progress === filter);
}

/** Sorted copy. `untitled` is what a card without a name is called, so it sorts where it reads. */
export function sortCards(
  cards: readonly AuditCardModel[],
  sort: AuditSort,
  untitled: string,
): AuditCardModel[] {
  const nameOf = (c: AuditCardModel): string => c.name ?? untitled;
  const byUpdated = (a: AuditCardModel, b: AuditCardModel): number =>
    a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0;
  return [...cards].sort((a, b) => {
    if (sort === 'name') return nameOf(a).localeCompare(nameOf(b)) || byUpdated(a, b);
    if (sort === 'progress') return b.percent - a.percent || byUpdated(a, b);
    return byUpdated(a, b);
  });
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "25 Oct 2026". UTC, so the server and the browser agree. */
export function formatUpdated(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateFormat.format(date);
}
