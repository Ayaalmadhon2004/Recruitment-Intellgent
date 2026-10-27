import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon, iconNames } from './Icon';

const meta = { title: 'ui/Icon', component: Icon, args: { name: 'check' } } satisfies Meta<
  typeof Icon
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { size: 48 } };
export const Labelled: Story = { args: { name: 'lock', size: 48, title: 'Locked' } };
export const AllIcons: Story = {
  render: () => (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
        listStyle: 'none',
        padding: 'var(--space-6)',
        margin: 0,
      }}
    >
      {iconNames.map((n) => (
        <li
          key={n}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <Icon name={n} size={32} />
          <span style={{ fontSize: 'var(--text-caption-size)' }}>{n}</span>
        </li>
      ))}
    </ul>
  ),
};
