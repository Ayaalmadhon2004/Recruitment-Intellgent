import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { notScorable, scored } from '@/domain/scoring';
import { radarLabels } from '@/fixtures/labels';
import { RadarChart } from './RadarChart';
import type { RadarAxis } from './RadarChart';

const axes: RadarAxis[] = [
  { id: 'r', label: 'Readiness', result: scored(68, 'developing', 'medium') },
  { id: 'c', label: 'Competitiveness', result: scored(54, 'needs-attention', 'low') },
  { id: 'a', label: 'Affordability', result: scored(62, 'developing', 'high') },
  { id: 'd', label: 'Digital Visibility', result: scored(78, 'strong', 'high') },
  { id: 't', label: 'Trust Network', result: scored(49, 'needs-attention', 'low') },
  { id: 'i', label: 'Community Influence', result: notScorable('missing-answers', ['E1']) },
];

describe('RadarChart', () => {
  it('names every axis in an HTML legend', () => {
    render(<RadarChart axes={axes} labels={radarLabels} />);
    expect(screen.getByText(/Readiness 68/)).toBeInTheDocument();
    expect(screen.getByText(/Community Influence Not yet scorable/)).toBeInTheDocument();
  });

  it('has an accessible table fallback with every area and its score', () => {
    render(<RadarChart axes={axes} labels={radarLabels} />);
    const table = screen.getByRole('table', { name: 'Scores by area' });
    expect(within(table).getAllByRole('row')).toHaveLength(axes.length + 1);
    expect(within(table).getByRole('row', { name: /Readiness/ })).toHaveTextContent(
      '68 out of 100',
    );
    expect(within(table).getByRole('row', { name: /Community Influence/ })).toHaveTextContent(
      'Not yet scorable',
    );
  });

  it('hides the drawing from assistive tech since the table carries the data', () => {
    const { container } = render(<RadarChart axes={axes} labels={radarLabels} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('plots only scored axes: a NotScorable area is never drawn as 0', () => {
    const { container } = render(<RadarChart axes={axes} labels={radarLabels} />);
    expect(container.querySelectorAll('circle')).toHaveLength(5);
    const data = container.querySelector('[class*="data"]');
    expect(data?.getAttribute('points')?.split(' ')).toHaveLength(5);
  });

  it('draws no area when fewer than three axes are scored', () => {
    const few = axes.map((a, i) =>
      i < 2 ? a : { ...a, result: notScorable('no-formula' as const, []) },
    );
    const { container } = render(<RadarChart axes={few} labels={radarLabels} />);
    expect(container.querySelector('[class*="data"]')).toBeNull();
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
