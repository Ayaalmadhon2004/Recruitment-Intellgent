import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../../app/api/report/route';
import { CONFIG_VERSION } from '@/domain/config';
import { en } from '@/domain/copy';
import { scoreAreaIds } from '@/domain/types';
import { known } from '@/fixtures/builders';
import { createLocalStorageStore } from '@/features/intake';
import { ScoreDetailPage } from './ScoreDetailPage';

const notFound = vi.fn((): never => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({ notFound: () => notFound() }));

const copy = en.reportPage;
const STUDENTS = 9;
const SERVER_ERROR = 500;

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  notFound.mockClear();
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit): Promise<Response> =>
      POST(new Request('http://localhost/api/report', init)),
    ),
  );
  createLocalStorageStore().save({
    configVersion: CONFIG_VERSION,
    answers: [known('A1', 'private-university'), known('B1', STUDENTS)],
    confirmedTagIds: [],
    sectionIndex: 0,
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ScoreDetailPage', () => {
  it('shows a busy skeleton until the report is ready', async () => {
    render(<ScoreDetailPage area="readiness" />);
    expect(screen.getByRole('status')).toHaveTextContent(en.skeleton.scoreDetail);
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(scoreAreaIds)('%s: renders the score detail for that area', async (id) => {
    render(<ScoreDetailPage area={id} />);
    const heading = await screen.findByRole('heading', { level: 1, name: en.areas[id] });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getAllByText(en.status.notScorable).length).toBeGreaterThan(0);
    expect(screen.queryByText(en.scoreCard.outOf)).not.toBeInTheDocument();
  });

  it('links back to the report and to the Intake', async () => {
    render(<ScoreDetailPage area="readiness" />);
    await screen.findByRole('heading', { level: 1, name: en.areas.readiness });
    expect(screen.getByRole('link', { name: en.scoreDetail.back })).toHaveAttribute(
      'href',
      '/report',
    );
  });

  it('an unknown area is a 404 and the server is never asked', () => {
    expect(() => render(<ScoreDetailPage area="not-an-area" />)).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('empty: no stored answers', async () => {
    window.localStorage.clear();
    render(<ScoreDetailPage area="readiness" />);
    expect(await screen.findByRole('heading', { level: 1, name: copy.emptyTitle })).toBeVisible();
  });

  it('error: offers a retry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: SERVER_ERROR })),
    );
    render(<ScoreDetailPage area="readiness" />);
    expect(await screen.findByRole('button', { name: copy.retry })).toBeVisible();
  });
});
