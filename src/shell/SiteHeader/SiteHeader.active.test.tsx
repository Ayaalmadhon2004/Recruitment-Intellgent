import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from './SiteHeader';

vi.mock('next/navigation', () => ({ usePathname: () => '/quick-start' }));

const props = {
  homeHref: '/',
  logoSrc: '/logo.png',
  logoAlt: 'Logo alt',
  productName: 'Product',
  navLabel: 'Main nav',
  navItems: [
    { href: '/', label: 'Home' },
    { href: '/quick-start', label: 'Quick start' },
  ],
  cta: { href: '/go', label: 'Go' },
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
};

describe('SiteHeader active item', () => {
  it('marks only the current page with aria-current', () => {
    render(<SiteHeader {...props} />);
    expect(screen.getByRole('link', { name: 'Quick start' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
