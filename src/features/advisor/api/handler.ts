import { validateAdvisorRequest } from '../validate';
import type { FieldErrors } from '../validate';
import type { AdvisorRequestSink } from './sink';

const bytesPerKb = 1024;
const maxBodyKb = 16;
export const maxBodyBytes = maxBodyKb * bytesPerKb;

const http = { ok: 200, badRequest: 400, tooLarge: 413, badGateway: 502 } as const;

export type AdvisorResponseBody =
  | { ok: true }
  | { ok: false; errors: FieldErrors }
  | { ok: false; error: 'invalid-json' | 'too-large' | 'delivery-failed' };

const json = (body: AdvisorResponseBody, status: number): Response =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/** Validates the body and passes it to the sink. No storage and no logging of request contents. */
export async function handleAdvisorRequest(
  request: Request,
  sink: AdvisorRequestSink,
): Promise<Response> {
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

  const result = validateAdvisorRequest(parsed);
  if (!result.ok) return json({ ok: false, errors: result.errors }, http.badRequest);

  try {
    await sink.deliver(result.value);
  } catch {
    return json({ ok: false, error: 'delivery-failed' }, http.badGateway);
  }
  return json({ ok: true }, http.ok);
}
