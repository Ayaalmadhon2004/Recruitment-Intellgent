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

  it('uses the standard primary and secondary buttons in the light tones', () => {
    render(
      <CtaBand
        tone="inline"
        title="Need a break?"
        actions={[
          { label: 'Save and exit', href: '/exit', variant: 'inverse' },
          { label: 'See report', href: '/report', variant: 'inverse-outline' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Save and exit' }).className).toMatch(/primary/);
    expect(screen.getByRole('link', { name: 'See report' }).className).toMatch(/secondary/);
  });
});
