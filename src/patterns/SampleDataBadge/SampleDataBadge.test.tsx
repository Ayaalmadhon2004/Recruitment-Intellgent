import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SampleDataBadge } from './SampleDataBadge';

describe('SampleDataBadge', () => {
  it('shows its label as text', () => {
    render(<SampleDataBadge label="Sample data - illustrative only" />);
    expect(screen.getByText('Sample data - illustrative only')).toBeInTheDocument();
  });
});
