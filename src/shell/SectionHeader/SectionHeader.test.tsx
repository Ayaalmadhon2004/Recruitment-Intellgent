import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the eyebrow and an h2 by default', () => {
    render(<SectionHeader eyebrow="EYEBROW" title="Title" />);
    expect(screen.getByText('EYEBROW')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
  });

  it('uses the requested heading level', () => {
    render(<SectionHeader eyebrow="E" title="Page title" level="h1" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page title' })).toBeInTheDocument();
  });
});
