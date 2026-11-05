/**
 * The public address of this deployment, read from `NEXT_PUBLIC_SITE_URL` (for example
 * `https://example.org`). Returns `undefined` when it is unset or not a valid http(s) URL, and
 * callers then leave out anything that needs an absolute address. No fallback is ever invented.
 */
export function getSiteUrl(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : undefined;
  } catch {
    return undefined;
  }
}
