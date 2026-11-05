/**
 * HTTP security headers sent on every response (wired in `next.config.ts`).
 *
 * The Content-Security-Policy is nonce-less on purpose: a nonce forces every page to render dynamically,
 * and this app is mostly static. Next.js inlines its bootstrap and RSC payload scripts and React emits
 * inline style attributes, so `script-src` and `style-src` allow `'unsafe-inline'`. Everything else is
 * locked to our own origin. next/font self-hosts its files and next/image serves from `/_next/image`,
 * so neither needs an external host.
 */

export interface SecurityHeader {
  readonly key: string;
  readonly value: string;
}

export interface SecurityHeaderOptions {
  /** Development needs `'unsafe-eval'` for React's debugging tools and `ws:` for hot reload. */
  readonly isDevelopment?: boolean;
}

export function buildContentSecurityPolicy({ isDevelopment = false }: SecurityHeaderOptions = {}): string {
  const directives: ReadonlyArray<readonly [string, readonly string[]]> = [
    ['default-src', ["'self'"]],
    ['script-src', ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])]],
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['img-src', ["'self'", 'data:', 'blob:']],
    ['font-src', ["'self'", 'data:']],
    ['connect-src', ["'self'", ...(isDevelopment ? ['ws:', 'wss:'] : [])]],
    ['media-src', ["'self'"]],
    ['worker-src', ["'self'", 'blob:']],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    ['form-action', ["'self'"]],
    ['frame-ancestors', ["'none'"]],
    ...(isDevelopment ? [] : ([['upgrade-insecure-requests', []]] as const)),
  ];
  return directives.map(([name, sources]) => [name, ...sources].join(' ')).join('; ');
}

/** One year, subdomains included. Browsers ignore it over plain HTTP, so it is safe to send everywhere. */
export const strictTransportSecurity = 'max-age=31536000; includeSubDomains';

export const permissionsPolicy = 'camera=(), microphone=(), geolocation=(), payment=()';

export function buildSecurityHeaders(options: SecurityHeaderOptions = {}): readonly SecurityHeader[] {
  return [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(options) },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: permissionsPolicy },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Strict-Transport-Security', value: strictTransportSecurity },
  ];
}
