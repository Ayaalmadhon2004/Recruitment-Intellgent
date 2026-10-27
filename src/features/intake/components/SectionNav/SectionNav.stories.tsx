import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { questionsConfig } from '@/domain/config';
import { sectionIds } from '@/domain/types';
import type { SectionProgress } from '../../state';
import { SectionNav } from './SectionNav';

const progress = (handledBySection: readonly number[]): SectionProgress[] =>
  sectionIds.map((id, i) => {
    const total = questionsConfig.filter((q) => q.section === id).length;
    const handled = Math.min(total, handledBySection[i] ?? 0);
    return { id, handled, total, complete: total > 0 && handled === total };
  });

const meta = {
  title: 'features/intake/SectionNav',
  component: SectionNav,
  parameters: { layout: 'fullscreen' },
  args: { sections: progress([]), current: 0, onSelect: () => undefined },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionNav>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;
const some = progress([4, 2, 1, 0, 0, 0]);

export const EmptyDesktop: Story = { globals: desktop };
export const EmptyMobile: Story = { globals: mobile };

export const PartlyAnsweredDesktop: Story = {
  args: { sections: some, current: 2 },
  globals: desktop,
};
export const PartlyAnsweredMobile: Story = {
  args: { sections: some, current: 2 },
  globals: mobile,
};

export const AllCompleteDesktop: Story = {
  args: { sections: progress([9, 9, 9, 9, 9, 9]), current: 5 },
  globals: desktop,
};
export const AllCompleteMobile: Story = {
  args: { sections: progress([9, 9, 9, 9, 9, 9]), current: 5 },
  globals: mobile,
};

function InteractiveNav(args: ComponentProps<typeof SectionNav>): ReactNode {
  const [current, setCurrent] = useState(args.current);
  return <SectionNav {...args} sections={some} current={current} onSelect={setCurrent} />;
}

/** Click a section to see it become the current one. */
export const Interactive: Story = {
  globals: desktop,
  render: (args) => <InteractiveNav {...args} />,
};
