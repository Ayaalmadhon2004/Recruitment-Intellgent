import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.2.2 (Pause, Stop, Hide): movement that starts by itself and lasts over 5 seconds needs a way to
 * stop it. Decorative loops are therefore not allowed. The only endless animations are loading
 * indicators, which are essential status (they end when the work ends) and are removed under
 * prefers-reduced-motion by the global rule in motion.css.
 */
const LOADING_INDICATORS = [
  'ui/Button/Button.module.css',
  'ui/Skeleton/Skeleton.module.css',
  'ui/KiteBob/KiteBob.module.css',
  'design/motion.css',
];

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return path.endsWith('.css') ? [path] : [];
  });
}

describe('endless animations', () => {
  const root = join(__dirname, '..');
  const withInfinite = cssFiles(root)
    .filter((file) => readFileSync(file, 'utf8').includes(' infinite'))
    .map((file) => file.slice(root.length + 1));

  it('are only loading indicators', () => {
    expect(withInfinite.filter((file) => !LOADING_INDICATORS.includes(file))).toEqual([]);
  });

  it('keep the breathing glow to one short breath', () => {
    const css = readFileSync(join(root, 'ui/Breathe/Breathe.module.css'), 'utf8');
    expect(css.includes('infinite;')).toBe(false);
  });

  it('turn every animation off under prefers-reduced-motion', () => {
    const css = readFileSync(join(root, 'design/motion.css'), 'utf8');
    const rule = css.slice(css.indexOf('prefers-reduced-motion: reduce'));
    expect(rule.includes('animation: none !important')).toBe(true);
  });
});
