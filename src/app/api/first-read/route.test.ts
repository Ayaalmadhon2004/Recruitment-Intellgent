import { describe, expect, it } from 'vitest';
import type { FirstReadError, FirstReadResponse } from '@/features/quick-start/contract';
import { POST } from './route';

function post(body: string): Request {
  return new Request('http://localhost/api/first-read', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/first-read', () => {
  it('returns 200 with the stage and six NotScorable areas', async () => {
    const answers = [
      { kind: 'known', questionId: 'B1', value: 9, evidence: 'verified', confidence: 'high' },
    ];
    const res = await POST(post(JSON.stringify({ answers })));
    expect(res.status).toBe(200);
    const body = (await res.json()) as FirstReadResponse;
    expect(body.stage).toEqual({ kind: 'staged', stage: 'building' });
    expect(Object.values(body.areas)).toHaveLength(6);
    expect(Object.values(body.areas).every((a) => a.kind === 'not-scorable')).toBe(true);
    expect(body.answeredCount).toBe(1);
    expect(body.quickStartTotal).toBe(5);
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(post('{not json'));
    expect(res.status).toBe(400);
    expect(((await res.json()) as FirstReadError).error).toBe('invalid-request');
  });

  it('returns 400 for a bad shape', async () => {
    const res = await POST(
      post(JSON.stringify({ answers: [{ kind: 'known', questionId: 'B1' }] })),
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as FirstReadError).message).toContain('answers[0]');
  });

  it('returns 413 when the body is over 64 KB', async () => {
    const res = await POST(post(JSON.stringify({ answers: [], pad: 'x'.repeat(70_000) })));
    expect(res.status).toBe(413);
    expect(((await res.json()) as FirstReadError).error).toBe('invalid-request');
  });
});
