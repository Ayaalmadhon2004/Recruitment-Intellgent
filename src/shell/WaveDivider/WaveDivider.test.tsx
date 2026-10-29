import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WaveDivider } from './WaveDivider';

describe('WaveDivider', () => {
  it('is decorative and hidden from assistive tech', () => {
    const { container } = render(<WaveDivider from="card" to="page" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
