import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import { createMemoryRuntime } from '../../memory-runtime';
import { signedInRuntime } from '../../test-helpers';
import { RequireSession } from './RequireSession';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace }) }));

describe('RequireSession', () => {
  beforeEach(() => replace.mockClear());

  it('sends a signed-out visitor to sign in with the page they asked for, and never renders it', async () => {
    window.history.pushState({}, '', '/report?area=x');
    render(
      <RequireSession runtime={createMemoryRuntime()}>
        <p>protected</p>
      </RequireSession>,
    );
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        `${routes.signIn}?next=${encodeURIComponent('/report?area=x')}`,
      ),
    );
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('renders the page for a signed-in person and does not redirect', async () => {
    render(
      <RequireSession runtime={await signedInRuntime()}>
        <p>protected</p>
      </RequireSession>,
    );
    expect(await screen.findByText('protected')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
