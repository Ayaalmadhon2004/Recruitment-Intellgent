/**
 * True only in `next dev`. Development-only notices (the dev account and unlock services) read this so they
 * never reach real users. Next replaces `process.env.NODE_ENV` at build time, so it is safe on the client.
 */
export const isDevelopmentBuild: boolean = process.env.NODE_ENV === 'development';

/** Pure form of `devServicesEnabled`, so the rule can be tested without rebuilding. */
export const devServicesEnabledFor = (
  nodeEnv: string | undefined,
  flag: string | undefined,
): boolean => nodeEnv !== 'production' || flag === 'true';

/**
 * True while the development account and unlock services may run: in `next dev` and in tests, and in a
 * production build only when it was built with `NEXT_PUBLIC_ENABLE_DEV_SERVICES=true` (the e2e and preview
 * builds). Those services keep accounts and unlocks in the browser and verify nothing, so a real production
 * build must not offer them (docs/DECISIONS.md 6). A real provider replaces them and this switch goes away.
 * Next inlines both variables at build time, so they are written out in full here.
 */
export const devServicesEnabled: boolean = devServicesEnabledFor(
  process.env.NODE_ENV,
  process.env.NEXT_PUBLIC_ENABLE_DEV_SERVICES,
);
