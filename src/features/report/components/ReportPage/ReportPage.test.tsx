import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../../app/api/report/route';
import { CONFIG_VERSION } from '@/domain/config';
import { en } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import { known, unknown } from '@/fixtures/builders';
import { createLocalStorageStore } from '@/features/intake';
import { ReportPage } from './ReportPage';

const copy = en.reportPage;
const INTAKE_KEY = 'vri.intake.v1';
const QUICK_START_KEY = 'vri.quick-start';

const STUDENTS = 9;
const OTHER_STUDENTS = 3;
const SERVER_ERROR = 500;
const TWICE = 2;
const answers: Answer[] = [known('A1', 'private-university'), known('B1', STUDENTS), unknown('C1')];

function storeIntake(list: Answer[], configVersion: string = CONFIG_VERSION): void {
  createLocalStorageStore().save({
    configVersion,
    answers: list,
    confirmedTagIds: [],
    sectionIndex: 0,
  });
}

/** Fetch that calls the real route handler. */
const realFetch = vi.fn(async (_url: string, init: RequestInit): Promise<Response> =>
  POST(new Request('http://localhost/api/report', init)),
);

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  realFetch.mockReset();
  realFetch.mockImplementation(async (_url: string, init: RequestInit): Promise<Response> =>
    POST(new Request('http://localhost/api/report', init)),
  );
  vi.stubGlobal('fetch', realFetch);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ReportPage', () => {
  it('ready: posts the stored answers and shows the report with six areas that are not yet scorable', async () => {
    storeIntake(answers);
    render(<ReportPage />);
    expect(screen.getByRole('status')).toHaveTextContent(en.skeleton.report);

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: copy.institutionName,
    });
    expect(heading).toBeVisible();

    const call = realFetch.mock.calls[0];
    expect(call?.[0]).toBe('/api/report');
    const body = JSON.parse(call?.[1].body as string) as {
      audit: { answers: Answer[]; entitlement: string; status: string; configVersion: string };
      isSample: boolean;
    };
    expect(body.audit.answers).toEqual(answers);
    expect(body.audit).toMatchObject({
      entitlement: 'free',
      status: 'in-progress',
      configVersion: CONFIG_VERSION,
    });
    expect(body.isSample).toBe(false);

    // One score is shown at a time; each of the three says Not yet scorable, never a number.
    const user = userEvent.setup();
    for (const name of ['Readiness', en.areas['digital-visibility']]) {
      await user.click(screen.getByRole('radio', { name }));
      expect(within(screen.getByRole('radiogroup')).getByRole('radio', { name })).toBeChecked();
      expect(screen.getAllByText(en.status.notScorable).length).toBeGreaterThanOrEqual(1);
    }
    // The kite fills one cell per handled question, read from the same stored answers.
    expect(
      screen.getByRole('img', { name: 'Your audit as a kite: 3 of 24 questions answered' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(en.scoreCard.outOf)).not.toBeInTheDocument();
    expect(screen.queryByText(en.status.sample)).not.toBeInTheDocument();
  });

  it('moves focus to the main heading once the report is ready', async () => {
    storeIntake(answers);
    render(<ReportPage />);
    const heading = await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('links go to the right routes, including the PDF page', async () => {
    storeIntake(answers);
    render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    expect(screen.getByRole('link', { name: en.report.continueAudit })).toHaveAttribute(
      'href',
      '/intake',
    );
    expect(screen.getByRole('link', { name: en.report.downloadPdf })).toHaveAttribute(
      'href',
      '/report/pdf',
    );
    const missing = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href') === '/intake');
    expect(missing.length).toBeGreaterThan(0);
  });

  it('empty: no stored answers shows links to Quick Start and the audit, and does not call the server', async () => {
    render(<ReportPage />);
    const heading = await screen.findByRole('heading', { level: 1, name: copy.emptyTitle });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByRole('link', { name: copy.emptyQuickStart })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(screen.getByRole('link', { name: copy.emptyIntake })).toHaveAttribute('href', '/intake');
    expect(realFetch).not.toHaveBeenCalled();
  });

  it('falls back to the Quick Start answers when the Intake is empty', async () => {
    window.sessionStorage.setItem(
      QUICK_START_KEY,
      JSON.stringify({ answers: [known('B1', STUDENTS)] }),
    );
    render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    const body = JSON.parse(realFetch.mock.calls[0]?.[1].body as string) as {
      audit: { answers: Answer[] };
    };
    expect(body.audit.answers).toEqual([known('B1', STUDENTS)]);
  });

  it('the Intake answers win over the Quick Start answers', async () => {
    storeIntake(answers);
    window.sessionStorage.setItem(
      QUICK_START_KEY,
      JSON.stringify({ answers: [known('B1', OTHER_STUDENTS)] }),
    );
    render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    const body = JSON.parse(realFetch.mock.calls[0]?.[1].body as string) as {
      audit: { answers: Answer[] };
    };
    expect(body.audit.answers).toEqual(answers);
  });

  it('error: shows a retry that asks again, then recovers', async () => {
    storeIntake(answers);
    realFetch.mockResolvedValueOnce(new Response('{}', { status: SERVER_ERROR }));
    const user = userEvent.setup();
    render(<ReportPage />);
    const heading = await screen.findByRole('heading', { level: 1, name: copy.errorTitle });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByRole('alert')).toHaveTextContent(copy.errorBody);

    await user.click(screen.getByRole('button', { name: copy.retry }));
    expect(
      await screen.findByRole('heading', { level: 1, name: copy.institutionName }),
    ).toBeVisible();
    expect(realFetch).toHaveBeenCalledTimes(TWICE);
  });

  it('error: a network failure is an error too', async () => {
    storeIntake(answers);
    realFetch.mockRejectedValueOnce(new Error('offline'));
    render(<ReportPage />);
    expect(await screen.findByRole('heading', { level: 1, name: copy.errorTitle })).toBeVisible();
  });

  it('shows the notice when the answers were saved under another config version', async () => {
    storeIntake(answers, 'vri-config-0.0.1');
    render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent(copy.versionNoticeTitle);
    expect(within(notice).getByRole('link', { name: copy.versionNoticeLink })).toHaveAttribute(
      'href',
      '/intake',
    );
  });

  it('shows no notice when the versions match', async () => {
    storeIntake(answers);
    render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    expect(screen.queryByText(copy.versionNoticeTitle)).not.toBeInTheDocument();
  });

  it('does not keep a result between visits', async () => {
    storeIntake(answers);
    const first = render(<ReportPage />);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    first.unmount();
    expect(window.localStorage.getItem(INTAKE_KEY)).not.toContain('"stage"');
    render(<ReportPage />);
    expect(screen.getByRole('status')).toHaveTextContent(en.skeleton.report);
    await screen.findByRole('heading', { level: 1, name: copy.institutionName });
    expect(realFetch).toHaveBeenCalledTimes(TWICE);
  });
});
