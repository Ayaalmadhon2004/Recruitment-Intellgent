/**
 * Motion tokens: wind and kite. Everything lifts, settles or glides.
 * The same values are CSS variables in tokens.css (--dur-*, --ease-*, --stagger, --enter-distance);
 * motion.test.ts keeps the two in step. Components use these names, never raw numbers.
 */
export const duration = {
  micro: 150,
  base: 280,
  large: 600,
  /** Longest allowed: the Home intro. */
  hero: 2000,
} as const;

/** Continuous loops. Each runs only while on screen with the tab visible, and never under reduced motion. */
/** Kite lift-off when a call to action starts the audit. */
export const flight = 500;

/** How long the autosave dot stays lit after a save. */
export const saveFlash = 1500;

export const loop = {
  bob: 1600,
  breathe: 3000,
} as const;

export const easing = {
  /** Entrances. */
  lift: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
  /** A gentle spring with one light overshoot. The kite only. */
  settle: 'cubic-bezier(0.3, 1.25, 0.5, 1)',
  /** Dashed-line drawing only. */
  linear: 'linear',
} as const;

export const stagger = {
  /** Milliseconds between items. */
  step: 60,
  /** Items past this index appear together with it. */
  max: 6,
  maxMobile: 3,
} as const;

export const distance = {
  /** Entrance rise in px. */
  rise: 12,
  riseMobile: 8,
  /** Text cross-fade slide in px. */
  text: 6,
  /** Tilt limit for the scroll kite, degrees. */
  tilt: 8,
} as const;

/** The Home intro, in ms from the start. It is the one hero motion on that screen and ends by hero (2.5s max). */
export const intro = {
  /** The kite spins in until here. */
  spinEnd: 1000,
  /** Wings unfold: left at spinEnd, both by openAt. */
  openAt: 1300,
  /** The headline block is written line by line from here. */
  linesAt: 1300,
  lineGap: 200,
  doneAt: 2500,
} as const;

/** The Report diamond fills section by section, this many ms apart (centre outward). */
export const diamondWaveStep = 80;

/** Count-up lengths in ms, by purpose. */
export const countDuration = {
  score: 500,
  reveal: 800,
  forecast: 300,
} as const;

export const MOBILE_MAX_WIDTH = 480;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Ease-out used by JS count-ups (matches the lift curve's feel). */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** The paper plane that carries a button press to the next page. */
export const plane = {
  /** Whole flight, from the button to off screen. */
  flight: 900,
  /** The next page opens this many ms into the flight, so it arrives under the plane. */
  navigateAt: 380,
  /** Plane width in px at its biggest, on a desktop and below 480px. */
  size: 100,
  sizeMobile: 84,
} as const;

/** Wind streaks that follow the plane: each trails the same path, later and off to one side. */
export const windStreaks = [
  { delay: 40, offset: -4, length: 160, thickness: 5, opacity: 0.85 },
  { delay: 100, offset: 18, length: 120, thickness: 4, opacity: 0.7 },
  { delay: 160, offset: -22, length: 140, thickness: 4, opacity: 0.6 },
  { delay: 220, offset: 32, length: 100, thickness: 3, opacity: 0.5 },
  { delay: 280, offset: -36, length: 110, thickness: 3, opacity: 0.4 },
] as const;
