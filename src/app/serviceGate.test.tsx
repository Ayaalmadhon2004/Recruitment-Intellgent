import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { devServicesEnabledFor, routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ServiceGate } from './(site)/ServiceGate';

describe('development services switch', () => {
  it('is on in development and tests, off in production unless the build opts in', () => {
    expect(devServicesEnabledFor('development', undefined)).toBe(true);
    expect(devServicesEnabledFor('test', undefined)).toBe(true);
    expect(devServicesEnabledFor('production', undefined)).toBe(false);
    expect(devServicesEnabledFor('production', 'false')).toBe(false);
    expect(devServicesEnabledFor('production', 'true')).toBe(true);
  });
});

describe('ServiceGate', () => {
  it('shows the page while the development services are on', () => {
    render(
      <ServiceGate enabled>
        <p>the page</p>
      </ServiceGate>,
    );
    expect(screen.getByText('the page')).toBeInTheDocument();
  });

  it('shows "not open yet" with a way out, and not the page, when they are off', () => {
    render(
      <ServiceGate enabled={false}>
        <p>the page</p>
      </ServiceGate>,
    );
    expect(screen.queryByText('the page')).toBeNull();
    expect(
      screen.getByRole('heading', { level: 1, name: en.errorPages.serviceNotReady.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: en.errorPages.serviceNotReady.home })).toHaveAttribute(
      'href',
      routes.home,
    );
    expect(
      screen.getByRole('link', { name: en.errorPages.serviceNotReady.advisor }),
    ).toHaveAttribute('href', routes.advisor);
  });
});
