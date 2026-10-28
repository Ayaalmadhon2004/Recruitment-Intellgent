import { describe, expect, it } from 'vitest';
import { maxBodyBytes } from '@/features/advisor';
import { POST, dynamic, runtime } from './route';

const post = (body: string, headers: Record<string, string> = {}): Promise<Response> =>
  POST(
    new Request('http://localhost/api/advisor-request', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json', ...headers },
    }),
  );

const valid = {
  channel: 'whatsapp',
  name: 'Linh',
  institution: '',
  contact: '+84 90 123 4567',
  time: 'evening',
  message: '',
};

describe('POST /api/advisor-request', () => {
  it('runs on node and is never cached', () => {
    expect(runtime).toBe('nodejs');
    expect(dynamic).toBe('force-dynamic');
  });

  it('returns 200 { ok: true } for a valid request', async () => {
    const res = await post(JSON.stringify(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('returns 400 with field errors', async () => {
    const res = await post(JSON.stringify({ ...valid, name: '', contact: 'x' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      errors: { name: 'name-required', contact: 'contact-invalid-phone' },
    });
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await post('{not json');
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'invalid-json' });
  });

  it('returns 400 for a body of the wrong shape', async () => {
    const res = await post('[1,2]');
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, errors: { name: 'name-required' } });
  });

  it('returns 413 over 16 KB', async () => {
    const res = await post(JSON.stringify({ ...valid, message: 'a'.repeat(maxBodyBytes) }));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ ok: false, error: 'too-large' });
  });

  it('returns 413 from the declared length without reading the body', async () => {
    const res = await post('{}', { 'content-length': String(maxBodyBytes + 1) });
    expect(res.status).toBe(413);
  });
});
