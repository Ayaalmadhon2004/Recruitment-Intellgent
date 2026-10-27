export const usd = (amount: number): string => '$' + Math.round(amount).toLocaleString('en-US');

// Matches a `{name}` marker of word characters: accepts "{count}", rejects "{ count }".
// Tester: https://regex101.com/?regex=%5C%7B(%5Cw%2B)%5C%7D&testString=%7Bcount%7D
const MARKER = /\{(\w+)\}/g;

/** Fills `{name}` markers in a copy string. */
export function fill(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(MARKER, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type ParsedAmount = { value: number; invalid: boolean };

/** Empty or unreadable text counts as 0. A negative number counts as 0 and is flagged. */
export function parseAmount(text: string): ParsedAmount {
  const n = Number.parseFloat(text);
  if (!Number.isFinite(n)) return { value: 0, invalid: false };
  if (n < 0) return { value: 0, invalid: true };
  return { value: n, invalid: false };
}

const SLIDER_STEP = 500;
export const sliderStep = SLIDER_STEP;

/** Scholarship slider maximum: tuition rounded up to the next 500, never below 500. */
export const scholarshipMax = (tuition: number): number =>
  Math.max(SLIDER_STEP, Math.ceil(tuition / SLIDER_STEP) * SLIDER_STEP);
