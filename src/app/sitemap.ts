import type { MetadataRoute } from 'next';
import { sitemapPaths } from '@/domain/config';
import { getSiteUrl } from './siteUrl';

/**
 * Sitemap entries need absolute addresses, so this lists pages only when `NEXT_PUBLIC_SITE_URL`
 * is set. Without it the sitemap is empty rather than guessing a domain. No dates or priorities
 * are given because none are known.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  if (!site) return [];
  return sitemapPaths.map((path) => ({ url: new URL(path, site).toString() }));
}
