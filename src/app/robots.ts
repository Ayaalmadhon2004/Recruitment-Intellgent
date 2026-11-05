import type { MetadataRoute } from 'next';
import { getSiteUrl } from './siteUrl';

/** Crawlers may read the site but not the API. The sitemap line appears only when a site URL is set. */
export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(site ? { sitemap: new URL('/sitemap.xml', site).toString() } : {}),
  };
}
