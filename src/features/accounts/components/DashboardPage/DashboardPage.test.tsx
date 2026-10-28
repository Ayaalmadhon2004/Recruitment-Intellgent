import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../../app/api/audit-summaries/route';
import { domainConfig, routes } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { known, unknown } from '../../../../../tests/fixtures/builders';
import { signedInRuntime, storedWith } from '../../test-helpers';
import { createMemoryRuntime } from '../../memory-runtime';
import { DashboardPage } from './DashboardPage';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const copy = en.accounts.dashboard;
const everything = domainConfig.questions.map((q) => unknown(q.id));

/** Fetch that calls the real route handler. */
const realFetch = vi.fn(async (_url: string, init: RequestInit): Promise<Response> =>
  POST(new Request('http://localhost/api/audit-summaries', init)),
);

beforeEach(() => {
  push.mockClear();
  realFetch.mockClear();
  vi.stubGlobal('fetch', realFetch);
});
afterEach(() => vi.unstubAllGlobals());

describe('DashboardPage', () => {
  it('asks a signed-out visitor to sign in instead of showing audits', async () => {
    render(<DashboardPage runtime={createMemoryRuntime()} />);
    expect(
      await screen.findByRole('heading', { level: 1, name: copy.signedOut.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.signedOut.cta })).toHaveAttribute(
      'href',
      routes.signIn,
    );
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
  });

  it('shows the empty state "No audits yet" with the question total from config', async () => {
    render(<DashboardPage runtime={await signedInRuntime()} />);
    expect(await screen.findByRole('heading', { name: copy.empty.title })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: copy.empty.ringAria })).toBeInTheDocument();
    expect(
      screen.getByText(fill(copy.empty.ringText, { total: domainConfig.questions.length })),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.empty.quickStart })).toHaveAttribute(
      'href',
      routes.quickStart,
    );
    expect(
      screen.getByText(fill(copy.privateTo, { email: 'tester@university.example' })),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: copy.title })).toBeInTheDocument();
  });

  it('moves the anonymous answers into the account and lists them with a stage from the server', async () => {
    const runtime = await signedInRuntime({ local: storedWith() });
    render(<DashboardPage runtime={runtime} />);
    const card = await screen.findByRole('article', { name: copy.card.untitled });
    expect(
      within(card).getByText(
        fill(copy.card.answered, { answered: 3, total: domainConfig.questions.length }),
      ),
    ).toBeInTheDocument();
    expect(within(card).getByText(copy.card.inProgress)).toBeInTheDocument();
    expect(
      await within(card).findByText(fill(copy.card.stage, { stage: en.stages.building.label })),
    ).toBeInTheDocument();
    expect(await runtime.service.listAudits()).toHaveLength(1);
    // Only answers and the config version went to the server.
    const sent = JSON.parse(String(realFetch.mock.calls[0]?.[1].body)) as { audits: object[] };
    expect(Object.keys(sent.audits[0] ?? {}).sort()).toEqual(['answers', 'configVersion', 'id']);
  });

  it('says the stage is unavailable, not zero, when the server cannot be reached', async () => {
    realFetch.mockRejectedValueOnce(new Error('offline'));
    render(<DashboardPage runtime={await signedInRuntime({ local: storedWith() })} />);
    expect(await screen.findByText(copy.card.stageUnavailable)).toBeInTheDocument();
  });

  it('says Not yet scorable when the stage question is unanswered', async () => {
    render(
      <DashboardPage
        runtime={await signedInRuntime({ local: storedWith([known('A1', 'private-university')]) })}
      />,
    );
    expect(await screen.findByText(copy.card.stageNotScorable)).toBeInTheDocument();
  });

  it('notes an audit saved under an earlier config version', async () => {
    const runtime = await signedInRuntime();
    await runtime.service.saveAudit({ stored: storedWith(undefined, 'vri-config-0.0.1') });
    render(<DashboardPage runtime={runtime} />);
    expect(
      await screen.findByText(fill(copy.card.versionNote, { version: 'vri-config-0.0.1' })),
    ).toBeInTheDocument();
  });

  it('filters by progress and sorts', async () => {
    const runtime = await signedInRuntime();
    await runtime.service.saveAudit({ stored: storedWith(everything) });
    await runtime.service.saveAudit({ stored: storedWith() });
    render(<DashboardPage runtime={runtime} />);
    await screen.findAllByRole('article');
    expect(screen.getAllByRole('article')).toHaveLength(2);

    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(`^${copy.filters.complete}`) }),
    );
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('article')).getByText(copy.card.complete)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(`^${copy.filters.complete}`) }),
    ).toHaveAttribute('aria-pressed', 'true');

    await userEvent.selectOptions(screen.getByLabelText(copy.sortLabel), 'progress');
    expect(screen.getByLabelText(copy.sortLabel)).toHaveValue('progress');
  });

  it('resumes an audit on this device and opens the Intake or the Report', async () => {
    const runtime = await signedInRuntime();
    const saved = await runtime.service.saveAudit({ stored: storedWith([known('B1', 22)]) });
    render(<DashboardPage runtime={runtime} />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: fill(copy.card.updateAria, { name: copy.card.untitled }),
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith(routes.intake));
    expect(runtime.localStore.load()).toEqual(saved.stored);
    expect(runtime.active.get()).toBe(saved.id);
  });

  it('opens the Report for a resumed audit', async () => {
    const runtime = await signedInRuntime();
    const saved = await runtime.service.saveAudit({ stored: storedWith([known('B1', 22)]) });
    render(<DashboardPage runtime={runtime} />);
    await userEvent.click(
      await screen.findByRole('button', {
        name: fill(copy.card.viewAria, { name: copy.card.untitled }),
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith(routes.report));
    expect(runtime.active.get()).toBe(saved.id);
  });

  it('says so when an audit cannot be opened', async () => {
    const runtime = await signedInRuntime();
    await runtime.service.saveAudit({ stored: storedWith() });
    render(<DashboardPage runtime={runtime} />);
    const update = await screen.findByRole('button', {
      name: fill(copy.card.updateAria, { name: copy.card.untitled }),
    });
    vi.spyOn(runtime.service, 'getAudit').mockResolvedValue(null);
    await userEvent.click(update);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.card.openError);
    expect(push).not.toHaveBeenCalled();
  });

  it('starts a new audit from an empty working copy', async () => {
    const runtime = await signedInRuntime();
    await runtime.service.saveAudit({ stored: storedWith() });
    runtime.localStore.save(storedWith());
    render(<DashboardPage runtime={runtime} />);
    await userEvent.click(
      await screen.findByRole('button', { name: new RegExp(copy.newAudit.title) }),
    );
    expect(push).toHaveBeenCalledWith(routes.intake);
    expect(runtime.localStore.load()?.answers).toEqual([]);
  });

  it('signs out, clears the synced working copy and returns to Sign in', async () => {
    const runtime = await signedInRuntime({ local: storedWith() });
    render(<DashboardPage runtime={runtime} />);
    await screen.findByRole('article');
    await userEvent.click(screen.getByRole('button', { name: copy.privacy.signOut }));
    await waitFor(() => expect(push).toHaveBeenCalledWith(routes.signIn));
    expect(await runtime.service.currentUser()).toBeNull();
    expect(runtime.localStore.load()?.answers).toEqual([]);
  });

  it('offers a retry when the audits cannot be loaded', async () => {
    const runtime = await signedInRuntime();
    vi.spyOn(runtime.service, 'listAudits').mockRejectedValueOnce(new Error('down'));
    render(<DashboardPage runtime={runtime} />);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError);
    await userEvent.click(screen.getByRole('button', { name: copy.retry }));
    expect(await screen.findByRole('heading', { name: copy.empty.title })).toBeInTheDocument();
  });
});
