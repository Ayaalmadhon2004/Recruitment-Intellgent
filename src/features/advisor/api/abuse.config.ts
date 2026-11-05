const msPerSecond = 1000;
const secondsPerMinute = 60;
const windowMinutes = 10;
const maxRequestsPerWindow = 5;
const maxTrackedAddresses = 5000;

/**
 * PLACEHOLDER limits for POST /api/advisor-request. Chosen as sane defaults, not Capstone facts.
 * Change them here; nothing else in the code holds these numbers.
 */
export const advisorAbuseConfig = {
  rateLimit: {
    /** Requests one client address may make inside the window, valid or not. */
    maxRequests: maxRequestsPerWindow,
    windowMs: windowMinutes * secondsPerMinute * msPerSecond,
    /** Upper bound on remembered addresses, so the map cannot grow without limit. */
    maxTrackedClients: maxTrackedAddresses,
  },
  /** Name of the hidden form field. Real people never fill it; many bots fill every field. */
  honeypotField: 'website',
} as const;
