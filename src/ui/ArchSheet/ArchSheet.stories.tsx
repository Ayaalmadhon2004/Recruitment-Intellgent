import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { ArchSheet } from './ArchSheet';
import type { ArchSheetProps } from './ArchSheet';

const meta = {
  title: 'ui/ArchSheet',
  component: ArchSheet,
  args: {
    open: false,
    onClose: () => undefined,
    title: 'Before you begin',
    children: 'Sheet content goes here.',
  },
} satisfies Meta<typeof ArchSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = { args: { open: true } };
function Demo(args: ArchSheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <ArchSheet {...args} open={open} onClose={() => setOpen(false)}>
        <p>Focus stays inside until you close it.</p>
        <Button onClick={() => setOpen(false)}>Got it</Button>
      </ArchSheet>
    </>
  );
}
export const Interactive: Story = { render: (args) => <Demo {...args} /> };
