import { describe, expect, it } from 'vitest';
import { advisorAbuseConfig, maxBodyBytes } from '@/features/advisor';
import { POST, dynamic, runtime } from './route';

// The route keeps one limiter for the life of the module, so each test posts from its own address.
let nextAddress = 0;
const freshAddress = (): string => {
  nextAddress += 1;
  return `10.0.${Math.floor(nextAddress / 250)}.${(nextAddress % 250) + 1}`;
};

const post = (body: string, headers: Record<string, string> = {}): Promise<Response> =>
  POST(
    new Request('http://localhost/api/advisor-request', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': freshAddress(),
        ...headers,
      },
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

  it('silently accepts and drops a request whose honeypot is filled', async () => {
    const res = await post(JSON.stringify({ ...valid, [advisorAbuseConfig.honeypotField]: 'x' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('answers 429 with Retry-After after the configured number of requests from one address', async () => {
    const headers = { 'x-forwarded-for': '203.0.113.50, 10.1.1.1' };
    const { maxRequests, windowMs } = advisorAbuseConfig.rateLimit;
    for (let i = 0; i < maxRequests; i += 1) {
      expect((await post(JSON.stringify(valid), headers)).status).toBe(200);
    }
    const res = await post(JSON.stringify(valid), headers);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: 'rate-limited' });
    const retryAfter = Number(res.headers.get('Retry-After'));
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(windowMs / 1000);
    // A different address is not affected.
    expect((await post(JSON.stringify(valid))).status).toBe(200);
  });
});
