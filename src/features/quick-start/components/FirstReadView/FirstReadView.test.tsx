import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { auditScope } from '@/domain/config';
import { en } from '@/domain/copy';
import type { FirstReadViewProps } from './FirstReadView';
import { FirstReadView } from './FirstReadView';
import { nothingAnsweredResult, realCaseResult, threeScoredResult } from './fixtures';

const base: FirstReadViewProps = {
  result: realCaseResult,
  changeAnswersHref: '/quick-start',
  continueHref: '/audit',
  questionHref: (id) => `/quick-start#${id}`,
};

const view = (props: Partial<FirstReadViewProps> = {}): void => {
  render(<FirstReadView {...base} {...props} />);
};

describe('FirstReadView', () => {
  it('real case: stage plus six areas that cannot be scored yet, no numbers', () => {
    view();
    expect(screen.getAllByText(en.status.notScorable)).toHaveLength(6);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText(en.scoreCard.outOf)).not.toBeInTheDocument();
    expect(screen.getByText(en.firstRead.scoredNone)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'You are building' })).toBeInTheDocument();
    expect(screen.getAllByText(`${auditScope.quickStartQuestions} of ${auditScope.quickStartQuestions} questions answered`).length).toBeGreaterThan(0);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(auditScope.quickStartQuestions));
    for (const name of Object.values(en.areas))
      expect(screen.getByRole('article', { name })).toBeInTheDocument();
  });

  it('stage not scorable: says so in the stage card as well', () => {
    view({ result: nothingAnsweredResult });
    expect(screen.getAllByText(en.status.notScorable)).toHaveLength(7);
    expect(screen.queryByText('Stage: Building')).not.toBeInTheDocument();
    expect(
      screen.getByText(`0 of ${auditScope.quickStartQuestions} questions answered`, { selector: 'span' }),
    ).toBeInTheDocument();
  });

  it('three scored areas: rings, band words and both groups', () => {
    view({ result: threeScoredResult });
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Readiness score 72 out of 100' })).toBeInTheDocument();
    expect(screen.getByText(en.bands.strong)).toBeInTheDocument();
    expect(screen.getByText(en.bands.developing)).toBeInTheDocument();
    expect(screen.getByText(en.bands['needs-attention'])).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.firstRead.scoredTitle })).toBeInTheDocument();
    expect(screen.queryByText(en.firstRead.scoredNone)).not.toBeInTheDocument();
    expect(screen.getAllByText(en.status.notScorable)).toHaveLength(3);
    const locked = screen.getByRole('region', { name: en.firstRead.lockedTitle });
    expect(within(locked).getByRole('article', { name: en.areas['trust-network'] })).toBeVisible();
    expect(within(locked).queryByRole('article', { name: en.areas.readiness })).toBeNull();
  });

  it('shows the sample badge only when asked', () => {
    view({ isSample: true });
    expect(screen.getByText(en.status.sample)).toBeInTheDocument();
  });

  it('shows no sample badge by default', () => {
    view();
    expect(screen.queryByText(en.status.sample)).not.toBeInTheDocument();
  });

  it('links are real anchors', () => {
    view();
    expect(screen.getByRole('link', { name: en.firstRead.ctaChange })).toHaveAttribute(
      'href',
      '/quick-start',
    );
    expect(screen.getByRole('link', { name: en.firstRead.ctaContinue })).toHaveAttribute(
      'href',
      '/audit',
    );
    const missing = screen.getAllByRole('link', { name: en.questions.B2.text });
    expect(missing[0]).toHaveAttribute('href', '/quick-start#B2');
  });

  it('leaves missing questions as plain text without questionHref', () => {
    view({ questionHref: undefined });
    expect(screen.queryByRole('link', { name: en.questions.B2.text })).not.toBeInTheDocument();
    expect(screen.getAllByText(en.questions.B2.text).length).toBeGreaterThan(0);
  });

  it('offers to unlock only when given a place to go', () => {
    view();
    expect(screen.queryByRole('link', { name: en.report.unlock.cta })).not.toBeInTheDocument();
    view({ unlockHref: '/unlock' });
    expect(screen.getByRole('link', { name: en.report.unlock.cta })).toHaveAttribute(
      'href',
      '/unlock',
    );
  });
});
