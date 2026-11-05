import { validateAdvisorRequest } from '../validate';
import type { FieldErrors } from '../validate';
import { advisorAbuseConfig } from './abuse.config';
import { clientKey } from './rate-limit';
import type { RateLimiter } from './rate-limit';
import type { AdvisorRequestSink } from './sink';

const bytesPerKb = 1024;
const maxBodyKb = 16;
export const maxBodyBytes = maxBodyKb * bytesPerKb;

const http = {
  ok: 200,
  badRequest: 400,
  tooLarge: 413,
  tooManyRequests: 429,
  badGateway: 502,
} as const;

export type AdvisorResponseBody =
  | { ok: true }
  | { ok: false; errors: FieldErrors }
  | { ok: false; error: 'invalid-json' | 'too-large' | 'rate-limited' | 'delivery-failed' };

const msPerSecond = 1000;

const json = (body: AdvisorResponseBody, status: number, headers: HeadersInit = {}): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

/** True when the hidden trap field holds anything at all. Real people never see it, so never fill it. */
const trapFilled = (parsed: unknown): boolean => {
  if (typeof parsed !== 'object' || parsed === null) return false;
  const value = (parsed as Record<string, unknown>)[advisorAbuseConfig.honeypotField];
  if (value === undefined || value === null) return false;
  return !(typeof value === 'string' && value.trim() === '');
};

export type AdvisorHandlerOptions = {
  /** Per-address limit. Leave out for no limit (tests, stories). The route supplies the real one. */
  limiter?: RateLimiter;
};

/**
 * Checks the rate limit, validates the body and passes it to the sink. A filled honeypot field gets a
 * silent `{ ok: true }` and the request is dropped, so a bot learns nothing. No storage and no logging
 * of request contents.
 */
export async function handleAdvisorRequest(
  request: Request,
  sink: AdvisorRequestSink,
  options: AdvisorHandlerOptions = {},
): Promise<Response> {
  const decision = options.limiter?.check(clientKey(request.headers));
  if (decision && !decision.allowed) {
    const retryAfter = Math.max(Math.ceil(decision.retryAfterMs / msPerSecond), 1);
    return json({ ok: false, error: 'rate-limited' }, http.tooManyRequests, {
      'Retry-After': String(retryAfter),
    });
  }

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBodyBytes) {
    return json({ ok: false, error: 'too-large' }, http.tooLarge);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).length > maxBodyBytes) {
    return json({ ok: false, error: 'too-large' }, http.tooLarge);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return json({ ok: false, error: 'invalid-json' }, http.badRequest);
  }

  if (trapFilled(parsed)) return json({ ok: true }, http.ok);

  const result = validateAdvisorRequest(parsed);
  if (!result.ok) return json({ ok: false, errors: result.errors }, http.badRequest);

  try {
    await sink.deliver(result.value);
  } catch {
    return json({ ok: false, error: 'delivery-failed' }, http.badGateway);
  }
  return json({ ok: true }, http.ok);
}
