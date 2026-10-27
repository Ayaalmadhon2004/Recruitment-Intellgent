import { describe, expect, it } from 'vitest';
import { en, fill, t } from './en';

describe('copy', () => {
  it('resolves a dotted key to its string', () => {
    expect(t('header.cta')).toBe(en.header.cta);
  });
});

describe('fill', () => {
  it('replaces every placeholder, including repeats', () => {
    expect(fill('{a} of {b} ({a})', { a: 2, b: 'x' })).toBe('2 of x (2)');
  });

  it('leaves unknown placeholders alone', () => {
    expect(fill('hi {name}', {})).toBe('hi {name}');
  });
});
