import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

const TOAST_MS = 1000;
const LONG_WAIT_MS = 5000;

function Trigger() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast.show({ message: 'Saved it', status: 'success', durationMs: TOAST_MS })}
    >
      go
    </button>
  );
}

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows a message with a status word inside a polite live region', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('Done');
    expect(region).toHaveTextContent('Saved it');
  });

  it('does not stack the same message twice', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getAllByText('Saved it')).toHaveLength(1);
  });

  it('dismisses itself after its duration and by the close button', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    act(() => {
      vi.advanceTimersByTime(TOAST_MS);
    });
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();
  });

  it('announces only the new toast, not every toast again', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-atomic', 'false');
    expect(region).toHaveAttribute('aria-relevant', 'additions');
  });

  it('stays while the pointer is on it and closes after it leaves', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    const toast = screen.getByText('Saved it').closest('div[data-status]') as HTMLElement;
    fireEvent.pointerEnter(toast);
    act(() => {
      vi.advanceTimersByTime(LONG_WAIT_MS);
    });
    expect(screen.getByText('Saved it')).toBeInTheDocument();
    fireEvent.pointerLeave(toast);
    act(() => {
      vi.advanceTimersByTime(TOAST_MS * 2);
    });
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();
  });

  it('stays while keyboard focus is inside it', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
    act(() => dismiss.focus());
    act(() => {
      vi.advanceTimersByTime(LONG_WAIT_MS);
    });
    expect(screen.getByText('Saved it')).toBeInTheDocument();
    act(() => dismiss.blur());
    act(() => {
      vi.advanceTimersByTime(TOAST_MS * 2);
    });
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();
  });

  it('throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    // Accepts any message that names the provider, e.g. "useToast must be used inside <ToastProvider>"; rejects "boom".
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
