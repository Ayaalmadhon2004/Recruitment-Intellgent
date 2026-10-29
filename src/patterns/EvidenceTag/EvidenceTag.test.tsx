import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { evidenceTags } from '@/domain/types';
import { en } from '@/domain/copy';
import { EvidenceTag } from './EvidenceTag';

describe('EvidenceTag', () => {
  it.each(evidenceTags)('%s shows its word and an icon', (tag) => {
    const { container } = render(<EvidenceTag tag={tag} label={en.evidenceTags[tag]} />);
    expect(screen.getByText(en.evidenceTags[tag])).toBeVisible();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('tells the five tags apart by icon shape', () => {
    const shapes = evidenceTags.map((tag) => {
      const { container, unmount } = render(<EvidenceTag tag={tag} label="x" />);
      const html = container.querySelector('svg')?.innerHTML ?? '';
      unmount();
      return html;
    });
    expect(new Set(shapes).size).toBe(5);
  });

  it('shows its plain-English meaning as a tooltip when given one', () => {
    render(
      <EvidenceTag
        tag="estimate"
        label={en.evidenceTags.estimate}
        hint={en.intake.evidenceHelp.estimate}
      />,
    );
    expect(screen.getByTitle(en.intake.evidenceHelp.estimate)).toBeInTheDocument();
  });
});
