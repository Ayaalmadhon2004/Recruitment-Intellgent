import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { RadioCardGroup } from './RadioCard';

const options = [
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    description: 'Quick chat, any time.',
    detail: '[WHATSAPP NUMBER TO BE CONFIRMED WITH CAPSTONE]',
    icon: 'chat',
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Write at your own pace.',
    detail: '[EMAIL ADDRESS TO BE CONFIRMED WITH CAPSTONE]',
    icon: 'mail',
  },
  {
    value: 'call',
    label: 'Request a call',
    description: 'We call you back.',
    detail: '[CALL DETAILS TO BE CONFIRMED WITH CAPSTONE]',
    icon: 'phone',
  },
] as const;

function Demo({ initial }: { initial: string | null }): React.ReactNode {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <RadioCardGroup
        legend="Choose a channel"
        name="channel"
        options={options}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}

const meta: Meta<typeof RadioCardGroup> = {
  title: 'ui/RadioCardGroup',
  component: RadioCardGroup,
} satisfies Meta<typeof RadioCardGroup>;
export default meta;
type Story = StoryObj<typeof RadioCardGroup>;

export const NothingSelected: Story = { render: () => <Demo initial={null} /> };
export const Selected: Story = { render: () => <Demo initial="whatsapp" /> };
