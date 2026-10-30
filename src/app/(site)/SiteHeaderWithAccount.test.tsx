import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { SiteHeaderWithAccount } from './SiteHeaderWithAccount';

let pathname = '/report';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => pathname,
}));

const header = (): React.ReactNode => (
  <SiteHeaderWithAccount
    homeHref={routes.home}
    logoSrc="/logo.png"
    logoAlt="logo"
    productName="VRI"
    navLabel="Main"
    navItems={[{ href: routes.home, label: 'Home' }]}
    cta={{ href: routes.quickStart, label: en.header.cta }}
    menuOpenLabel="Open"
    menuCloseLabel="Close"
  />
);

describe('SiteHeaderWithAccount', () => {
  it('sends Sign in and the audit call to action through sign-in, back to where they are', async () => {
    window.history.pushState({}, '', '/report?x=1');
    render(header());
    const signIn = await screen.findAllByRole('link', { name: en.header.signIn });
    expect(signIn[0]).toHaveAttribute(
      'href',
      `${routes.signIn}?next=${encodeURIComponent('/report?x=1')}`,
    );
    const cta = screen.getAllByRole('link', { name: en.header.cta });
    expect(cta[0]).toHaveAttribute(
      'href',
      `${routes.signIn}?next=${encodeURIComponent(routes.quickStart)}`,
    );
  });

  it('does not point sign-in back at the sign-in page', async () => {
    pathname = routes.signIn;
    window.history.pushState({}, '', routes.signIn);
    render(header());
    const signIn = await screen.findAllByRole('link', { name: en.header.signIn });
    expect(signIn[0]).toHaveAttribute('href', routes.signIn);
  });
});
