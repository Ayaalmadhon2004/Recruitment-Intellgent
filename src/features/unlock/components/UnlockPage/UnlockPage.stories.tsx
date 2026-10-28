import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createMemoryRuntime } from '../../memory-runtime';
import { UnlockPage } from './UnlockPage';

const meta = {
  title: 'features/unlock/UnlockPage',
  component: UnlockPage,
  parameters: { layout: 'fullscreen' },
  args: { runtime: createMemoryRuntime() },
} satisfies Meta<typeof UnlockPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** Locked: the lock card offers the options. The options, price and line are to be confirmed. */
export const LockedDesktop: Story = { globals: desktop };
export const LockedMobile: Story = { globals: mobile };

/** Step 1: three placeholder options (TBC), Continue waits for a pick. */
export const ChooseDesktop: Story = { args: { initialOpen: true }, globals: desktop };
export const ChooseMobile: Story = { args: { initialOpen: true }, globals: mobile };

/** Step 2: price and timing show as to be confirmed. */
export const ConfirmDesktop: Story = {
  args: { initialOpen: true, initialStep: 1, initialPathId: 'placeholder-1' },
  globals: desktop,
};
export const ConfirmMobile: Story = {
  args: { initialOpen: true, initialStep: 1, initialPathId: 'placeholder-1' },
  globals: mobile,
};

/** The service refuses: the page says so and nothing is unlocked. */
export const ConfirmFailed: Story = {
  args: {
    runtime: createMemoryRuntime({ fail: 'request' }),
    initialOpen: true,
    initialStep: 1,
    initialPathId: 'placeholder-2',
  },
  globals: desktop,
};

/** Unlocked: the full list reads Unlocked and the success state shows. */
export const UnlockedDesktop: Story = {
  args: { runtime: createMemoryRuntime({ unlockedWith: 'placeholder-1' }) },
  globals: desktop,
};
export const UnlockedMobile: Story = {
  args: { runtime: createMemoryRuntime({ unlockedWith: 'placeholder-1' }) },
  globals: mobile,
};

/** Empty: no answers on this device, so there is nothing to unlock. */
export const EmptyNoAudit: Story = {
  args: { runtime: createMemoryRuntime({ hasAudit: false }) },
  globals: desktop,
};

/** The entitlement could not be read. */
export const LoadError: Story = {
  args: { runtime: createMemoryRuntime({ fail: 'load' }) },
  globals: desktop,
};

/** Fixture data is labelled. */
export const SampleData: Story = {
  args: { isSample: true, institutionName: 'Northbridge University' },
  globals: desktop,
};
