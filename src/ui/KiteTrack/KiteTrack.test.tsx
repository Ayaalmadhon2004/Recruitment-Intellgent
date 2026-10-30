import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KiteTrack } from './KiteTrack';

describe('KiteTrack', () => {
  it('names the three stops in text and marks the current one', () => {
    render(<KiteTrack label="Sections" previous="Alpha" current="Beta" next="Gamma" />);
    const group = screen.getByRole('group', { name: 'Sections' });
    expect(group).toHaveTextContent('Previous: Alpha');
    expect(group).toHaveTextContent('Current: Beta');
    expect(group).toHaveTextContent('Next: Gamma');
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
  });

  it('leaves the place empty when there is no previous or next stop', () => {
    render(<KiteTrack label="Sections" current="Only" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText(/Previous:/)).not.toBeInTheDocument();
  });

  it('keeps the kite decorative and clamps progress', () => {
    const { container } = render(<KiteTrack label="Sections" current="A" progress={4} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--kite-progress')).toBe(
      '1',
    );
  });
});
