import { describe, expect, it } from 'vitest';
import { routes } from '@/domain/config';
import { sanitizeNext, signInHrefFor } from './return-to';

describe('sanitizeNext', () => {
  it.each(['/quick-start', '/report/pdf', '/quick-start?phase=read', '/dashboard#top', '/'])(
    'keeps the same-site path %s',
    (path) => expect(sanitizeNext(path)).toBe(path),
  );

  it.each([
    'https://elsewhere.example',
    '//elsewhere.example',
    '/\\elsewhere.example',
    '/\t/elsewhere.example',
    'javascript:alert(1)',
    'quick-start',
    '',
    '/sign-in',
    '/sign-in?next=%2Freport',
    null,
    undefined,
  ])('ignores %j', (value) => expect(sanitizeNext(value)).toBeUndefined());
});

describe('signInHrefFor', () => {
  it('names the page to come back to', () => {
    expect(signInHrefFor('/quick-start?phase=read')).toBe(
      `${routes.signIn}?next=${encodeURIComponent('/quick-start?phase=read')}`,
    );
  });

  it('leaves out a next that is not safe', () => {
    expect(signInHrefFor('https://elsewhere.example')).toBe(routes.signIn);
    expect(signInHrefFor(undefined)).toBe(routes.signIn);
  });
});
