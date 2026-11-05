import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { notScorable } from '@/domain/scoring';
import { notScorableLabels, questionText } from '@/fixtures/labels';
import { NotScorableExplained, NotScorableNote, NotScorableState } from './NotScorableState';

describe('NotScorableState', () => {
  it('says "Not yet scorable" and never shows a number', () => {
    const { container } = render(
      <NotScorableState result={notScorable('no-formula', [])} labels={notScorableLabels} />,
    );
    expect(screen.getByRole('heading', { name: 'Not yet scorable' })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\d/);
  });

  it.each(['no-formula', 'missing-answers', 'invalid-answer'] as const)(
    'explains the %s reason',
    (reason) => {
      render(<NotScorableState result={notScorable(reason, [])} labels={notScorableLabels} />);
      expect(screen.getByText(notScorableLabels.reasons[reason])).toBeInTheDocument();
    },
  );

  it('lists what is missing, in words, and links to each question when asked', () => {
    render(
      <NotScorableState
        result={notScorable('missing-answers', ['E1', 'E2'])}
        labels={notScorableLabels}
        questionLabel={questionText}
        questionHref={(id) => `/intake#${id}`}
      />,
    );
    expect(screen.getByText(notScorableLabels.missingHeading)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Question E1' })).toHaveAttribute('href', '/intake#E1');
    expect(screen.getByRole('link', { name: 'Question E2' })).toHaveAttribute('href', '/intake#E2');
  });

  it('lists missing questions as plain text when there is no link target', () => {
    render(
      <NotScorableState
        result={notScorable('missing-answers', ['E1'])}
        labels={notScorableLabels}
      />,
    );
    expect(screen.getByText('E1')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('omits the list when nothing specific is missing', () => {
    render(<NotScorableState result={notScorable('no-formula', [])} labels={notScorableLabels} />);
    expect(screen.queryByText(notScorableLabels.missingHeading)).not.toBeInTheDocument();
  });

  it('explains the title in plain words right under it', () => {
    render(<NotScorableState result={notScorable('no-formula', [])} labels={notScorableLabels} />);
    expect(screen.getByText(notScorableLabels.explainer)).toBeInTheDocument();
  });
});

describe('NotScorableExplained', () => {
  const missing = notScorable('missing-answers', []);
  const bad = notScorable('invalid-answer', []);
  const labels = notScorableLabels;

  it('says the explanation once and keeps each area to its title', () => {
    render(
      <NotScorableExplained results={[missing, missing, bad]} labels={labels}>
        <NotScorableNote />
        <NotScorableState result={missing} labels={labels} />
        <NotScorableState result={missing} labels={labels} />
        <NotScorableState result={bad} labels={labels} />
      </NotScorableExplained>,
    );
    expect(screen.getAllByText(labels.explainer)).toHaveLength(1);
    expect(screen.getAllByText(labels.reasons['missing-answers'])).toHaveLength(1);
    expect(screen.getAllByRole('heading', { name: labels.title })).toHaveLength(3);
    // An unusable answer is about one area, so that area still says it.
    expect(screen.getAllByText(labels.reasons['invalid-answer'])).toHaveLength(1);
  });

  it('shows no note when everything is scored', () => {
    render(
      <NotScorableExplained results={[{ kind: 'scored' }]} labels={labels}>
        <NotScorableNote />
      </NotScorableExplained>,
    );
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('leaves a state outside a page note fully explained', () => {
    render(<NotScorableState result={missing} labels={labels} />);
    expect(screen.getByText(labels.explainer)).toBeInTheDocument();
  });
});
