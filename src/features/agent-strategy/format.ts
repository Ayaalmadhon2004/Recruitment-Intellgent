import type { ForecastInputs } from '@/domain/types';
import type { ForecastFormValues } from './types';

const PERCENT_MAX = 100;
const ROUND_STEP = 10;

/**
 * Matches a {name} hole in a copy string.
 * Matches "{count}" and captures "count"; does not match "{ count }" or "{}".
 * Tester: https://regex101.com/?regex=%5C%7B(%5Cw%2B)%5C%7D&testString=%7Bcount%7D
 */
const HOLE = /\{(\w+)\}/g;

/** Fills {name} holes in a copy string. Unknown holes are left visible. */
export function fill(template: string, vars: Readonly<Record<string, string | number>>): string {
  return template.replace(HOLE, (hole, key: string) => (key in vars ? String(vars[key]) : hole));
}

/** One decimal place, thousands separated. */
export function fmt1(n: number): string {
  return (Math.round(n * ROUND_STEP) / ROUND_STEP).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** Text to a non-negative finite number. Anything else counts as 0. */
export function toCount(text: string): number {
  const n = parseFloat(text);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Text to a percent from 0 to 100. */
export function toPercent(text: string): number {
  return Math.min(PERCENT_MAX, toCount(text));
}

export type ParsedForecast = {
  readonly inputs: ForecastInputs;
  /** The percents as used after clamping, for the formula line. */
  readonly percents: {
    readonly offerRate: number;
    readonly enrolmentYield: number;
    readonly visaRetention: number;
  };
};

/** Converts typed percents to the ratios that `forecast()` expects. */
export function parseForecast(values: ForecastFormValues): ParsedForecast {
  const offerRate = toPercent(values.offerRate);
  const enrolmentYield = toPercent(values.enrolmentYield);
  const visaRetention = toPercent(values.visaRetention);
  return {
    inputs: {
      qualifiedApplications: toCount(values.applications),
      offerRate: offerRate / PERCENT_MAX,
      enrolmentYield: enrolmentYield / PERCENT_MAX,
      visaRetentionAdjustment: visaRetention / PERCENT_MAX,
    },
    percents: { offerRate, enrolmentYield, visaRetention },
  };
}
