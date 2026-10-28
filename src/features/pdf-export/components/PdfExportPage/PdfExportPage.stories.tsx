import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { northbridgeReportModel, syntheticScoredReportModel } from '@/fixtures/report';
import { PdfExportPage } from './PdfExportPage';

const meta = {
  title: 'features/pdf-export/PdfExportPage',
  component: PdfExportPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PdfExportPage>;
export default meta;
type Story = StoryObj<typeof meta>;

const desktop = { viewport: { value: 'desktop', isRotated: false } } as const;
const mobile = { viewport: { value: 'mobile', isRotated: false } } as const;

/** SYNTHETIC scores, labelled Sample data. */
const scored = syntheticScoredReportModel();
/** What the real config returns today: every area is Not yet scorable. */
const notScorable = northbridgeReportModel();

export const Default: Story = { args: { previewModel: scored }, globals: desktop };
export const DefaultMobile: Story = { args: { previewModel: scored }, globals: mobile };

export const NotScorable: Story = { args: { previewModel: notScorable }, globals: desktop };
export const NotScorableMobile: Story = { args: { previewModel: notScorable }, globals: mobile };

/** The report date, the logo upload and the Vietnamese option are all to-be-confirmed values. */
export const TbcValues: Story = { args: { previewModel: scored }, globals: desktop };

export const Loading: Story = { args: { previewState: 'loading' }, globals: desktop };
export const Error: Story = { args: { previewState: 'error' }, globals: desktop };
export const Empty: Story = { args: { previewState: 'empty' }, globals: desktop };
export const EmptyMobile: Story = { args: { previewState: 'empty' }, globals: mobile };
