import {
  createResendAdvisorSink,
  handleAdvisorRequest,
  resendSettingsFromEnv,
  stubAdvisorRequestSink,
} from '@/features/advisor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Sends by email when RESEND_API_KEY, ADVISOR_EMAIL_FROM and ADVISOR_EMAIL_TO are all set, else the stub. */
export function POST(request: Request): Promise<Response> {
  const settings = resendSettingsFromEnv(process.env);
  const sink = settings ? createResendAdvisorSink(settings) : stubAdvisorRequestSink;
  return handleAdvisorRequest(request, sink);
}
