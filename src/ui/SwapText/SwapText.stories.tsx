import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../Button';
import { SwapText } from './SwapText';

const meta = { title: 'ui/SwapText', component: SwapText } satisfies Meta<typeof SwapText>;
export default meta;
type Story = StoryObj<typeof meta>;

const months = ['Month one', 'Month two', 'Month three'];

function Demo(): ReactElement {
  const [i, setI] = useState(0);
  return (
    <p>
      <SwapText>{months[i] ?? ''}</SwapText>{' '}
      <Button size="sm" onClick={() => setI((i + 1) % months.length)}>
        Next
      </Button>
    </p>
  );
}

export const Swapping: Story = { args: { children: 'Month one' }, render: () => <Demo /> };
