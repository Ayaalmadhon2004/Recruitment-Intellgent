import { describe, expect, it } from 'vitest';
import type { AuditSummariesResponse } from '@/features/accounts/contract';
import { POST } from './route';

function post(body: string): Request {
  return new Request('http://localhost/api/audit-summaries', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/audit-summaries', () => {
  it('returns the stage of each audit', async () => {
    const answers = [{ kind: 'known', questionId: 'B1', value: 9, evidence: 'verified', confidence: 'high' }];
    const res = await POST(post(JSON.stringify({ audits: [{ id: 'a', configVersion: 'v', answers }] })));
    expect(res.status).toBe(200);
    const body = (await res.json()) as AuditSummariesResponse;
    expect(body.summaries).toEqual([{ id: 'a', stage: { kind: 'staged', stage: 'building' } }]);
  });

  it('returns NotScorable, not a guess, when the stage question is unanswered', async () => {
    const res = await POST(post(JSON.stringify({ audits: [{ id: 'a', configVersion: 'v', answers: [] }] })));
    const body = (await res.json()) as AuditSummariesResponse;
    expect(body.summaries[0]?.stage.kind).toBe('not-scorable');
  });

  it('returns 400 for invalid JSON and bad shapes', async () => {
    expect((await POST(post('{nope'))).status).toBe(400);
    expect((await POST(post(JSON.stringify({ audits: 'x' })))).status).toBe(400);
  });

  it('returns 413 when the body is too large', async () => {
    const res = await POST(post(JSON.stringify({ audits: [], pad: 'x'.repeat(600_000) })));
    expect(res.status).toBe(413);
  });
});
