import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children in the requested element', () => {
    render(
      <Card as="article" aria-label="Score card">
        Inside
      </Card>,
    );
    expect(screen.getByRole('article', { name: 'Score card' })).toHaveTextContent('Inside');
  });
});
