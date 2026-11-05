import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

const base = {
  label: 'No saved audits',
  title: 'Nothing here yet',
  body: 'Start whenever you like.',
  visual: <span>picture</span>,
};

describe('EmptyState', () => {
  it('is a labelled region with a title, body and the way forward', () => {
    render(
      <EmptyState {...base} eyebrow="NOTHING SAVED">
        <button type="button">Start</button>
      </EmptyState>,
    );
    expect(screen.getByRole('region', { name: 'No saved audits' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here yet' })).toBeInTheDocument();
    expect(screen.getByText('NOTHING SAVED')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('is the page h1 when it is the whole page', () => {
    render(
      <EmptyState {...base} headingLevel={1}>
        <button type="button">Start</button>
      </EmptyState>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nothing here yet');
  });
});
