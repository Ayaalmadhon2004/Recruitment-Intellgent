import { Resend } from 'resend';
import type { AdvisorRequestInput } from '../validate';
import type { AdvisorRequestSink } from './sink';

export type ResendSinkSettings = {
  apiKey: string;
  /** Verified sender, for example `Capstone VRI <advisor@your-domain>`. */
  from: string;
  /** Inbox that receives advisor requests. */
  to: string;
};

/** Internal email for the Capstone team, not UI text, so it lives here and not in `en.ts`. */
const subject = 'New advisor request from VRI';

/** Single-line values only, so a pasted value cannot add lines to the body. */
const oneLine = (value: string): string => value.replace(/\s+/g, ' ').trim();

function bodyText(request: AdvisorRequestInput): string {
  return [
    `Name: ${oneLine(request.name)}`,
    `Institution: ${oneLine(request.institution) || '-'}`,
    `Preferred channel: ${request.channel}`,
    `Contact: ${oneLine(request.contact)}`,
    `Best time: ${request.time}`,
    '',
    'Message:',
    request.message || '-',
  ].join('\n');
}

/** Sends each validated request to one inbox. Throws on failure so the route answers `delivery-failed`. */
export function createResendAdvisorSink(settings: ResendSinkSettings): AdvisorRequestSink {
  const client = new Resend(settings.apiKey);
  return {
    deliver: async (request) => {
      const { error } = await client.emails.send({
        from: settings.from,
        to: settings.to,
        subject,
        text: bodyText(request),
        ...(request.channel === 'email' ? { replyTo: request.contact } : {}),
      });
      if (error) throw new Error('Advisor email was not accepted by the email service.');
    },
  };
}

/** Reads the three environment values. Returns nothing unless all are set. */
export function resendSettingsFromEnv(
  env: Record<string, string | undefined>,
): ResendSinkSettings | undefined {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.ADVISOR_EMAIL_FROM?.trim();
  const to = env.ADVISOR_EMAIL_TO?.trim();
  return apiKey && from && to ? { apiKey, from, to } : undefined;
}
