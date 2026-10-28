import { describe, expect, it, vi } from 'vitest';
import { handleAdvisorRequest } from './handler';
import type { AdvisorRequestSink } from './sink';

const valid = {
  channel: 'email',
  name: 'Linh',
  institution: 'Northbridge',
  contact: 'linh@example.edu',
  time: 'morning',
  message: 'Hello',
};

const req = (body: unknown): Request =>
  new Request('http://localhost/x', { method: 'POST', body: JSON.stringify(body) });

describe('handleAdvisorRequest', () => {
  it('passes only the validated, trimmed request to the sink', async () => {
    const deliver = vi.fn(() => Promise.resolve());
    const sink: AdvisorRequestSink = { deliver };
    const res = await handleAdvisorRequest(req({ ...valid, name: ' Linh ', extra: 'drop' }), sink);
    expect(res.status).toBe(200);
    expect(deliver).toHaveBeenCalledWith({ ...valid, name: 'Linh' });
  });

  it('does not call the sink for an invalid request', async () => {
    const deliver = vi.fn(() => Promise.resolve());
    const res = await handleAdvisorRequest(req({ ...valid, name: '' }), { deliver });
    expect(res.status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('answers 502 without leaking details when the sink fails', async () => {
    const sink: AdvisorRequestSink = { deliver: () => Promise.reject(new Error('secret detail')) };
    const res = await handleAdvisorRequest(req(valid), sink);
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain('secret');
  });
});
