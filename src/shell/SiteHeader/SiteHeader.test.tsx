import { render, screen } from '@testing-library/react';
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
});
