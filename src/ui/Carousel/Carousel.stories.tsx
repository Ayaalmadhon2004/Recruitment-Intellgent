import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Carousel } from './Carousel';

const slide = (title: string, body: string): React.ReactNode => (
  <div
    style={{
      padding: 'var(--space-8)',
      background: 'var(--color-navy)',
      color: 'var(--color-text-inverse)',
      minHeight: 200,
    }}
  >
    <h3 style={{ margin: 0 }}>{title}</h3>
    <p>{body}</p>
  </div>
);
const slides = [
  { id: '1', content: slide('Choose three agents', 'Months 1-2') },
  { id: '2', content: slide('Run the pilot', 'Months 3-4') },
  { id: '3', content: slide('Review and decide', 'Months 5-6') },
];
const labels = {
  previous: 'Previous slide',
  next: 'Next slide',
  dots: 'Slide position',
  goTo: (n: number) => `Go to slide ${n}`,
  slide: (n: number, total: number) => `${n} of ${total}`,
};
const meta = {
  title: 'ui/Carousel',
  component: Carousel,
  args: { slides, label: 'Your 6-month agent pilot', labels },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleSlide: Story = { args: { slides: slides.slice(0, 1) } };
