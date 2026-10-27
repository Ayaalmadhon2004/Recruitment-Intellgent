import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../../../app/api/first-read/route';
import { en } from '@/domain/copy';
import type { Answer } from '@/domain/types';
import type { FirstReadResponse } from '../../contract';
import { clear, loadAnswers, saveFirstRead } from '../../session';
import { FirstReadPage } from '../FirstReadPage';
import { QuickStartFlow } from './QuickStartFlow';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const copy = en.quickStart;
const FIVE = 5;
const b1Nine: Answer = {
  kind: 'known',
  questionId: 'B1',
  value: 9,
  evidence: 'estimate',
  confidence: 'low',
};
const MAX_TABS = 30;

/** Presses Tab until the focused element satisfies the test. */
async function tabTo(
  user: ReturnType<typeof userEvent.setup>,
  atTarget: () => boolean,
): Promise<void> {
  for (let i = 0; i < MAX_TABS && !atTarget(); i += 1) await user.tab();
  expect(atTarget()).toBe(true);
}
const nextButton = (): HTMLElement => screen.getByRole('button', { name: copy.next });
const submitButton = (): HTMLElement => screen.getByRole('button', { name: copy.submit });

/** Fetch that calls the real route handler. */
const realFetch = vi.fn(async (_url: string, init: RequestInit): Promise<Response> => {
  return POST(new Request('http://localhost/api/first-read', init));
});

const bodies = (): { answers: Answer[] }[] =>
  realFetch.mock.calls.map(([, init]) => JSON.parse(init.body as string) as { answers: Answer[] });

