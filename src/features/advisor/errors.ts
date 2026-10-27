import { en } from '@/domain/copy';
import type { ErrorCode } from './validate';

const e = en.advisor.errors;

export const errorMessages: Record<ErrorCode, string> = {
  'name-required': e.nameRequired,
  'name-too-long': e.nameTooLong,
  'institution-too-long': e.institutionTooLong,
  'contact-required': e.contactRequired,
  'contact-invalid-email': e.contactInvalidEmail,
  'contact-invalid-phone': e.contactInvalidPhone,
  'contact-too-long': e.contactTooLong,
  'message-too-long': e.messageTooLong,
  'channel-invalid': e.channelInvalid,
  'time-invalid': e.timeInvalid,
};
