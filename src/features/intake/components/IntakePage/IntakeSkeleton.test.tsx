import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { en } from '@/domain/copy';
import { createMemoryStore } from '../../store';
import { IntakePage } from './IntakePage';
import { IntakeSkeleton } from './IntakeSkeleton';

describe('IntakeSkeleton', () => {
  it('is one busy status with no text of its own but the label', () => {
    const { container } = render(<IntakeSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.textContent).toBe(en.skeleton.intake);
  });

  it('is what the server renders, before the saved answers can be read', () => {
    const html = renderToString(
      <IntakePage reportHref="/r" exitHref="/e" store={createMemoryStore()} />,
    );
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain(en.skeleton.intake);
  });
});
