import { handleAdvisorRequest, stubAdvisorRequestSink } from '@/features/advisor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(request: Request): Promise<Response> {
  return handleAdvisorRequest(request, stubAdvisorRequestSink);
}
