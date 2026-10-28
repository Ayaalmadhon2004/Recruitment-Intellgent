import type { AuditCardModel } from './model';

/**
 * Stories and tests only. The three audits drawn in the Dashboard design (names, dates and counts), all
 * labelled `sample`. The design counts out of 40; here the totals follow the 24 temporary questions in
 * config, so the percentages are not the design's. Not real institutions and not outputs of the product.
 */
export const sampleAudits: readonly AuditCardModel[] = [
  {
    id: 'sample-1',
    name: 'Northbridge University',
    answered: 17,
    total: 24,
    percent: 71,
    progress: 'in-progress',
    stage: { kind: 'staged', label: 'Building' },
    updatedAt: '2026-10-25T09:00:00.000Z',
    olderVersion: null,
    sample: true,
  },
  {
    id: 'sample-2',
    name: 'Northbridge Pathway College',
    answered: 7,
    total: 24,
    percent: 29,
    progress: 'in-progress',
    stage: { kind: 'checking' },
    updatedAt: '2026-10-20T09:00:00.000Z',
    olderVersion: 'vri-config-0.0.1',
    sample: true,
  },
  {
    id: 'sample-3',
    name: 'Northbridge Graduate School',
    answered: 24,
    total: 24,
    percent: 100,
    progress: 'complete',
    stage: { kind: 'not-scorable' },
    updatedAt: '2026-10-09T09:00:00.000Z',
    olderVersion: null,
    sample: true,
  },
];
