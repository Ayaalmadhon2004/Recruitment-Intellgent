import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

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
});
