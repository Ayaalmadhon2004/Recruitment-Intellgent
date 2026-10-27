import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { RangeSlider } from './RangeSlider';

const usd = (n: number): string => '$' + n.toLocaleString('en-US');

function Demo({ initial }: { initial: number }): React.ReactNode {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 480 }}>
      <RangeSlider
        label="Scholarship amount per year"
        min={0}
        max={34000}
        step={500}
        value={value}
        onChange={setValue}
        formatValue={usd}
        minLabel="$0"
        maxLabel="$34,000 (full tuition)"
      />
    </div>
  );
}

const meta: Meta<typeof RangeSlider> = { title: 'ui/RangeSlider', component: RangeSlider };
export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = { render: () => <Demo initial={6000} /> };
export const AtMinimum: Story = { render: () => <Demo initial={0} /> };
export const AtMaximum: Story = { render: () => <Demo initial={34000} /> };
