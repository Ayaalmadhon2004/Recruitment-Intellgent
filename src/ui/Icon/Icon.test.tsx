import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon, iconNames } from './Icon';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has an accessible name when a title is given', () => {
    render(<Icon name="lock" title="Locked" />);
    expect(screen.getByRole('img', { name: 'Locked' })).toBeInTheDocument();
  });

  it('renders every named icon', () => {
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector('svg')?.children.length).toBeGreaterThan(0);
      unmount();
    }
  });
});
