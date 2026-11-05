import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy, buildSecurityHeaders } from './security-headers';

const valueOf = (name: string): string | undefined => buildSecurityHeaders().find((h) => h.key === name)?.value;

describe('security headers', () => {
  it('sends every required header', () => {
    expect(buildSecurityHeaders().map((h) => h.key)).toEqual([
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'X-Frame-Options',
      'Strict-Transport-Security',
    ]);
  });

  it('sets the fixed values', () => {
    expect(valueOf('X-Content-Type-Options')).toBe('nosniff');
    expect(valueOf('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(valueOf('X-Frame-Options')).toBe('DENY');
    expect(valueOf('Strict-Transport-Security')).toContain('max-age=31536000');
  });

  it('disables camera, microphone, geolocation and payment', () => {
    const policy = valueOf('Permissions-Policy') ?? '';
    ['camera', 'microphone', 'geolocation', 'payment'].forEach((feature) => {
      expect(policy).toContain(`${feature}=()`);
    });
  });

  it('forbids framing and plugins and keeps everything on our origin', () => {
    const csp = buildContentSecurityPolicy();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp.includes('http://') || csp.includes('https://')).toBe(false);
  });

  it('allows eval and websockets only in development', () => {
    const prod = buildContentSecurityPolicy();
    expect(prod).not.toContain('unsafe-eval');
    expect(prod).not.toContain('ws:');
    expect(prod).toContain('upgrade-insecure-requests');
    const dev = buildContentSecurityPolicy({ isDevelopment: true });
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).toContain('ws:');
    expect(dev).not.toContain('upgrade-insecure-requests');
  });
});
