/** Rates are ratios from 0 to 1 (0.55 means 55 percent). The UI converts from percent. */
export type ForecastInputs = {
  readonly qualifiedApplications: number;
  readonly offerRate: number;
  readonly enrolmentYield: number;
  readonly visaRetentionAdjustment: number;
};

/** Every step of qualified applications x offer rate x enrolment yield x visa and retention adjustment. */
export type Forecast = {
  readonly qualifiedApplications: number;
  readonly offers: number;
  readonly enrolled: number;
  readonly retained: number;
};
