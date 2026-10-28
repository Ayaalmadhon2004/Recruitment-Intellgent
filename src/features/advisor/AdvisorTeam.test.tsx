import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdvisorTeam } from './AdvisorTeam';
import { sampleAdvisors } from './sampleAdvisors';

describe('AdvisorTeam', () => {
  it('labels the profiles as sample data', () => {
    render(<AdvisorTeam />);
    expect(screen.getByText('Sample data - illustrative only')).toBeInTheDocument();
  });

  it('shows name, title, bio and availability for every advisor', () => {
    render(<AdvisorTeam />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(sampleAdvisors.length);
    for (const [i, a] of sampleAdvisors.entries()) {
      const card = within(cards[i]!);
      expect(card.getByRole('heading', { name: a.name })).toBeInTheDocument();
      expect(card.getByText(a.title)).toBeInTheDocument();
      expect(card.getByText(a.specialisation)).toBeInTheDocument();
      expect(
        card.getByText(/Available on WhatsApp|Replies by email|Available for calls/),
      ).toBeVisible();
    }
  });
});
