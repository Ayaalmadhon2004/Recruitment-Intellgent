import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhotoBox } from './PhotoBox';

describe('PhotoBox', () => {
  it('renders an image with its alt text', () => {
    render(
      <PhotoBox
        src="/temp-assets/temp-graduate.jpg"
        alt="Smiling graduate"
        width={300}
        height={400}
        shape="arch"
      />,
    );
    expect(screen.getByRole('img', { name: 'Smiling graduate' })).toBeInTheDocument();
  });

  it('renders a labelled placeholder when there is no image', () => {
    render(
      <PhotoBox
        placeholder="[PHOTO: advisor. To be supplied by Capstone]"
        width={132}
        height={132}
        shape="round"
      />,
    );
    expect(
      screen.getByRole('img', { name: '[PHOTO: advisor. To be supplied by Capstone]' }),
    ).toBeInTheDocument();
  });
});
