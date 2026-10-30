import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ArchSheet } from './ArchSheet';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        opener
      </button>
      <ArchSheet open={open} onClose={() => setOpen(false)} title="Sheet title">
        <button type="button">inside</button>
      </ArchSheet>
    </>
  );
}

describe('ArchSheet', () => {
  it('renders nothing when closed', () => {
    render(
      <ArchSheet open={false} onClose={() => undefined} title="T">
        x
      </ArchSheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is a labelled modal dialog with a close mark that calls onClose', () => {
    const onClose = vi.fn();
    render(
      <ArchSheet open onClose={onClose} title="Sheet title">
        body
      </ArchSheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Sheet title' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks scroll, closes on Escape and returns focus to the opener', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'opener' });
    await user.click(opener);
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(opener).toHaveFocus();
  });

  it('keeps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'opener' }));
    const close = screen.getByRole('button', { name: 'Close' });
    const inside = screen.getByRole('button', { name: 'inside' });
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(inside).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(inside).toHaveFocus();
  });
});
