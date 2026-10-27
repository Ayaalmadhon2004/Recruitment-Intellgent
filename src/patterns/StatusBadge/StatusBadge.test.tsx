import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

const tones = ['strong', 'caution', 'concern', 'info'] as const;

describe('StatusBadge', () => {
  it.each(tones)('%s always has a word and an icon, never colour alone', (tone) => {
    const { container } = render(<StatusBadge tone={tone} label={`Word for ${tone}`} />);
    expect(screen.getByText(`Word for ${tone}`)).toBeVisible();
    const icon = container.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses a different icon shape for each tone', () => {
    const shapes = tones.map((tone) => {
      const { container, unmount } = render(<StatusBadge tone={tone} label="x" />);
      const html = container.querySelector('svg')?.innerHTML ?? '';
      unmount();
      return html;
    });
    expect(new Set(shapes).size).toBe(tones.length);
  });
});
