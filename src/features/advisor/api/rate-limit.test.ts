import { describe, expect, it } from 'vitest';
import { clientKey, createRateLimiter, unknownClient } from './rate-limit';
import type { RateLimiterOptions } from './rate-limit';

const windowMs = 60_000;

function setup(overrides: Partial<RateLimiterOptions> = {}) {
  const clock = { t: 1_000_000 };
  const limiter = createRateLimiter({
    maxRequests: 3,
    windowMs,
    maxTrackedClients: 100,
    now: () => clock.t,
    ...overrides,
  });
  return { clock, limiter };
}

describe('createRateLimiter', () => {
  it('allows up to the limit, then refuses with the time left', () => {
    const { clock, limiter } = setup();
    for (let i = 0; i < 3; i += 1) {
      expect(limiter.check('a')).toEqual({ allowed: true });
      clock.t += 1000;
    }
    // The first hit was 3000 ms ago, so 57000 ms remain.
    expect(limiter.check('a')).toEqual({ allowed: false, retryAfterMs: 57_000 });
  });

  it('keeps clients apart', () => {
    const { limiter } = setup({ maxRequests: 1 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
    expect(limiter.check('b').allowed).toBe(true);
  });

  it('slides: the oldest hit leaves the window first', () => {
    const { clock, limiter } = setup();
    limiter.check('a'); // t0
    clock.t += 30_000;
    limiter.check('a'); // t0 + 30s
    limiter.check('a'); // t0 + 30s
    expect(limiter.check('a').allowed).toBe(false);
    clock.t += 30_000; // t0 + 60s: only the first hit has expired
    expect(limiter.check('a')).toEqual({ allowed: true });
    expect(limiter.check('a')).toEqual({ allowed: false, retryAfterMs: 30_000 });
  });

  it('allows again once the whole window has passed', () => {
    const { clock, limiter } = setup();
    for (let i = 0; i < 3; i += 1) limiter.check('a');
    expect(limiter.check('a').allowed).toBe(false);
    clock.t += windowMs;
    expect(limiter.check('a')).toEqual({ allowed: true });
  });

  it('does not extend the lockout when a refused request is retried', () => {
    const { clock, limiter } = setup({ maxRequests: 1 });
    limiter.check('a');
    clock.t += 10_000;
    expect(limiter.check('a')).toEqual({ allowed: false, retryAfterMs: 50_000 });
    clock.t += 10_000;
    expect(limiter.check('a')).toEqual({ allowed: false, retryAfterMs: 40_000 });
  });

  it('never grows past maxTrackedClients', () => {
    const { limiter } = setup({ maxTrackedClients: 3 });
    for (let i = 0; i < 50; i += 1) limiter.check(`ip-${i}`);
    expect(limiter.size()).toBe(3);
  });

  it('drops expired addresses before evicting live ones', () => {
    const { clock, limiter } = setup({ maxTrackedClients: 3, maxRequests: 1 });
    limiter.check('old-1');
    limiter.check('old-2');
    clock.t += windowMs;
    limiter.check('live');
    limiter.check('new');
    expect(limiter.size()).toBe(2);
    expect(limiter.check('live').allowed).toBe(false);
  });

  it('evicts the least recently seen address when all are live', () => {
    const { limiter } = setup({ maxTrackedClients: 2, maxRequests: 1 });
    limiter.check('a');
    limiter.check('b');
    limiter.check('a'); // refused, but "a" is now the most recent
    limiter.check('c'); // evicts "b"
    expect(limiter.size()).toBe(2);
    expect(limiter.check('a').allowed).toBe(false);
    expect(limiter.check('b').allowed).toBe(true);
  });

  it('uses Date.now when no clock is injected', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs, maxTrackedClients: 5 });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('a').allowed).toBe(false);
  });
});

describe('clientKey', () => {
  const h = (init: Record<string, string>): Headers => new Headers(init);

  it('takes the first hop of x-forwarded-for', () => {
    expect(clientKey(h({ 'x-forwarded-for': ' 203.0.113.7 , 10.0.0.1, 10.0.0.2' }))).toBe(
      '203.0.113.7',
    );
  });

  it('accepts IPv6', () => {
    expect(clientKey(h({ 'x-forwarded-for': '2001:db8::1' }))).toBe('2001:db8::1');
  });

  it('falls back to x-real-ip', () => {
    expect(clientKey(h({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4');
  });

  it('falls back to x-real-ip when the forwarded value is unusable', () => {
    expect(clientKey(h({ 'x-forwarded-for': ',1.2.3.4', 'x-real-ip': '198.51.100.4' }))).toBe(
      '198.51.100.4',
    );
  });

  it('uses one shared bucket when no address is given', () => {
    expect(clientKey(h({}))).toBe(unknownClient);
  });

  it.each(['', '   ', 'not an ip', '<script>', 'a'.repeat(200)])(
    'ignores the unusable value %j',
    (value) => {
      expect(clientKey(h({ 'x-forwarded-for': value }))).toBe(unknownClient);
    },
  );
});
