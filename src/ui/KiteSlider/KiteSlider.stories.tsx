import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { KiteSlider } from './KiteSlider';

const words = ['', 'Month one', 'Month two', 'Month three', 'Month four', 'Month five', 'Month six'];
const valueText = (n: number): string => words[n] ?? '';

function Demo({ start }: { start: number }) {
  const [value, setValue] = useState(start);
  return (
    <KiteSlider
      label="Pilot month"
      min={1}
      max={6}
      value={value}
      onChange={setValue}
      valueText={valueText}
    />
  );
}

const meta = { title: 'ui/KiteSlider', component: KiteSlider } satisfies Meta<typeof KiteSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: 'Pilot month', min: 1, max: 6, onChange: () => undefined, valueText };

export const Start: Story = { args: { ...base, value: 1 }, render: () => <Demo start={1} /> };
export const Middle: Story = { args: { ...base, value: 3 }, render: () => <Demo start={3} /> };
export const End: Story = { args: { ...base, value: 6 }, render: () => <Demo start={6} /> };
