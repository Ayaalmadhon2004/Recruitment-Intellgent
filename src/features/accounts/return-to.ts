import { routes } from '@/domain/config';

/**
 * Where to go after signing in. Only a relative path on this site is accepted: it must start with a single
 * "/", so no scheme, no host and no protocol-relative "//". Anything else is ignored (no open redirect).
 */
export function sanitizeNext(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//'))
    return undefined;
  // Backslashes and control characters are read as "/" or stripped by some browsers.
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return undefined;
  const path = value.split(/[?#]/, 1)[0];
  if (path === routes.signIn) return undefined;
  return value;
}

/** The sign-in address that brings the person back to `next`. `next` that fails `sanitizeNext` is left out. */
export function signInHrefFor(next?: string | null): string {
  const safe = sanitizeNext(next);
  return safe === undefined ? routes.signIn : `${routes.signIn}?next=${encodeURIComponent(safe)}`;
}
