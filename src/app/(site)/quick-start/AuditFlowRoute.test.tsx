import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from '@/domain/config';
import type { Entitlement } from '@/domain/types';
import { AuditFlowRoute } from './AuditFlowRoute';

let entitlement: Entitlement | undefined;
let query = '';
const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(query),
}));
vi.mock('@/features/unlock', () => ({ useDeviceEntitlement: () => entitlement }));
vi.mock('@/features/accounts', () => ({
  AccountAuditFlow: (p: {
    phase?: string;
    unlockHref?: string;
    phaseHref: (phase: 'read') => string;
    onPhaseChange: (phase: 'read') => void;
  }) => (
    <div>
      <p data-testid="phase">{p.phase ?? 'none'}</p>
      <p data-testid="unlock">{p.unlockHref ?? 'none'}</p>
      <p data-testid="href">{p.phaseHref('read')}</p>
      <button type="button" onClick={() => p.onPhaseChange('read')}>
        go
      </button>
    </div>
  ),
}));

describe('AuditFlowRoute', () => {
  beforeEach(() => {
    entitlement = undefined;
    query = '';
    push.mockClear();
  });

  it('passes a known phase from the address and ignores an unknown one', () => {
    query = 'phase=sections';
    const { unmount } = render(<AuditFlowRoute />);
    expect(screen.getByTestId('phase')).toHaveTextContent('sections');
    unmount();
    query = 'phase=nonsense';
    render(<AuditFlowRoute />);
    expect(screen.getByTestId('phase')).toHaveTextContent('none');
  });

  it('keeps every phase on the one audit route', () => {
    render(<AuditFlowRoute />);
    expect(screen.getByTestId('href')).toHaveTextContent(`${routes.quickStart}?phase=read`);
    screen.getByRole('button', { name: 'go' }).click();
    expect(push).toHaveBeenCalledWith(`${routes.quickStart}?phase=read`);
  });

  it('offers the unlock link only while the audit is free', () => {
    entitlement = 'free';
    const { unmount } = render(<AuditFlowRoute />);
    expect(screen.getByTestId('unlock')).toHaveTextContent(routes.unlock);
    unmount();
    entitlement = 'unlocked';
    render(<AuditFlowRoute />);
    expect(screen.getByTestId('unlock')).toHaveTextContent('none');
  });
});
