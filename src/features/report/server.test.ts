import { describe, expect, it } from 'vitest';
import { domainConfig } from '@/domain/config';
import { gaugeIds, scoreAreaIds, type Audit, type DomainConfig } from '@/domain/types';
import { known, unknown } from '../../../tests/fixtures/builders';
import { northbridge } from '../../../tests/fixtures/northbridge';
import { northbridgeReportModel, syntheticScoredReportModel } from '../../../tests/fixtures/report';
import { buildReportModel, parseReportRequest } from './server';

function audit(overrides: Partial<Audit> = {}): Audit {
  return { ...northbridge.audit, ...overrides };
}

/** Test config: readiness is fed by A1, A2, A3 and affordability by A1 only. */
function feedingConfig(
  lockedWhenFree: DomainConfig['access']['lockedWhenFree'] = [],
): DomainConfig {
  const feedsByQuestion: Record<string, DomainConfig['questions'][number]['feeds']> = {
    A1: [{ area: 'readiness' }, { area: 'affordability' }],
    A2: [{ area: 'readiness' }],
    A3: [{ area: 'readiness' }],
  };
  return {
    ...domainConfig,
    questions: domainConfig.questions.map((q) => ({
      ...q,
      feeds: feedsByQuestion[q.id] ?? q.feeds,
    })),
    access: { status: 'placeholder', lockedWhenFree },
  };
}

describe('buildReportModel with the real config', () => {
  const model = northbridgeReportModel();

  it('stages the Northbridge sample as building', () => {
    expect(model.stage).toEqual({ kind: 'staged', stage: 'building' });
  });

  it('has six areas in config order, all NotScorable because no formula exists', () => {
    expect(model.areas.map((a) => a.id)).toEqual([...scoreAreaIds]);
    expect(model.areas.every((a) => a.result.kind === 'not-scorable')).toBe(true);
    expect(
      model.areas.every(
        (a) => a.result.kind === 'not-scorable' && a.result.reason === 'no-formula',
      ),
    ).toBe(true);
  });

  it('has both gauges NotScorable', () => {
    expect(model.gauges.map((g) => g.id)).toEqual([...gaugeIds]);
    expect(model.gauges.every((g) => g.result.kind === 'not-scorable')).toBe(true);
  });

  it('computes completeness from the config, not a hard-coded 40', () => {
    const total = domainConfig.questions.length;
    const answered = domainConfig.questions.filter((q) =>
      northbridge.audit.answers.some((a) => a.questionId === q.id),
    ).length;
    expect(model.completeness).toEqual({ handled: answered, total, unknown: 0 });
  });

  it('flags the sample, keeps recommendations empty and locks nothing', () => {
    expect(model.isSample).toBe(true);
    expect(model.recommendations).toEqual([]);
    expect(model.unlocked).toBe(false);
    expect(model.areas.some((a) => a.locked)).toBe(false);
    expect(model.institutionName).toBe('Northbridge University');
    expect(model.configVersion).toBe(domainConfig.version);
    expect(model.pilot).toBe(domainConfig.agents.pilot);
    expect(model.configVersionMismatch).toBeUndefined();
  });
});

describe('evidence, gaps and completeness with feeding questions', () => {
  const config = feedingConfig();

  it('lists known answers as evidence and unanswered or Not sure questions as gaps', () => {
    const a = audit({
      answers: [known('A1', 'private-university', 'verified', 'high'), unknown('A2')],
    });
    const readiness = buildReportModel(a, { isSample: false }, config).areas.find(
      (x) => x.id === 'readiness',
    );
    expect(readiness?.evidence).toEqual([
      { questionId: 'A1', tag: 'verified', confidence: 'high' },
    ]);
    expect(readiness?.gaps).toEqual([{ questionId: 'A2' }, { questionId: 'A3' }]);
  });

  it('keeps areas with no feeding question empty', () => {
    const model = buildReportModel(audit(), { isSample: false }, config);
    const trust = model.areas.find((x) => x.id === 'trust-network');
    expect(trust?.evidence).toEqual([]);
    expect(trust?.gaps).toEqual([]);
  });

  it('counts Not sure as handled and as unknown', () => {
    const a = audit({
      answers: [known('A1', 'other'), unknown('A2'), unknown('A2'), unknown('B1')],
    });
    const model = buildReportModel(a, { isSample: false }, config);
    expect(model.completeness).toEqual({ handled: 3, total: config.questions.length, unknown: 2 });
  });

  it('uses the latest answer for a question', () => {
    const a = audit({ answers: [unknown('A1'), known('A1', 'other', 'estimate', 'low')] });
    const model = buildReportModel(a, { isSample: false }, config);
    expect(model.areas[0]?.evidence[0]).toEqual({
      questionId: 'A1',
      tag: 'estimate',
      confidence: 'low',
    });
    expect(model.completeness.unknown).toBe(0);
  });
});

