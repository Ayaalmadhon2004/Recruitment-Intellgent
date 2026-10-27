import { describe, expect, it } from 'vitest';
import { en, t } from './en';

describe('copy', () => {
  it('resolves a dotted key to its string', () => {
    expect(t('header.cta')).toBe(en.header.cta);
  });
});
