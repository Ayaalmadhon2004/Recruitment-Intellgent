import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** WCAG 2.2 AA: normal text needs 4.5:1. Every text token is checked on the surfaces it is placed on. */
const MIN_TEXT = 4.5;
const HEX_DIGITS = 6;
const HEX_BASE = 16;
const CHANNEL_MAX = 255;
const CHANNEL_WIDTH = 2;
const RED_AT = 1;
const GREEN_AT = RED_AT + CHANNEL_WIDTH;
const BLUE_AT = GREEN_AT + CHANNEL_WIDTH;
/** Constants of the WCAG relative luminance formula. */
const SRGB_KNEE = 0.03928;
const SRGB_LINEAR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_GAMMA = 2.4;
const WEIGHT_RED = 0.2126;
const WEIGHT_GREEN = 0.7152;
const WEIGHT_BLUE = 0.0722;
const GLARE = 0.05;

const toToken = (line: string): readonly [string, string] | null => {
  const [name, rest] = line.trim().split(':');
  const value = rest?.trim().slice(0, 1 + HEX_DIGITS) ?? '';
  const isColour = name?.startsWith('--color-') && value.startsWith('#');
  return isColour && name ? [name.slice(CHANNEL_WIDTH), value] : null;
};

const tokens = new Map<string, string>(
  readFileSync(join(__dirname, 'tokens.css'), 'utf8')
    .split('\n')
    .map(toToken)
    .filter((entry): entry is readonly [string, string] => entry !== null),
);

const channel = (hex: string, at: number): number => {
  const v = parseInt(hex.slice(at, at + CHANNEL_WIDTH), HEX_BASE) / CHANNEL_MAX;
  return v <= SRGB_KNEE ? v / SRGB_LINEAR : ((v + SRGB_OFFSET) / SRGB_SCALE) ** SRGB_GAMMA;
};

const luminance = (hex: string): number =>
  WEIGHT_RED * channel(hex, RED_AT) +
  WEIGHT_GREEN * channel(hex, GREEN_AT) +
  WEIGHT_BLUE * channel(hex, BLUE_AT);

const ratio = (foreground: string, background: string): number => {
  const [light = 0, dark = 0] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (light + GLARE) / (dark + GLARE);
};

const LIGHT_SURFACES = [
  'color-page',
  'color-page-alt',
  'color-page-warm',
  'color-pastel-blue',
  'color-pastel-red',
  'color-card',
  'color-navy-tint',
  'color-line-soft',
  'color-neutral-tint',
];
const COMMON_SURFACES = ['color-page', 'color-page-alt', 'color-page-warm', 'color-card'];

const PAIRS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['color-text', LIGHT_SURFACES],
  ['color-text-secondary', LIGHT_SURFACES],
  ['color-navy', LIGHT_SURFACES],
  ['color-navy-deep', LIGHT_SURFACES],
  ['color-crimson', LIGHT_SURFACES],
  ['color-crimson-dark', LIGHT_SURFACES],
  ['color-status-strong', [...LIGHT_SURFACES, 'color-strong-tint']],
  ['color-status-caution', [...COMMON_SURFACES, 'color-caution-tint']],
  ['color-status-concern', [...COMMON_SURFACES, 'color-concern-tint']],
  ['color-status-info', [...COMMON_SURFACES, 'color-info-tint']],
  ['color-text-inverse', ['color-navy', 'color-navy-deep', 'color-crimson', 'color-crimson-dark']],
];

describe('text colour contrast', () => {
  it('reads the colour tokens', () => {
    expect(tokens.get('color-text')).toBe('#333333');
  });

  PAIRS.forEach(([foreground, backgrounds]) =>
    backgrounds.forEach((background) =>
      it(`${foreground} on ${background} is at least ${MIN_TEXT}:1`, () => {
        const fg = tokens.get(foreground);
        const bg = tokens.get(background);
        expect(fg, foreground).toBeDefined();
        expect(bg, background).toBeDefined();
        expect(ratio(fg ?? '', bg ?? '')).toBeGreaterThanOrEqual(MIN_TEXT);
      }),
    ),
  );
});
