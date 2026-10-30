import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepLabel } from './StepLabel';

describe('StepLabel', () => {
  it('renders the word and number in a polite live region', () => {
    render(<StepLabel current={2} />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveTextContent('Step 2');
  });

  it('uses a custom word, a total, and updates when the number changes', () => {
    const { rerender } = render(<StepLabel current={1} total={5} word="Question" />);
    expect(screen.getByRole('status')).toHaveTextContent('Question 1 of 5');
    rerender(<StepLabel current={2} total={5} word="Question" />);
    expect(screen.getByRole('status')).toHaveTextContent('Question 2 of 5');
  });
});
