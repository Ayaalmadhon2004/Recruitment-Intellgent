/**
 * Sliding-window rate limiter, pure apart from its own memory. The clock is injected so tests need no timers.
 *
 * LIMITATION: the counts live in this process only. Each serverless instance has its own map, so the real
 * ceiling is the limit times the number of warm instances, and a cold start forgets everything. This slows
 * casual abuse; it does not stop a determined one. Move it to a shared store once hosting is chosen
 * (see "Advisor abuse protection" in docs/DOMAIN-AND-OPEN-ITEMS.md).
 */

export type RateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
  /** When exceeded, expired entries go first, then the least recently seen address. */
  maxTrackedClients: number;
  /** Milliseconds since any fixed point. Defaults to `Date.now`. */
  now?: () => number;
};

export type RateLimitDecision = { allowed: true } | { allowed: false; retryAfterMs: number };

export type RateLimiter = {
  /** Records one request for `key` when allowed. A refused request is not recorded, so waiting always helps. */
  check: (key: string) => RateLimitDecision;
  /** Number of addresses currently remembered. For tests and diagnostics. */
  size: () => number;
};

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { maxRequests, windowMs, maxTrackedClients } = options;
  const now = options.now ?? Date.now;
  // Insertion order doubles as recency order: a key is deleted and re-set whenever it is touched.
  const hits = new Map<string, number[]>();

  const recent = (stamps: readonly number[], at: number): number[] =>
    stamps.filter((t) => t > at - windowMs);

  const dropExpired = (at: number): void => {
    [...hits]
      .filter(([, stamps]) => recent(stamps, at).length === 0)
      .forEach(([key]) => hits.delete(key));
  };

  /** Makes space for one more key: expired entries first, then the least recently seen. */
  const makeRoom = (at: number): void => {
    if (hits.size < maxTrackedClients) return;
    dropExpired(at);
    const excess = hits.size - maxTrackedClients + 1;
    [...hits.keys()].slice(0, Math.max(excess, 0)).forEach((key) => hits.delete(key));
  };

  return {
    check: (key) => {
      const at = now();
      const stamps = recent(hits.get(key) ?? [], at);
      hits.delete(key);
      if (stamps.length >= maxRequests) {
        const first = stamps[0] ?? at;
        hits.set(key, stamps);
        return { allowed: false, retryAfterMs: Math.max(first + windowMs - at, 0) };
      }
      makeRoom(at);
      hits.set(key, [...stamps, at]);
      return { allowed: true };
    },
    size: () => hits.size,
  };
}

const maxAddressLength = 64;
/** Accepts "203.0.113.7" and "2001:db8::1", rejects "<script>" and "not an ip". */
const plausibleAddress = /^[0-9A-Fa-f:.%]+$/;
export const unknownClient = 'unknown';

/**
 * Picks the client address: the first hop of `x-forwarded-for`, else `x-real-ip`, else one shared
 * "unknown" bucket (stricter on purpose: clients we cannot tell apart share one allowance).
 * Anything that does not look like an IPv4 or IPv6 address is ignored, so a forged header cannot fill
 * the map with arbitrary text. The header is only trustworthy when the host sets or overwrites it
 * (hosting is not chosen yet).
 */
export function clientKey(headers: Headers): string {
  const found = [headers.get('x-forwarded-for')?.split(',')[0], headers.get('x-real-ip')]
    .map((candidate) => candidate?.trim() ?? '')
    .find(
      (value) => value !== '' && value.length <= maxAddressLength && plausibleAddress.test(value),
    );
  return found ?? unknownClient;
}
