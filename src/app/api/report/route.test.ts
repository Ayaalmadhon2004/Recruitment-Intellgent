import { describe, expect, it } from 'vitest';
import type { ReportModel } from '@/features/report/contract';
import { northbridge } from '../../../../tests/fixtures/northbridge';
import { POST } from './route';

function post(body: string): Request {
  return new Request('http://localhost/api/report', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/report', () => {
  it('returns 200 with the report model for a valid audit', async () => {
    const res = await POST(post(JSON.stringify({ audit: northbridge.audit, isSample: true })));
    expect(res.status).toBe(200);
    const body = (await res.json()) as ReportModel;
    expect(body.isSample).toBe(true);
    expect(body.stage).toEqual({ kind: 'staged', stage: 'building' });
    expect(body.areas).toHaveLength(6);
    expect(body.areas.every((a) => !a.locked && a.result.kind === 'not-scorable')).toBe(true);
    expect(body.gauges).toHaveLength(2);
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(post('{not json'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a bad shape', async () => {
    const res = await POST(post(JSON.stringify({ audit: { id: 'x' } })));
    expect(res.status).toBe(400);
    expect(((await res.json()) as { message: string }).message).toContain('audit.');
  });

  it('returns 413 when the body is over 64 KB', async () => {
    const res = await POST(
      post(JSON.stringify({ audit: northbridge.audit, pad: 'x'.repeat(70_000) })),
    );
    expect(res.status).toBe(413);
  });
});
