import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { en } from '@/domain/copy';
import { sampleAudits } from '../../fixtures';
import { DashboardView } from './DashboardView';

const copy = en.accounts.dashboard;
const base = {
  email: 'admissions@northbridge.example',
  total: 24,
  onOpen: vi.fn(),
  onStartNew: vi.fn(),
  onSignOut: vi.fn(),
};

describe('DashboardView', () => {
  it('labels fixture audits as sample data, on the page and on each card', () => {
    render(<DashboardView {...base} audits={sampleAudits} />);
    expect(screen.getByText(copy.sample)).toBeInTheDocument();
    expect(screen.getAllByText(copy.card.sample)).toHaveLength(sampleAudits.length);
  });

  it('does not show the sample badge for real audits', () => {
    render(<DashboardView {...base} audits={sampleAudits.map((a) => ({ ...a, sample: false }))} />);
    expect(screen.queryByText(copy.sample)).not.toBeInTheDocument();
  });

  it('says when a filter matches nothing', async () => {
    render(
      <DashboardView {...base} audits={sampleAudits.filter((a) => a.progress === 'in-progress')} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(`^${copy.filters.complete}`) }),
    );
    expect(screen.getByRole('status')).toHaveTextContent(copy.noMatch);
  });

  it('shows stage states without inventing one', () => {
    render(<DashboardView {...base} audits={sampleAudits} />);
    expect(screen.getByText(copy.card.stageNotScorable)).toBeInTheDocument();
    expect(screen.getByText(copy.card.stageChecking)).toBeInTheDocument();
  });

  it('shows a sign-out problem', () => {
    render(<DashboardView {...base} audits={[]} signOutFailed />);
    expect(screen.getByRole('alert')).toHaveTextContent(copy.privacy.signOutFailed);
  });
});
