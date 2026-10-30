import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WaveDivider } from './WaveDivider';

describe('WaveDivider', () => {
  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<WaveDivider from="card" to="page" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports the pastel blue tone used under the home hero', () => {
    const { container } = render(<WaveDivider from="blue" to="page" />);
    expect(container.firstElementChild?.className).toMatch(/from-blue/);
  });
});
