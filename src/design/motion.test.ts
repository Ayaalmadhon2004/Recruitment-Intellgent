import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { distance, duration, easing, loop, stagger } from './motion';

const css = readFileSync(join(process.cwd(), 'src/design/tokens.css'), 'utf8');
const token = (name: string): string => {
  const m = new RegExp(`${name}:\\s*([^;]+);`).exec(css);
  if (!m) throw new Error(`missing ${name}`);
  return (m[1] ?? '').replace(/\s*\/\*.*\*\//, '').trim();
};

describe('motion tokens', () => {
  it('match the CSS variables', () => {
    expect(token('--dur-micro')).toBe(`${duration.micro}ms`);
    expect(token('--dur-base')).toBe(`${duration.base}ms`);
    expect(token('--dur-large')).toBe(`${duration.large}ms`);
    expect(token('--dur-hero')).toBe(`${duration.hero}ms`);
    expect(token('--dur-bob')).toBe(`${loop.bob}ms`);
    expect(token('--dur-breathe')).toBe(`${loop.breathe}ms`);
    expect(token('--ease-lift')).toBe(easing.lift);
    expect(token('--ease-settle')).toBe(easing.settle);
    expect(token('--stagger')).toBe(`${stagger.step}ms`);
    expect(token('--stagger-cap')).toBe(String(stagger.max));
    expect(token('--enter-distance')).toBe(`${distance.rise}px`);
    expect(token('--text-slide')).toBe(`${distance.text}px`);
  });

  it('keep entrances within the allowed rise', () => {
    expect(distance.rise).toBeLessThanOrEqual(12);
    expect(duration.hero).toBeLessThanOrEqual(2000);
  });
});
