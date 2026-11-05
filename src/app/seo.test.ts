import { afterEach, describe, expect, it, vi } from 'vitest';
import { sitemapPaths } from '@/domain/config';
import robots from './robots';
import sitemap from './sitemap';
import { getSiteUrl } from './siteUrl';

afterEach(() => vi.unstubAllEnvs());

describe('site url', () => {
  it('is undefined when unset, blank or not http(s)', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(getSiteUrl()).toBeUndefined();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'not a url');
    expect(getSiteUrl()).toBeUndefined();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'ftp://example.org');
    expect(getSiteUrl()).toBeUndefined();
  });
});

describe('robots', () => {
  it('blocks the API, allows the rest, and omits the sitemap without a site url', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    const result = robots();
    expect(result.rules).toMatchObject({ allow: '/', disallow: '/api/' });
    expect(result.sitemap).toBeUndefined();
  });

  it('points at the sitemap when a site url is set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    expect(robots().sitemap).toBe('https://example.test/sitemap.xml');
  });
});

describe('sitemap', () => {
  it('is empty without a site url', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(sitemap()).toEqual([]);
  });

  it('lists the public routes as absolute urls when a site url is set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(sitemapPaths.length);
    expect(urls).toContain('https://example.test/');
    expect(urls).toContain('https://example.test/quick-start');
    expect(urls.some((u) => u.includes('/report') || u.includes('/api'))).toBe(false);
  });
});
