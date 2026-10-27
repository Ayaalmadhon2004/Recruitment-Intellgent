import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Switch } from './Switch';

function Demo({ initial, disabled }: { initial: boolean; disabled?: boolean }): React.ReactNode {
  const [checked, setChecked] = useState(initial);
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 480 }}>
      <Switch
        label="Include living costs in the net price"
        checked={checked}
        onChange={setChecked}
        onLabel="On"
        offLabel="Off"
        disabled={disabled}
      />
    </div>
  );
}

const meta: Meta<typeof Switch> = { title: 'ui/Switch', component: Switch };
export default meta;
type Story = StoryObj<typeof Switch>;

export const On: Story = { render: () => <Demo initial /> };
export const Off: Story = { render: () => <Demo initial={false} /> };
export const Disabled: Story = { render: () => <Demo initial disabled /> };
