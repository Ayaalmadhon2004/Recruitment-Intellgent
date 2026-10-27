import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { scored, scoredGauge } from '@/domain/scoring';
import { ScoreRing } from './ScoreRing';

describe('ScoreRing', () => {
  it('shows the number as real HTML text, not SVG text', () => {
    const { container } = render(
      <ScoreRing
        result={scored(68, 'developing', 'medium')}
        ariaLabel="Readiness score 68 out of 100"
        caption="out of 100"
      />,
    );
    const number = screen.getByText('68');
    expect(number.closest('svg')).toBeNull();
    expect(container.querySelector('svg text')).toBeNull();
    expect(screen.getByText('out of 100')).toBeInTheDocument();
  });

  it('has an accessible name for the whole ring', () => {
    render(
      <ScoreRing
        result={scored(68, 'developing', 'medium')}
        ariaLabel="Readiness score 68 out of 100"
        caption="x"
      />,
    );
    expect(screen.getByRole('img', { name: 'Readiness score 68 out of 100' })).toBeInTheDocument();
  });

  it('rounds a 0-100 score and shows a gauge with one decimal', () => {
    const { rerender } = render(
      <ScoreRing result={scored(67.6, 'developing', 'low')} ariaLabel="a" caption="c" />,
    );
    expect(screen.getByText('68')).toBeInTheDocument();
    rerender(<ScoreRing result={scoredGauge(7, 'low')} ariaLabel="a" caption="c" />);
    expect(screen.getByText('7.0')).toBeInTheDocument();
  });

  it.each([
    [80, 'strong'],
    [60, 'developing'],
    [30, 'needs-attention'],
  ] as const)('draws a %s score in the %s tone', (value, band) => {
    const { container } = render(
      <ScoreRing result={scored(value, band, 'high')} ariaLabel="a" caption="c" />,
    );
    expect(container.firstElementChild?.className).toMatch(
      band === 'strong' ? /strong/ : band === 'developing' ? /caution/ : /concern/,
    );
  });
});
