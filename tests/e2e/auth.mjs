// Shared by the e2e scripts: sign in through the real Sign in screen with the DEVELOPMENT account service.
// That service returns the sign-in token to the page, so the "Open the sign-in link" button stands in for the
// email. Nothing is bypassed: the form, the link step and the redirect back are all driven as a person would.

export const devEmail = 'e2e@example.com';

/**
 * Signs in on `page` and resolves once the browser has landed on `next` (default /dashboard).
 * Throws if the sign-in screen does not behave.
 */
export async function signIn(page, base, next = '/dashboard') {
  await page.goto(`${base}/sign-in?next=${encodeURIComponent(next)}`, { waitUntil: 'networkidle' });
  await page.getByLabel('Work email').fill(devEmail);
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  await page.getByRole('button', { name: 'Open the sign-in link' }).click();
  await page.waitForURL((url) => url.pathname + url.search === next, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}
