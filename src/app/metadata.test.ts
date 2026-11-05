import { describe, expect, it, vi } from 'vitest';
import { en } from '@/domain/copy';
// next/font only exists inside Next's build, so the layout is imported without it.
vi.mock('@/design', () => ({ fontVariables: '' }));

import { metadata } from './layout';
import { metadata as home } from './(site)/page';

describe('page titles', () => {
  it('end every inner page title with the brand, and leave the home title whole', () => {
    expect(metadata.title).toMatchObject({ template: en.brand.titleTemplate });
    expect(en.brand.titleTemplate).toContain('%s');
    expect(home.title).toEqual({ absolute: en.landing.meta.title });
  });
});
