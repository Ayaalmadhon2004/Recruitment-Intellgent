import { devServicesEnabled } from '@/domain/config';
import type { ReportModel } from '@/features/report/contract';
import { buildReportModel, parseReportRequest } from '@/features/report/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BYTES_PER_KB = 1024;
const MAX_BODY_KB = 64;
const MAX_BODY_BYTES = MAX_BODY_KB * BYTES_PER_KB;
const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;

function invalid(message: string, status: typeof BAD_REQUEST | typeof PAYLOAD_TOO_LARGE): Response {
  return Response.json({ error: 'invalid-request', message }, { status });
}

/** Builds the report model from a posted audit. Nothing is stored and the audit is not logged. */
export async function POST(request: Request): Promise<Response> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES)
    return invalid('Request body is too large.', PAYLOAD_TOO_LARGE);

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES)
    return invalid('Request body is too large.', PAYLOAD_TOO_LARGE);

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return invalid('Request body is not valid JSON.', BAD_REQUEST);
  }

  const parsed = parseReportRequest(json);
  if (!parsed.ok) return invalid(parsed.message, BAD_REQUEST);

  // The browser's claim of "unlocked" comes from the development unlock service. A production build has no
  // store to check it against (open item 7), so it is not believed: the audit is treated as free.
  const audit = devServicesEnabled
    ? parsed.audit
    : { ...parsed.audit, entitlement: 'free' as const };
  const model: ReportModel = buildReportModel(audit, { isSample: parsed.isSample });
  return Response.json(model);
}
