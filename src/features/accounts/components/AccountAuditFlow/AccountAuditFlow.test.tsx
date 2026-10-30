import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { en } from '@/domain/copy';
import { ToastProvider } from '@/ui';
import { createMemoryRuntime } from '../../memory-runtime';
import { signedInRuntime } from '../../test-helpers';
import { AccountAuditFlow } from './AccountAuditFlow';
import type { AccountAuditFlowProps } from './AccountAuditFlow';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace }) }));

const props: Omit<AccountAuditFlowProps, 'runtime'> = {
  phaseHref: (p) => `/quick-start?phase=${p}`,
  onPhaseChange: vi.fn(),
  reportHref: '/report',
};

const flow = (runtime: AccountAuditFlowProps['runtime']): React.ReactNode => (
  <ToastProvider>
    <AccountAuditFlow runtime={runtime} {...props} />
  </ToastProvider>
);

describe('AccountAuditFlow', () => {
  beforeEach(() => replace.mockClear());

  it('sends someone who is not signed in to sign in, back to this page, before any question', async () => {
    window.history.pushState({}, '', '/quick-start?phase=read');
    render(flow(createMemoryRuntime()));
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        `/sign-in?next=${encodeURIComponent('/quick-start?phase=read')}`,
      ),
    );
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('shows the first question when signed in, and saves to the account as well as the device', async () => {
    const runtime = await signedInRuntime();
    render(flow(runtime));
    await userEvent.click(await screen.findByRole('button', { name: en.questionCard.notSure }));
    await waitFor(async () => expect(await runtime.service.listAudits()).toHaveLength(1));
    expect(replace).not.toHaveBeenCalled();
    expect(runtime.localStore.load()?.answers.length).toBeGreaterThan(0);
  });
});
