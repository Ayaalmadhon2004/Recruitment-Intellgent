import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { resolveUnlockPaths } from './paths';

describe('resolveUnlockPaths', () => {
  it('shows three labelled placeholders while the paths are unconfirmed', () => {
    const paths = resolveUnlockPaths({ unlockPaths: null });
    expect(paths).toHaveLength(3);
    expect(paths.every((p) => !p.confirmed)).toBe(true);
    expect(paths[0]?.label).toBe(en.unlock.choose.placeholders.one);
    expect(paths.every((p) => p.label.includes('TO BE CONFIRMED WITH CAPSTONE'))).toBe(true);
  });

  it('uses the confirmed paths when Capstone has given them', () => {
    const paths = resolveUnlockPaths({
      unlockPaths: [{ id: 'x', label: 'Option X', note: null }],
    });
    expect(paths).toEqual([{ id: 'x', label: 'Option X', note: null, confirmed: true }]);
  });
});
