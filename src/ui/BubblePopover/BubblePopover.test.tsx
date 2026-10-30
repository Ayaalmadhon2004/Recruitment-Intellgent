import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BubblePopover } from './BubblePopover';

describe('BubblePopover', () => {
  it('is closed by default and toggles with aria-expanded', () => {
    render(<BubblePopover>Help text</BubblePopover>);
    const button = screen.getByRole('button', { name: 'More information' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Help text')).not.toBeVisible();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Help text')).toBeVisible();
  });

  it('closes on Escape and returns focus to the button', () => {
    render(<BubblePopover label="About">Help text</BubblePopover>);
    const button = screen.getByRole('button', { name: 'About' });
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('closes on an outside press', () => {
    render(<BubblePopover>Help text</BubblePopover>);
    const button = screen.getByRole('button', { name: 'More information' });
    fireEvent.click(button);
    fireEvent.pointerDown(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
