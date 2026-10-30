import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uiCopy } from '@/design/ui-copy';
import { routes } from '@/domain/config';
import { SignInRoute } from './SignInRoute';

let query = '';
const shown: { nextHref?: string; contextLine?: string }[] = [];

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(query) }));
vi.mock('@/features/accounts', async () => ({
  ...(await vi.importActual<typeof import('@/features/accounts/return-to')>(
    '@/features/accounts/return-to',
  )),
  SignInPage: (props: { nextHref?: string; contextLine?: string }) => {
    shown.push(props);
    return null;
  },
}));

const renderWith = (next: string): void => {
  query = `next=${encodeURIComponent(next)}`;
  render(<SignInRoute />);
};

describe('SignInRoute', () => {
  beforeEach(() => {
    shown.length = 0;
  });

  it('returns to any same-site path, query included, with a line for where they were heading', () => {
    renderWith('/quick-start?phase=read');
    expect(shown[0]).toEqual({
      nextHref: '/quick-start?phase=read',
      contextLine: uiCopy.signInContext.quickStart,
    });
  });

  it('ignores a next that leaves the site', () => {
    renderWith('https://elsewhere.example');
    renderWith('//elsewhere.example');
    expect(shown).toEqual([
      { nextHref: undefined, contextLine: undefined },
      { nextHref: undefined, contextLine: undefined },
    ]);
  });

  it('shows no context line for a path without one', () => {
    renderWith(routes.home);
    expect(shown[0]?.contextLine).toBeUndefined();
  });
});