describe('access and versions', () => {
  it('locks listed areas only when the entitlement is free', () => {
    const config = feedingConfig(['trust-network', 'community-influence']);
    const free = buildReportModel(audit({ entitlement: 'free' }), { isSample: false }, config);
    expect(free.areas.filter((a) => a.locked).map((a) => a.id)).toEqual([
      'trust-network',
      'community-influence',
    ]);
    const paid = buildReportModel(audit({ entitlement: 'unlocked' }), { isSample: false }, config);
    expect(paid.areas.some((a) => a.locked)).toBe(false);
    expect(paid.unlocked).toBe(true);
    expect(free.unlocked).toBe(false);
  });

  it('flags a config version mismatch and scores with the current config', () => {
    const model = buildReportModel(audit({ configVersion: 'old-version' }), { isSample: false });
    expect(model.configVersionMismatch).toBe(true);
    expect(model.configVersion).toBe(domainConfig.version);
  });
});

describe('purity', () => {
  it('does not mutate the audit and is deterministic', () => {
    const a = audit();
    const snapshot = structuredClone(a);
    const first = buildReportModel(a, { isSample: true });
    const second = buildReportModel(a, { isSample: true });
    expect(a).toEqual(snapshot);
    expect(first).toEqual(second);
  });
});

describe('fixtures', () => {
  it('synthetic model has three scored areas and two locked ones', () => {
    const model = syntheticScoredReportModel();
    expect(model.areas.filter((a) => a.result.kind === 'scored')).toHaveLength(3);
    expect(model.areas.filter((a) => a.locked)).toHaveLength(2);
    expect(model.gauges.every((g) => g.result.kind === 'scored-gauge')).toBe(true);
  });
});

describe('parseReportRequest', () => {
  const valid = {
    audit: {
      id: 'a1',
      institutionName: 'Test University',
      answers: [{ kind: 'unknown', questionId: 'A1' }],
      status: 'in-progress',
      configVersion: 'v',
      entitlement: 'free',
    },
  };

  it('accepts a valid body and defaults isSample to false', () => {
    const parsed = parseReportRequest(valid);
    expect(parsed).toMatchObject({ ok: true, isSample: false });
    expect(parsed.ok && parsed.audit.answers).toHaveLength(1);
  });

  it('accepts isSample true and an empty answers list', () => {
    const parsed = parseReportRequest({
      ...valid,
      isSample: true,
      audit: { ...valid.audit, answers: [] },
    });
    expect(parsed).toMatchObject({ ok: true, isSample: true });
  });

  const withAudit = (patch: Record<string, unknown>): unknown => ({
    audit: { ...valid.audit, ...patch },
  });

  it.each([
    ['a non-object body', 'nope'],
    ['an array body', []],
    ['a missing audit', {}],
    ['a non-boolean isSample', { ...valid, isSample: 'yes' }],
    ['a missing id', withAudit({ id: undefined })],
    ['an empty institution name', withAudit({ institutionName: '' })],
    ['a too-long institution name', withAudit({ institutionName: 'x'.repeat(201) })],
    ['a too-long id', withAudit({ id: 'x'.repeat(201) })],
    ['a bad status', withAudit({ status: 'done' })],
    ['a bad entitlement', withAudit({ entitlement: 'paid' })],
    ['a missing config version', withAudit({ configVersion: 3 })],
    ['answers not an array', withAudit({ answers: 'x' })],
    ['an unknown question id', withAudit({ answers: [{ kind: 'unknown', questionId: 'A99' }] })],
    ['a bad answer', withAudit({ answers: [{ kind: 'known', questionId: 'A1' }] })],
    [
      'too many answers',
      withAudit({
        answers: Array.from({ length: 201 }, () => ({ kind: 'unknown', questionId: 'A1' })),
      }),
    ],
  ])('rejects %s', (_label, body) => {
    expect(parseReportRequest(body).ok).toBe(false);
  });

  it('names the failing answer path', () => {
    const parsed = parseReportRequest(
      withAudit({ answers: [{ kind: 'known', questionId: 'A1' }] }),
    );
    expect(parsed.ok ? '' : parsed.message).toContain('audit.answers[0]');
  });
});
