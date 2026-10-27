import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { notScorable, scored } from '@/domain/scoring';
import { questionText, scoreCardLabels } from '@/fixtures/labels';
import { ScoreCard } from './ScoreCard';

describe('ScoreCard with a Scored result', () => {
  it('shows the number, the band word, the evidence tag and the confidence', () => {
    render(
      <ScoreCard
        name="Readiness"
        result={scored(68, 'developing', 'medium')}
        labels={scoreCardLabels}
        reason="Good start."
        evidence="institution-reported"
      />,
    );
    expect(screen.getByRole('img', { name: 'Readiness score 68 out of 100' })).toBeInTheDocument();
    expect(screen.getByText('68')).toBeVisible();
    expect(screen.getByText('Developing')).toBeVisible();
    expect(screen.getByText('Good start.')).toBeVisible();
    expect(screen.getByText('Institution-reported')).toBeVisible();
    expect(screen.getByText('Confidence: Medium')).toBeVisible();
  });

  it.each([
    [80, 'strong', 'Strong'],
    [60, 'developing', 'Developing'],
    [30, 'needs-attention', 'Needs attention'],
  ] as const)('a %s score reads "%s" in words', (value, band, word) => {
    render(<ScoreCard name="Area" result={scored(value, band, 'high')} labels={scoreCardLabels} />);
    expect(screen.getByText(word)).toBeVisible();
  });
});

describe('ScoreCard with a NotScorable result', () => {
  it('renders the not-yet-scorable state and no number', () => {
    render(
      <ScoreCard
        name="Community Influence"
        result={notScorable('missing-answers', ['E1'])}
        labels={scoreCardLabels}
        questionLabel={questionText}
        questionHref={(id) => `/intake#${id}`}
      />,
    );
    const card = screen.getByRole('article', { name: 'Community Influence' });
    expect(card).toHaveTextContent('Not yet scorable');
    expect(card.textContent).not.toMatch(/\bout of 100\b/);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Question E1' })).toBeInTheDocument();
  });

  it('never shows a band, a score or a confidence for a NotScorable', () => {
    render(
      <ScoreCard
        name="Trust Network"
        result={notScorable('no-formula', [])}
        labels={scoreCardLabels}
      />,
    );
    expect(screen.queryByText(/Confidence/)).not.toBeInTheDocument();
    expect(screen.queryByText('Strong')).not.toBeInTheDocument();
    expect(screen.queryByText('Developing')).not.toBeInTheDocument();
    expect(screen.queryByText('Needs attention')).not.toBeInTheDocument();
  });
});
