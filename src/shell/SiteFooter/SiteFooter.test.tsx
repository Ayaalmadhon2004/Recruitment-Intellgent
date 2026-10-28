import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';
import type { SiteFooterProps } from './SiteFooter';

const props: SiteFooterProps = {
  homeHref: '/',
  logoSrc: '/logo.png',
  logoAlt: 'Brand logo',
  productName: 'Product',
  tagline: 'A short tagline',
  navLabel: 'Footer nav',
  columns: [
    { heading: 'Navigation', links: [{ href: '/a', label: 'Page A' }] },
    { heading: 'Tools', links: [{ href: '/b', label: 'Page B' }] },
  ],
  external: { heading: 'Company', link: { href: 'https://example.test', label: 'example.test' } },
  copyright: '© 2026 Example. All rights reserved.',
};

describe('SiteFooter', () => {
  it('renders the logo, product, tagline and copyright', () => {
    render(<SiteFooter {...props} />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('img', { name: 'Brand logo' })).toBeInTheDocument();
    expect(footer).toHaveTextContent('Product');
    expect(footer).toHaveTextContent('A short tagline');
    expect(footer).toHaveTextContent('© 2026 Example. All rights reserved.');
  });

  it('groups internal links under headings in one labelled nav', () => {
    render(<SiteFooter {...props} />);
    const nav = screen.getByRole('navigation', { name: 'Footer nav' });
    expect(within(nav).getByRole('heading', { name: 'Navigation' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Page A' })).toHaveAttribute('href', '/a');
    expect(within(nav).getByRole('link', { name: 'Page B' })).toHaveAttribute('href', '/b');
  });

  it('renders the external link as a real anchor', () => {
    render(<SiteFooter {...props} />);
    expect(screen.getByRole('link', { name: 'example.test' })).toHaveAttribute(
      'href',
      'https://example.test',
    );
  });

  it('renders legal links only when given', () => {
    const { rerender } = render(<SiteFooter {...props} />);
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    rerender(
      <SiteFooter
        {...props}
        legalLabel="Legal"
        legalLinks={[{ href: '/privacy', label: 'Privacy' }]}
      />,
    );
    const legal = screen.getByRole('navigation', { name: 'Legal' });
    expect(within(legal).getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  });
});
