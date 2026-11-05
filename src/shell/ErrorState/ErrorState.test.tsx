import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('shows one h1, the message and the actions', () => {
    render(
      <ErrorState eyebrow="Eyebrow" title="Title" body="Body text">
        <button type="button">Retry</button>
      </ErrorState>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Eyebrow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('can be the page landmark when no layout provides one', () => {
    render(
      <ErrorState as="main" eyebrow="e" title="t" body="b">
        <button type="button">Retry</button>
      </ErrorState>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
