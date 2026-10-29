import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton, SkeletonGroup } from './Skeleton';

describe('SkeletonGroup', () => {
  it('is a busy status region announced once by its label', () => {
    render(
      <SkeletonGroup label="Loading your report">
        <Skeleton shape="line" />
        <Skeleton shape="block" height="120px" />
      </SkeletonGroup>,
    );
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveTextContent('Loading your report');
  });

  it('hides every shape from assistive technology', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <Skeleton shape="circle" width="64px" />
      </SkeletonGroup>,
    );
    expect(container.querySelector('[aria-hidden="true"] [aria-hidden="true"]')).not.toBeNull();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('reserves the size it is given', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <Skeleton shape="block" width="50%" height="200px" aspectRatio="16 / 9" />
      </SkeletonGroup>,
    );
    const shape = container.querySelector<HTMLElement>('span[aria-hidden]');
    expect(shape).toHaveStyle({ width: '50%', height: '200px', aspectRatio: '16 / 9' });
  });
});
