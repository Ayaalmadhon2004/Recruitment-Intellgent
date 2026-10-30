import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollCompanion, buildPath } from './ScrollCompanion';

describe('ScrollCompanion', () => {
  it('is decorative: hidden from assistive tech and not focusable', () => {
    const { container } = render(<ScrollCompanion />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.querySelector('a, button, [tabindex]')).toBeNull();
  });

  it('builds a path that starts at the top centre and ends at the bottom', () => {
    const d = buildPath({ width: 100, height: 880 });
    expect(d.startsWith('M50 0')).toBe(true);
    expect(d.trim().endsWith('50 880')).toBe(true);
  });
});
