import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION } from '@/domain/config';
import { known } from '../../../tests/fixtures/builders';
import { parseAuditSummariesRequest, summariseAudits } from './server';

describe('parseAuditSummariesRequest', () => {
  it('accepts audits with answers and a config version', () => {
    const parsed = parseAuditSummariesRequest({
      audits: [{ id: 'a', configVersion: 'v0', answers: [known('B1', 9)] }],
    });
    expect(parsed.ok).toBe(true);
  });

  it.each([
    ['no body object', null],
    ['no audits array', {}],
    ['audit not an object', { audits: ['x'] }],
    ['empty id', { audits: [{ id: '', configVersion: 'v', answers: [] }] }],
    ['missing version', { audits: [{ id: 'a', answers: [] }] }],
    ['bad answers', { audits: [{ id: 'a', configVersion: 'v', answers: [{ kind: 'known' }] }] }],
  ])('rejects %s', (_name, body) => {
    expect(parseAuditSummariesRequest(body).ok).toBe(false);
  });

  it('rejects too many audits', () => {
    const audits = Array.from({ length: 51 }, (_, i) => ({
      id: `a${i}`,
      configVersion: 'v',
      answers: [],
    }));
    expect(parseAuditSummariesRequest({ audits }).ok).toBe(false);
  });
});

describe('summariseAudits', () => {
  it('recomputes the stage with the current config whatever version the audit was saved under', () => {
    const result = summariseAudits([
      { id: 'a', configVersion: 'vri-config-0.0.1', answers: [known('B1', 9)] },
      { id: 'b', configVersion: CONFIG_VERSION, answers: [] },
    ]);
    expect(result.configVersion).toBe(CONFIG_VERSION);
    expect(result.summaries[0]).toEqual({ id: 'a', stage: { kind: 'staged', stage: 'building' } });
    expect(result.summaries[1]?.stage.kind).toBe('not-scorable');
  });
});
