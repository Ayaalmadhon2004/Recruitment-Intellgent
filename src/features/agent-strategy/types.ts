import type { AgentRatings } from '@/domain/types';

export type SampleAgent = {
  readonly id: string;
  readonly name: string;
  readonly ratings: AgentRatings;
};

/** The four forecast fields as typed by the person. Rates are percents here, ratios in the domain. */
export type ForecastFormValues = {
  readonly applications: string;
  readonly offerRate: string;
  readonly enrolmentYield: string;
  readonly visaRetention: string;
};
