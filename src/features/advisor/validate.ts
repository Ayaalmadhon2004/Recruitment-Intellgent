/** Pure validation for an advisor request. Used by the form and by the server route. */

export const channelIds = ['whatsapp', 'email', 'call'] as const;
export type ChannelId = (typeof channelIds)[number];

export const timeWindowIds = ['morning', 'afternoon', 'evening'] as const;
export type TimeWindowId = (typeof timeWindowIds)[number];

export const limits = {
  name: 100,
  institution: 150,
  contact: 254,
  message: 1000,
  phoneMinDigits: 6,
  phoneMaxDigits: 15,
} as const;

export type AdvisorRequestInput = {
  channel: ChannelId;
  name: string;
  institution: string;
  contact: string;
  time: TimeWindowId;
  message: string;
};

export type FieldName = keyof AdvisorRequestInput;

export type ErrorCode =
  | 'name-required'
  | 'name-too-long'
  | 'institution-too-long'
  | 'contact-required'
  | 'contact-invalid-email'
  | 'contact-invalid-phone'
  | 'contact-too-long'
  | 'message-too-long'
  | 'channel-invalid'
  | 'time-invalid';

export type FieldErrors = Partial<Record<FieldName, ErrorCode>>;

export type ValidationResult =
  { ok: true; value: AdvisorRequestInput } | { ok: false; errors: FieldErrors };

/** Accepts "ana@school.edu", rejects "ana@school" or "ana school@x.edu". */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Accepts "+84 (90) 123-4567", rejects "90abc123". */
const phoneCharacters = /^[0-9 +().-]+$/;

export const isChannel = (v: unknown): v is ChannelId => channelIds.some((id) => id === v);
export const isTimeWindow = (v: unknown): v is TimeWindowId => timeWindowIds.some((id) => id === v);

/** Anything that is not a string counts as empty, so odd payloads fail on "required". */
const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** Counts digits only: "+84 90" gives 4. Removes every non-digit. */
const digitCount = (s: string): number => s.replace(/\D/g, '').length;

function contactError(channel: ChannelId, contact: string): ErrorCode | null {
  if (contact === '') return 'contact-required';
  if (contact.length > limits.contact) return 'contact-too-long';
  if (channel === 'email') return emailPattern.test(contact) ? null : 'contact-invalid-email';
  const digits = digitCount(contact);
  const ok =
    phoneCharacters.test(contact) &&
    digits >= limits.phoneMinDigits &&
    digits <= limits.phoneMaxDigits;
  return ok ? null : 'contact-invalid-phone';
}

/** Takes unknown input (a JSON body or form state). Returns trimmed, typed values or per-field codes. */
export function validateAdvisorRequest(input: unknown): ValidationResult {
  const raw: Record<string, unknown> =
    typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};

  const channel = raw.channel;
  const time = raw.time;
  const name = text(raw.name);
  const institution = text(raw.institution);
  const contact = text(raw.contact);
  const message = text(raw.message);

  const errors: FieldErrors = {};
  if (!isChannel(channel)) errors.channel = 'channel-invalid';
  if (!isTimeWindow(time)) errors.time = 'time-invalid';
  if (name === '') errors.name = 'name-required';
  else if (name.length > limits.name) errors.name = 'name-too-long';
  if (institution.length > limits.institution) errors.institution = 'institution-too-long';
  if (isChannel(channel)) {
    const code = contactError(channel, contact);
    if (code) errors.contact = code;
  } else if (contact === '') errors.contact = 'contact-required';
  if (message.length > limits.message) errors.message = 'message-too-long';

  if (Object.keys(errors).length > 0 || !isChannel(channel) || !isTimeWindow(time)) {
    return { ok: false, errors };
  }
  return { ok: true, value: { channel, name, institution, contact, time, message } };
}
