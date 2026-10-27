import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renders children in the requested element', () => {
    render(<PageContainer as="main">content</PageContainer>);
    expect(screen.getByRole('main')).toHaveTextContent('content');
  });
});
