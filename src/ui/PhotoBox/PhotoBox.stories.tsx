import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PhotoBox } from './PhotoBox';

const meta: Meta<typeof PhotoBox> = {
  title: 'ui/PhotoBox',
  component: PhotoBox,
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PhotoBox>;

export const ArchPhoto: Story = {
  args: {
    src: '/temp-assets/temp-graduate.jpg',
    alt: 'Smiling graduate holding a diploma (temporary photo)',
    width: 300,
    height: 400,
    shape: 'arch',
  },
};
export const RoundPhoto: Story = {
  args: {
    src: '/temp-assets/temp-graduate.jpg',
    alt: 'Graduate smiling (temporary photo)',
    width: 160,
    height: 160,
    shape: 'round',
  },
};
export const RoundedPhoto: Story = {
  args: {
    src: '/temp-assets/temp-campus.jpg',
    alt: 'Aerial view of a school campus (temporary photo)',
    width: 320,
    height: 200,
    shape: 'rounded',
  },
};
export const PlaceholderRound: Story = {
  args: { placeholder: '[ADVISOR PHOTO]', width: 132, height: 132, shape: 'round' },
};
export const PlaceholderRounded: Story = {
  args: { placeholder: '[PHOTO: campus. To be supplied by Capstone]', width: 320, height: 200 },
};
