import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KiteSlider } from './KiteSlider';

const words = ['', 'Month one', 'Month two', 'Month three'];
const setup = (value = 2) => {
  const onChange = vi.fn();
  render(
    <KiteSlider
      label="Pilot month"
      min={1}
      max={3}
      value={value}
      onChange={onChange}
      valueText={(n) => words[n] ?? ''}
    />,
  );
  return { onChange, slider: screen.getByRole('slider', { name: 'Pilot month' }) };
};

describe('KiteSlider', () => {
  it('exposes slider semantics with a spoken value', () => {
    const { slider } = setup();
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '3');
    expect(slider).toHaveAttribute('aria-valuenow', '2');
    expect(slider).toHaveAttribute('aria-valuetext', 'Month two');
    expect(slider).toHaveAttribute('tabindex', '0');
  });

  it('moves with arrows, Home and End', async () => {
    const user = userEvent.setup();
    const { slider, onChange } = setup();
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(3);
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith(1);
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(1);
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it('does not go past either end', async () => {
    const user = userEvent.setup();
    const { slider, onChange } = setup(3);
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('follows a pointer press and drag along the line', () => {
    const { slider, onChange } = setup(1);
    const track = slider.parentElement as HTMLElement;
    track.getBoundingClientRect = () => ({ left: 0, width: 200, right: 200 }) as DOMRect;
    track.setPointerCapture = vi.fn();
    track.hasPointerCapture = () => true;
    track.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(track, { pointerId: 1, clientX: 100, pointerType: 'touch' });
    expect(onChange).toHaveBeenLastCalledWith(2);
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 200 });
    expect(onChange).toHaveBeenLastCalledWith(3);
    fireEvent.pointerUp(track, { pointerId: 1, clientX: 200 });
  });
});
