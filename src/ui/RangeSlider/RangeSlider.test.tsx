import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
  it('has a label, a visible value and a spoken value', () => {
    render(
      <RangeSlider
        label="Scholarship"
        min={0}
        max={10000}
        step={500}
        value={6000}
        onChange={() => {}}
        formatValue={(v) => `$${v}`}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Scholarship' });
    expect(slider).toHaveAttribute('aria-valuetext', '$6000');
    expect(screen.getByText('$6000').tagName).toBe('OUTPUT');
  });

  it('reports a numeric value on change', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        label="Amount"
        min={0}
        max={100}
        value={10}
        onChange={onChange}
        formatValue={String}
      />,
    );
    fireEvent.change(screen.getByRole('slider'), { target: { value: '40' } });
    expect(onChange).toHaveBeenCalledWith(40);
  });
});
