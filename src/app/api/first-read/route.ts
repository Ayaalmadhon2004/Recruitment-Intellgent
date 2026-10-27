import type { FirstReadError, FirstReadResponse } from '@/features/quick-start/contract';
import { computeFirstRead, parseFirstReadRequest } from '@/features/quick-start/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BYTES_PER_KB = 1024;
const MAX_BODY_KB = 64;
const MAX_BODY_BYTES = MAX_BODY_KB * BYTES_PER_KB;
const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;

function invalid(message: string, status: typeof BAD_REQUEST | typeof PAYLOAD_TOO_LARGE): Response {
  const body: FirstReadError = { error: 'invalid-request', message };
  return Response.json(body, { status });
}

/** Computes the First Read from posted answers. Nothing is stored and answers are not logged. */
export async function POST(request: Request): Promise<Response> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return invalid('Request body is too large.', PAYLOAD_TOO_LARGE);

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return invalid('Request body is too large.', PAYLOAD_TOO_LARGE);

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return invalid('Request body is not valid JSON.', BAD_REQUEST);
  }

  const parsed = parseFirstReadRequest(json);
  if (!parsed.ok) return invalid(parsed.message, BAD_REQUEST);

  const response: FirstReadResponse = computeFirstRead(parsed.answers);
  return Response.json(response);
}
