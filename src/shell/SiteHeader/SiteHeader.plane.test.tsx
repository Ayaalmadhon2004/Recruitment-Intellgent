import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaperPlaneProvider } from '@/ui';
import { SiteHeader } from './SiteHeader';

const props = {
  homeHref: '/',
  logoSrc: '/logo.png',
  logoAlt: 'Logo alt',
  productName: 'Product name',
  navLabel: 'Main nav',
  navItems: [{ href: '/a', label: 'First' }],
  cta: { href: '/quick-start', label: 'Go now' },
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
};

const noMotion = (): void => {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

describe('SiteHeader call to action and the paper plane', () => {
  it('sends the plane first and opens the page through the app router', async () => {
    noMotion();
    const navigate = vi.fn();
    render(
      <PaperPlaneProvider navigate={navigate}>
        <SiteHeader {...props} />
      </PaperPlaneProvider>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Go now' }));
    expect(navigate).toHaveBeenCalledWith('/quick-start');
  });

  it('stays a plain link when there is no provider', () => {
    render(<SiteHeader {...props} />);
    expect(screen.getByRole('link', { name: 'Go now' })).toHaveAttribute('href', '/quick-start');
  });
});
