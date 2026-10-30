import type { Forecast, ForecastInputs } from '../types';

function assertRate(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be a ratio from 0 to 1, got ${value}`);
  }
}

/**
 * qualified applications x offer rate x enrolment yield x visa and retention adjustment.
 * Rates are ratios (0.55 is 55 percent). Returns every step so the UI can show the chain.
 */
export function forecast(inputs: ForecastInputs): Forecast {
  const { qualifiedApplications, offerRate, enrolmentYield, visaRetentionAdjustment } = inputs;
  if (!Number.isFinite(qualifiedApplications) || qualifiedApplications < 0) {
    throw new RangeError(
      `qualifiedApplications must be a finite number of at least 0, got ${qualifiedApplications}`,
    );
  }
  assertRate(offerRate, 'offerRate');
  assertRate(enrolmentYield, 'enrolmentYield');
  assertRate(visaRetentionAdjustment, 'visaRetentionAdjustment');

  const offers = qualifiedApplications * offerRate;
  const enrolled = offers * enrolmentYield;
  const retained = enrolled * visaRetentionAdjustment;
  return { qualifiedApplications, offers, enrolled, retained };
}
