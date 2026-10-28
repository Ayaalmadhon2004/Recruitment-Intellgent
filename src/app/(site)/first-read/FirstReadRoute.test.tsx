import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import type { Entitlement } from '@/domain/types';
import { FirstReadRoute } from './FirstReadRoute';

let entitlement: Entitlement | undefined;

vi.mock('@/features/unlock', () => ({ useDeviceEntitlement: () => entitlement }));
vi.mock('@/features/quick-start', () => ({
  FirstReadPage: ({ unlockHref }: { unlockHref?: string }) => (
    <p data-testid="first-read">{unlockHref ?? 'no-unlock-action'}</p>
  ),
}));

describe('FirstReadRoute', () => {
  beforeEach(() => {
    entitlement = undefined;
  });

  it('offers the unlock action when the audit is free', () => {
    entitlement = 'free';
    render(<FirstReadRoute />);
    expect(screen.getByTestId('first-read')).toHaveTextContent(routes.unlock);
  });

  it('offers no unlock action once the audit is unlocked', () => {
    entitlement = 'unlocked';
    render(<FirstReadRoute />);
    expect(screen.getByTestId('first-read')).toHaveTextContent('no-unlock-action');
  });

  it('offers no unlock action while the entitlement is not read yet', () => {
    render(<FirstReadRoute />);
    expect(screen.getByTestId('first-read')).toHaveTextContent('no-unlock-action');
  });
});
