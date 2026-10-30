import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

const { createResendAdvisorSink, resendSettingsFromEnv } = await import('./resend-sink');

const settings = { apiKey: 're_test', from: 'VRI <a@x.test>', to: 'team@x.test' };
const request = {
  channel: 'email',
  name: 'Linh\nBcc: x',
  institution: '',
  contact: 'linh@example.edu',
  time: 'morning',
  message: 'Hello',
} as const;

describe('createResendAdvisorSink', () => {
  beforeEach(() => send.mockReset());

  it('sends one email to the team and replies to the person on the email channel', async () => {
    send.mockResolvedValue({ data: { id: '1' }, error: null });
    await createResendAdvisorSink(settings).deliver(request);
    const sent = send.mock.calls[0]?.[0];
    expect(sent).toMatchObject({
      from: settings.from,
      to: settings.to,
      replyTo: 'linh@example.edu',
    });
    expect(sent.subject).not.toContain('Linh');
    expect(sent.text).toContain('Name: Linh Bcc: x');
  });

  it('sets no reply-to when the person chose a phone channel', async () => {
    send.mockResolvedValue({ data: { id: '1' }, error: null });
    await createResendAdvisorSink(settings).deliver({
      ...request,
      channel: 'whatsapp',
      contact: '+84 90 123 456',
    });
    expect(send.mock.calls[0]?.[0]).not.toHaveProperty('replyTo');
  });

  it('throws when the service reports an error, without echoing request data', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'bad', name: 'x' } });
    await expect(createResendAdvisorSink(settings).deliver(request)).rejects.toThrow(
      /not accepted/,
    );
  });
});

describe('resendSettingsFromEnv', () => {
  it('needs all three values', () => {
    expect(resendSettingsFromEnv({ RESEND_API_KEY: 'k', ADVISOR_EMAIL_FROM: 'f' })).toBeUndefined();
    expect(
      resendSettingsFromEnv({
        RESEND_API_KEY: 'k',
        ADVISOR_EMAIL_FROM: 'f',
        ADVISOR_EMAIL_TO: 't',
      }),
    ).toEqual({ apiKey: 'k', from: 'f', to: 't' });
  });
});
