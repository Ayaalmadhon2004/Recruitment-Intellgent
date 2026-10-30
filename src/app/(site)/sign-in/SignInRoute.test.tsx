import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { SignInRoute } from './SignInRoute';

let query = '';
const nextHrefs: (string | undefined)[] = [];

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(query) }));
vi.mock('@/features/accounts', () => ({
  SignInPage: ({ nextHref }: { nextHref?: string }) => {
    nextHrefs.push(nextHref);
    return null;
  },
}));

describe('SignInRoute', () => {
  it('returns to a listed page and ignores anything else', () => {
    query = `next=${encodeURIComponent(routes.quickStart)}`;
    render(<SignInRoute />);
    query = `next=${encodeURIComponent('https://elsewhere.example')}`;
    render(<SignInRoute />);
    expect(nextHrefs).toEqual([routes.quickStart, undefined]);
  });
});
