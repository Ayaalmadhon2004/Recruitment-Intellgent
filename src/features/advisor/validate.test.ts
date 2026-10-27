import { describe, expect, it } from 'vitest';
import { limits, validateAdvisorRequest } from './validate';

const valid = {
  channel: 'email',
  name: 'Linh Tran',
  institution: '',
  contact: 'linh@example.edu',
  time: 'morning',
  message: '',
};

describe('validateAdvisorRequest', () => {
  it('accepts a complete request', () => {
    expect(validateAdvisorRequest(valid)).toEqual({ ok: true, value: valid });
  });

  it('trims every text field', () => {
    const r = validateAdvisorRequest({
      ...valid,
      name: '  Linh  ',
      institution: ' Northbridge ',
      contact: ' linh@example.edu ',
      message: ' hi ',
    });
    expect(r).toMatchObject({
      ok: true,
      value: {
        name: 'Linh',
        institution: 'Northbridge',
        contact: 'linh@example.edu',
        message: 'hi',
      },
    });
  });

  it('requires a name, and treats whitespace as empty', () => {
    expect(validateAdvisorRequest({ ...valid, name: '   ' })).toEqual({
      ok: false,
      errors: { name: 'name-required' },
    });
  });

  it('limits name, institution and message length', () => {
    const r = validateAdvisorRequest({
      ...valid,
      name: 'a'.repeat(limits.name + 1),
      institution: 'a'.repeat(limits.institution + 1),
      message: 'a'.repeat(limits.message + 1),
    });
    expect(r).toEqual({
      ok: false,
      errors: {
        name: 'name-too-long',
        institution: 'institution-too-long',
        message: 'message-too-long',
      },
    });
    expect(validateAdvisorRequest({ ...valid, message: 'a'.repeat(limits.message) }).ok).toBe(true);
  });

  it('requires a contact', () => {
    expect(validateAdvisorRequest({ ...valid, contact: ' ' })).toEqual({
      ok: false,
      errors: { contact: 'contact-required' },
    });
  });

  it.each(['plain', 'a@b', 'a b@c.com', '@c.com'])('rejects the email %s', (contact) => {
    expect(validateAdvisorRequest({ ...valid, contact })).toEqual({
      ok: false,
      errors: { contact: 'contact-invalid-email' },
    });
  });

  it.each(['whatsapp', 'call'])('accepts phone formats on %s', (channel) => {
    for (const contact of ['+84 90 123 4567', '(028) 3822-1234', '090.123.4567', '123456']) {
      expect(validateAdvisorRequest({ ...valid, channel, contact }).ok).toBe(true);
    }
  });

  it.each(['whatsapp', 'call'])('rejects bad phone numbers on %s', (channel) => {
    for (const contact of [
      '12345',
      'abc123456',
      '090 123 456x',
      'linh@example.edu',
      '1'.repeat(16),
    ]) {
      expect(validateAdvisorRequest({ ...valid, channel, contact })).toEqual({
        ok: false,
        errors: { contact: 'contact-invalid-phone' },
      });
    }
  });

  it('rejects an over-long contact', () => {
    const r = validateAdvisorRequest({ ...valid, contact: `${'a'.repeat(limits.contact)}@x.com` });
    expect(r).toEqual({ ok: false, errors: { contact: 'contact-too-long' } });
  });

  it('rejects an unknown channel or time window', () => {
    expect(validateAdvisorRequest({ ...valid, channel: 'fax', time: 'midnight' })).toEqual({
      ok: false,
      errors: { channel: 'channel-invalid', time: 'time-invalid' },
    });
  });

  it.each([null, undefined, 'text', 42, []])('handles a non-object body: %s', (input) => {
    const r = validateAdvisorRequest(input);
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.errors).toMatchObject({ name: 'name-required', channel: 'channel-invalid' });
  });

  it('treats non-string fields as empty and drops unknown keys', () => {
    expect(validateAdvisorRequest({ ...valid, name: 5 })).toEqual({
      ok: false,
      errors: { name: 'name-required' },
    });
    const r = validateAdvisorRequest({ ...valid, extra: 'x' });
    expect(r).toEqual({ ok: true, value: valid });
  });
});
