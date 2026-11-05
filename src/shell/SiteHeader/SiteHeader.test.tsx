import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader, initialsOf } from './SiteHeader';
import type { HeaderAccount } from './SiteHeader';

const props = {
  homeHref: '/',
  logoSrc: '/logo.png',
  logoAlt: 'Logo alt',
  productName: 'Product name',
  navLabel: 'Main nav',
  navItems: [
    { href: '#a', label: 'First' },
    { href: '#b', label: 'Second' },
  ],
  cta: { href: '#go', label: 'Go now' },
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
};

describe('SiteHeader', () => {
  it('renders the logo, product name, nav items and CTA from props', () => {
    render(<SiteHeader {...props} />);
    expect(screen.getByRole('img', { name: 'Logo alt' })).toBeInTheDocument();
    expect(screen.getByText('Product name')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main nav' });
    expect(nav).toContainElement(screen.getByRole('link', { name: 'First' }));
    expect(screen.getByRole('link', { name: 'Second' })).toHaveAttribute('href', '#b');
    expect(screen.getByRole('link', { name: 'Logo alt' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Go now' })).toHaveAttribute('href', '#go');
  });

  it('toggles the menu with the burger button and exposes its state', () => {
    render(<SiteHeader {...props} />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    const nav = screen.getByRole('navigation', { name: 'Main nav' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);
    expect(nav).toHaveAttribute('data-open', 'false');

    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(nav).toHaveAttribute('data-open', 'true');
  });

  it('closes the menu on Escape and when a link is chosen', () => {
    render(<SiteHeader {...props} />);
    const nav = screen.getByRole('navigation', { name: 'Main nav' });

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(nav).toHaveAttribute('data-open', 'false');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('link', { name: 'First' }));
    expect(nav).toHaveAttribute('data-open', 'false');
  });

  describe('navGroup', () => {
    const navGroup = { label: 'Tools', items: [{ href: '#t', label: 'Tool one' }] };

    it('renders no dropdown without the navGroup prop', () => {
      render(<SiteHeader {...props} />);
      expect(screen.queryByRole('button', { name: 'Tools' })).not.toBeInTheDocument();
    });

    it('toggles the dropdown, closes on Escape and when a link is chosen', () => {
      render(<SiteHeader {...props} navGroup={navGroup} />);
      const toggle = screen.getByRole('button', { name: 'Tools' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('link', { name: 'Tool one' })).toHaveAttribute('href', '#t');

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveFocus();

      fireEvent.click(toggle);
      fireEvent.click(screen.getByRole('link', { name: 'Tool one' }));
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('account', () => {
    const account = (user: HeaderAccount['user'], onSignOut = vi.fn()): HeaderAccount => ({
      signIn: { href: '/sign-in', label: 'Sign in' },
      user,
      menuLabel: 'Account menu',
      signedInAsLabel: 'Signed in as',
      myAudits: { href: '/dashboard', label: 'My audits' },
      signOutLabel: 'Sign out',
      onSignOut,
    });

    it('renders no auth controls without the account prop', () => {
      render(<SiteHeader {...props} />);
      expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Account menu/ })).not.toBeInTheDocument();
    });

    it('renders no auth controls while loading but keeps the reserved account box', () => {
      const { container } = render(
        <SiteHeader {...props} account={{ ...account(null), loading: true }} />,
      );
      expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Account menu/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
      const area = container.querySelector('[data-state]');
      expect(area).toHaveAttribute('data-state', 'loading');
      // The hidden sizer is not exposed to assistive tech.
      expect(area?.firstElementChild).toHaveAttribute('aria-hidden', 'true');
      expect(area?.firstElementChild).toHaveTextContent('Sign in');
    });

    it('uses the same account box in the loading, signed-out and signed-in states', () => {
      const states = [
        { ...account(null), loading: true },
        account(null),
        account({ email: 'jane.doe@uni.edu' }),
      ];
      const sizers = states.map((state) => {
        const { container, unmount } = render(<SiteHeader {...props} account={state} />);
        const area = container.querySelector('[data-state]')!;
        const first = area.firstElementChild!;
        const snapshot = { tag: first.tagName, cls: first.className, text: first.textContent };
        unmount();
        return snapshot;
      });
      expect(sizers[1]).toEqual(sizers[0]);
      expect(sizers[2]).toEqual(sizers[0]);
    });

    it('links to sign in when signed out', () => {
      render(<SiteHeader {...props} account={account(null)} />);
      for (const link of screen.getAllByRole('link', { name: 'Sign in' })) {
        expect(link).toHaveAttribute('href', '/sign-in');
      }
      expect(screen.queryByRole('button', { name: /Account menu/ })).not.toBeInTheDocument();
    });

    it('shows initials and an account menu that signs out when signed in', () => {
      const onSignOut = vi.fn();
      render(<SiteHeader {...props} account={account({ email: 'jane.doe@uni.edu' }, onSignOut)} />);
      expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
      const toggle = screen.getByRole('button', { name: 'Account menu: jane.doe@uni.edu' });
      expect(toggle).toHaveTextContent('JD');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByRole('link', { name: 'My audits' }).at(-1)).toHaveAttribute(
        'href',
        '/dashboard',
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveFocus();

      fireEvent.click(screen.getAllByRole('button', { name: 'Sign out' })[0]!);
      expect(onSignOut).toHaveBeenCalledTimes(1);
    });
  });

  it('builds initials from the email', () => {
    expect(initialsOf('jane.doe@x.edu')).toBe('JD');
    expect(initialsOf('aya@x.edu')).toBe('AY');
  });
});
