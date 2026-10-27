import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CtaBand } from './CtaBand';

describe('CtaBand', () => {
  it('renders the heading, the body and real links for the actions', () => {
    render(
      <CtaBand
        title="Finish the audit to see every score."
        body="35 more questions."
        actions={[
          { label: 'Complete the full audit', href: '/intake' },
          { label: 'Sign in to save', href: '/sign-in', variant: 'inverse-outline' },
        ]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Finish the audit to see every score.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Complete the full audit' })).toHaveAttribute(
      'href',
      '/intake',
    );
    expect(screen.getByRole('link', { name: 'Sign in to save' })).toHaveAttribute(
      'href',
      '/sign-in',
    );
  });
});
