import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { AdvisorCta } from './AdvisorCta';

const base = {
  title: 'Talk it through with a person',
  body: 'A Capstone advisor will walk you through your results.',
  tbcText: en.status.tbc,
};
const meta = {
  title: 'patterns/AdvisorCta',
  component: AdvisorCta,
  args: {
    ...base,
    photo: { placeholder: '[ADVISOR PHOTO]' },
    channels: [
      { id: 'wa', label: 'WhatsApp', href: null },
      { id: 'mail', label: 'Email', href: null },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvisorCta>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ChannelsNotConfirmed: Story = {};
export const ChannelsConfirmed: Story = {
  args: {
    photo: { src: '/temp-assets/temp-graduate.jpg', alt: 'Advisor (temporary photo)' },
    channels: [
      { id: 'wa', label: 'WhatsApp', href: '#' },
      { id: 'mail', label: 'Email', href: '#' },
    ],
  },
};
export const OneConfirmed: Story = {
  args: {
    channels: [
      { id: 'wa', label: 'WhatsApp', href: '#' },
      { id: 'mail', label: 'Email', href: null },
    ],
  },
};