beforeEach(() => {
  push.mockReset();
  realFetch.mockClear();
  vi.stubGlobal('fetch', realFetch);
  clear();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

/** Answers steps 1 to 4 (A1 select, B1 number, C1 radio, D1 toggle). Leaves the last step showing. */
async function answerFirstFour(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.selectOptions(screen.getByRole('combobox'), 'public-university');
  await user.click(nextButton());
  await user.type(screen.getByRole('textbox'), '9');
  await user.click(nextButton());
  await user.click(screen.getByRole('radio', { name: /30-40k/ }));
  await user.click(nextButton());
  await user.click(screen.getByRole('switch'));
  await user.click(nextButton());
}

describe('QuickStartFlow', () => {
  it('keeps Next disabled until the step is answered or marked Not sure', async () => {
    const user = userEvent.setup();
    render(<QuickStartFlow />);
    expect(nextButton()).toBeDisabled();
    await user.selectOptions(screen.getByRole('combobox'), 'public-university');
    expect(nextButton()).toBeEnabled();
    await user.click(nextButton());
    expect(nextButton()).toBeDisabled();
    await user.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    expect(nextButton()).toBeEnabled();
  });

  it('completes five steps (one Not sure), posts domain answers and goes to the First Read page', async () => {
    const user = userEvent.setup();
    render(<QuickStartFlow />);
    await answerFirstFour(user);
    await user.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    await user.click(submitButton());

    await waitFor(() => expect(push).toHaveBeenCalledWith('/first-read'));
    const [body] = bodies();
    expect(realFetch.mock.calls[0]?.[0]).toBe('/api/first-read');
    expect(realFetch.mock.calls[0]?.[1].method).toBe('POST');
    expect(body?.answers).toHaveLength(5);
    expect(body?.answers.find((a) => a.questionId === 'A1')).toEqual({
      kind: 'known',
      questionId: 'A1',
      value: 'public-university',
      evidence: expect.any(String),
      confidence: expect.any(String),
    });
    expect(body?.answers.find((a) => a.questionId === 'B1')).toMatchObject({
      kind: 'known',
      value: 9,
    });
    expect(body?.answers.find((a) => a.questionId === 'D1')).toMatchObject({
      kind: 'known',
      value: true,
    });
    expect(body?.answers.find((a) => a.questionId === 'F1')).toEqual({
      kind: 'unknown',
      questionId: 'F1',
    });
    expect(loadAnswers()).toHaveLength(5);
  });

  it('shows the stage heading from the result on the First Read page', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<QuickStartFlow />);
    await answerFirstFour(user);
    await user.click(screen.getByRole('button', { name: en.questionCard.notSure }));
    await user.click(submitButton());
    await waitFor(() => expect(push).toHaveBeenCalled());
    unmount();

    render(<FirstReadPage />);
    expect(await screen.findByRole('heading', { name: /^You are / })).toBeInTheDocument();
    const title = screen.getByRole('heading', { level: 1, name: en.firstRead.title });
    await waitFor(() => expect(title).toHaveFocus());
  });

  it('can be completed with the keyboard only', async () => {
    const user = userEvent.setup();
    const known: Answer[] = [
      {
        kind: 'known',
        questionId: 'A1',
        value: 'public-university',
        evidence: 'estimate',
        confidence: 'low',
      },
      { kind: 'known', questionId: 'B1', value: 9, evidence: 'estimate', confidence: 'low' },
    ];
    render(<QuickStartFlow initialStep={2} initialAnswers={known} />);

    // C1 radio: arrow keys choose, Tab reaches Next, Enter moves on.
    await tabTo(user, () => document.activeElement?.getAttribute('type') === 'radio');
    await user.keyboard('{ArrowDown}');
    expect(nextButton()).toBeEnabled();
    await tabTo(user, () => document.activeElement === nextButton());
    await user.keyboard('{Enter}');

    // D1 switch: Space turns it on.
    await tabTo(user, () => document.activeElement?.getAttribute('role') === 'switch');
    await user.keyboard(' ');
    await tabTo(user, () => document.activeElement === nextButton());
    await user.keyboard('{Enter}');

    // F1: Not sure by keyboard, then submit.
    await tabTo(user, () => document.activeElement?.textContent === en.questionCard.notSure);
    await user.keyboard('{Enter}');
    await tabTo(user, () => document.activeElement === submitButton());
    await user.keyboard('{Enter}');

    await waitFor(() => expect(push).toHaveBeenCalledWith('/first-read'));
    expect(bodies()[0]?.answers).toHaveLength(FIVE);
  });

  it.each([
    ['a 500', () => Promise.resolve(new Response('{}', { status: 500 })), copy.submitErrorServer],
    ['a 400', () => Promise.resolve(new Response('{}', { status: 400 })), copy.submitErrorInvalid],
    ['a network error', () => Promise.reject(new TypeError('offline')), copy.submitErrorNetwork],
  ])(
    'keeps the answers and shows an alert on %s, then retries',
    async (_name, failure, message) => {
      const user = userEvent.setup();
      render(<QuickStartFlow />);
      await answerFirstFour(user);
      await user.click(screen.getByRole('radio', { name: /Hold steady/ }));
      realFetch.mockImplementationOnce(failure);
      await user.click(submitButton());

      expect(await screen.findByRole('alert')).toHaveTextContent(message);
      expect(push).not.toHaveBeenCalled();
      expect(screen.getByRole('radio', { name: /Hold steady/ })).toBeChecked();
      expect(submitButton()).toBeEnabled();

      await user.click(submitButton());
      await waitFor(() => expect(push).toHaveBeenCalledWith('/first-read'));
      expect(bodies()[1]?.answers).toHaveLength(5);
    },
  );

  it('pre-fills from stored answers when returning to change them', () => {
    const answers: Answer[] = [
      {
        kind: 'known',
        questionId: 'A1',
        value: 'private-university',
        evidence: 'estimate',
        confidence: 'low',
      },
    ];
    saveFirstRead(answers);
    render(<QuickStartFlow />);
    expect(screen.getByRole('combobox')).toHaveValue('private-university');
    expect(nextButton()).toBeEnabled();
  });

  it('shows the submitting state on the last step', () => {
    render(<QuickStartFlow initialStep={4} initialStatus="submitting" />);
    expect(screen.getByRole('button', { name: /See my first read/ })).toBeDisabled();
  });
});

describe('FirstReadPage states', () => {
  it('asks the server again with the stored answers and ignores any stored result', async () => {
    const stale = { configVersion: 'stale' } as FirstReadResponse;
    saveFirstRead([b1Nine], stale);
    render(<FirstReadPage />);
    expect(await screen.findByRole('heading', { name: /^You are / })).toBeInTheDocument();
    expect(realFetch).toHaveBeenCalledTimes(1);
  });

  it('points back to Quick Start when there are no stored answers', async () => {
    render(<FirstReadPage />);
    expect(await screen.findByRole('heading', { name: copy.noAnswersTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.noAnswersLink })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(realFetch).not.toHaveBeenCalled();
  });

  it('shows an alert with retry when the server fails', async () => {
    const user = userEvent.setup();
    saveFirstRead([b1Nine]);
    realFetch.mockImplementationOnce(() => Promise.resolve(new Response('{}', { status: 500 })));
    render(<FirstReadPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: copy.firstReadRetry }));
    expect(await screen.findByRole('heading', { name: /^You are / })).toBeInTheDocument();
  });
});
