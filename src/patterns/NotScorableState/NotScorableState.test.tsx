import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { notScorable } from '@/domain/scoring';
import { notScorableLabels, questionText } from '@/fixtures/labels';
import { NotScorableState } from './NotScorableState';

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
