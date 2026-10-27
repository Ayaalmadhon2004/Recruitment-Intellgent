import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the brand line and a real link', () => {
    render(
      <SiteFooter
        brandLine="Brand line"
        link={{ href: 'https://example.test', label: 'example.test' }}
      />,
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Brand line');
    expect(screen.getByRole('link', { name: 'example.test' })).toHaveAttribute(
      'href',
      'https://example.test',
    );
  });
});
