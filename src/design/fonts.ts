import { Be_Vietnam_Pro, Fraunces, Poppins } from 'next/font/google';

/** UI and body text. Poppins ships no Vietnamese subset, so Be Vietnam Pro draws those glyphs (see --font-sans). */
export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

/** Vietnamese fallback for Poppins: a similar geometric sans that covers U+1EA0 to U+1EF9. */
export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

/** Titles and headings. Fraunces has a Vietnamese subset. */
export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-fraunces',
});

/** Class names that define the three font variables; put on <html>. */
export const fontVariables = `${poppins.variable} ${beVietnamPro.variable} ${fraunces.variable}`;
