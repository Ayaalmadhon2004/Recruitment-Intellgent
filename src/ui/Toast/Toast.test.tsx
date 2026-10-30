import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

function Trigger() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast.show({ message: 'Saved it', status: 'success', durationMs: 1000 })}
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
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved it')).not.toBeInTheDocument();
  });

  it('throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
