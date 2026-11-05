import { describe, expect, it, vi } from 'vitest';
import { advisorAbuseConfig } from './abuse.config';
import { handleAdvisorRequest } from './handler';
import { createRateLimiter } from './rate-limit';
import type { AdvisorRequestSink } from './sink';

const valid = {
  channel: 'email',
  name: 'Linh',
  institution: 'Northbridge',
  contact: 'linh@example.edu',
  time: 'morning',
  message: 'Hello',
};

const req = (body: unknown, headers: Record<string, string> = {}): Request =>
  new Request('http://localhost/x', { method: 'POST', body: JSON.stringify(body), headers });

const trap = advisorAbuseConfig.honeypotField;

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

  describe('honeypot', () => {
    it.each([
      ['a URL', 'http://spam.example'],
      ['one character', 'x'],
      ['a number', 7],
      ['true', true],
      ['an object', { a: 1 }],
    ])('answers ok:true and drops the request when the trap holds %s', async (_n, value) => {
      const deliver = vi.fn(() => Promise.resolve());
      const res = await handleAdvisorRequest(req({ ...valid, [trap]: value }), { deliver });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(deliver).not.toHaveBeenCalled();
    });

    it('answers ok:true even when the rest is invalid, so a bot learns nothing', async () => {
      const deliver = vi.fn(() => Promise.resolve());
      const res = await handleAdvisorRequest(req({ name: '', [trap]: 'x' }), { deliver });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(deliver).not.toHaveBeenCalled();
    });

    it.each([
      ['an empty string', ''],
      ['spaces only', '   '],
      ['null', null],
      ['missing', undefined],
    ])('delivers normally when the trap is %s', async (_n, value) => {
      const deliver = vi.fn(() => Promise.resolve());
      const res = await handleAdvisorRequest(req({ ...valid, [trap]: value }), { deliver });
      expect(res.status).toBe(200);
      expect(deliver).toHaveBeenCalledWith(valid);
    });

    it('never passes the trap field on to the sink', async () => {
      const delivered: unknown[] = [];
      const sink: AdvisorRequestSink = {
        deliver: (request) => {
          delivered.push(request);
          return Promise.resolve();
        },
      };
      await handleAdvisorRequest(req({ ...valid, [trap]: '' }), sink);
      expect(delivered).toHaveLength(1);
      expect(delivered[0]).not.toHaveProperty(trap);
    });
  });

  describe('rate limit', () => {
    const windowMs = 60_000;
    const limited = (maxRequests: number, clock: { t: number }) =>
      createRateLimiter({ maxRequests, windowMs, maxTrackedClients: 10, now: () => clock.t });
    const ip = (address: string): Record<string, string> => ({ 'x-forwarded-for': address });
    const okSink: AdvisorRequestSink = { deliver: () => Promise.resolve() };

    it('answers 429 with Retry-After and an error key once the limit is passed', async () => {
      const clock = { t: 0 };
      const limiter = limited(2, clock);
      const deliver = vi.fn(() => Promise.resolve());
      const sink: AdvisorRequestSink = { deliver };
      await handleAdvisorRequest(req(valid, ip('1.1.1.1')), sink, { limiter });
      clock.t += 10_000;
      await handleAdvisorRequest(req(valid, ip('1.1.1.1')), sink, { limiter });
      clock.t += 10_000;
      const res = await handleAdvisorRequest(req(valid, ip('1.1.1.1')), sink, { limiter });
      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBe('40');
      expect(res.headers.get('Cache-Control')).toBe('no-store');
      expect(await res.json()).toEqual({ ok: false, error: 'rate-limited' });
      expect(deliver).toHaveBeenCalledTimes(2);
    });

    it('rounds Retry-After up and never sends less than 1 second', async () => {
      const clock = { t: 0 };
      const limiter = limited(1, clock);
      await handleAdvisorRequest(req(valid, ip('1.1.1.1')), okSink, { limiter });
      clock.t = windowMs - 500;
      const res = await handleAdvisorRequest(req(valid, ip('1.1.1.1')), okSink, { limiter });
      expect(res.headers.get('Retry-After')).toBe('1');
    });

    it('limits per address using the first x-forwarded-for hop', async () => {
      const limiter = limited(1, { t: 0 });
      const first = req(valid, ip('1.1.1.1, 9.9.9.9'));
      expect((await handleAdvisorRequest(first, okSink, { limiter })).status).toBe(200);
      const again = req(valid, ip('1.1.1.1, 9.9.9.9'));
      expect((await handleAdvisorRequest(again, okSink, { limiter })).status).toBe(429);
      // Same first hop, different later hops: still the same client.
      const same = req(valid, ip('1.1.1.1, 8.8.8.8'));
      expect((await handleAdvisorRequest(same, okSink, { limiter })).status).toBe(429);
      // Another client is unaffected.
      const other = req(valid, ip('2.2.2.2'));
      expect((await handleAdvisorRequest(other, okSink, { limiter })).status).toBe(200);
    });

    it('counts invalid, malformed and honeypot requests too', async () => {
      const limiter = limited(3, { t: 0 });
      const h = ip('3.3.3.3');
      const invalid = req({ ...valid, name: '' }, h);
      expect((await handleAdvisorRequest(invalid, okSink, { limiter })).status).toBe(400);
      const trapped = req({ ...valid, [trap]: 'x' }, h);
      expect((await handleAdvisorRequest(trapped, okSink, { limiter })).status).toBe(200);
      const bad = new Request('http://localhost/x', { method: 'POST', body: '{', headers: h });
      expect((await handleAdvisorRequest(bad, okSink, { limiter })).status).toBe(400);
      expect((await handleAdvisorRequest(req(valid, h), okSink, { limiter })).status).toBe(429);
    });

    it('answers 429 before reading the body', async () => {
      const limiter = limited(1, { t: 0 });
      await handleAdvisorRequest(req(valid), okSink, { limiter });
      const second = req(valid);
      const res = await handleAdvisorRequest(second, okSink, { limiter });
      expect(res.status).toBe(429);
      expect(second.bodyUsed).toBe(false);
    });

    it('accepts requests again after the window', async () => {
      const clock = { t: 0 };
      const limiter = limited(1, clock);
      await handleAdvisorRequest(req(valid), okSink, { limiter });
      expect((await handleAdvisorRequest(req(valid), okSink, { limiter })).status).toBe(429);
      clock.t += windowMs;
      expect((await handleAdvisorRequest(req(valid), okSink, { limiter })).status).toBe(200);
    });

    it('puts clients with no address header in one shared bucket', async () => {
      const limiter = limited(1, { t: 0 });
      expect((await handleAdvisorRequest(req(valid), okSink, { limiter })).status).toBe(200);
      expect((await handleAdvisorRequest(req(valid), okSink, { limiter })).status).toBe(429);
    });

    it('does not limit when no limiter is given', async () => {
      const responses = await Promise.all(
        Array.from({ length: 20 }, () => handleAdvisorRequest(req(valid), okSink)),
      );
      expect(responses.every((r) => r.status === 200)).toBe(true);
    });
  });
});
