import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlainSection } from './PlainSection';

describe('PlainSection', () => {
  it('is a region named by its heading', () => {
    render(
      <PlainSection title="Hello" eyebrow="Eye">
        <p>body</p>
      </PlainSection>,
    );
    expect(screen.getByRole('region', { name: 'Hello' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Hello' })).toBeInTheDocument();
    expect(screen.getByText('Eye')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('supports another level and no body', () => {
    render(<PlainSection title="Only" level="h3" separator="line" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Only' })).toBeInTheDocument();
  });
});
