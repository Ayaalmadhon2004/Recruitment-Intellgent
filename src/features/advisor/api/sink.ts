import type { AdvisorRequestInput } from '../validate';

/**
 * Where a validated request goes. OPEN ITEM: the destination (email service, CRM) is not decided.
 * Implementations must not log personal data.
 */
export type AdvisorRequestSink = {
  deliver: (request: AdvisorRequestInput) => Promise<void>;
};

/** Stand-in until a destination is chosen. Sends nothing, stores nothing, logs nothing. */
export const stubAdvisorRequestSink: AdvisorRequestSink = {
  deliver: () => Promise.resolve(),
};
