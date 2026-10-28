/** Copy for the PDF export page. `{name}` marks a value filled in by the component. */
export const pdfExport = {
  meta: { title: 'PDF export' },
  hero: {
    eyebrow: 'PDF EXPORT',
    title: 'Preview your PDF',
    lead: 'Pick what goes in. The pages update as you go.',
  },
  pages: {
    label: 'Page shown',
    cover: 'Cover',
    content: 'Page 2',
  },
  preview: {
    aria: 'A4 preview of the PDF for {name}. Cover page and the pages that follow.',
    ariaSample:
      'A4 preview of the PDF for {name}, sample data. Cover page and the pages that follow.',
    captionCover: 'Showing: cover. A4 size.',
    captionContent: 'Showing: page 2. A4 size.',
    sampleMark: 'SAMPLE DATA',
    logoPlaceholder: '[LOGO]',
  },
  options: {
    label: 'PDF options',
    eyebrow: 'OPTIONS',
    title: 'Make it yours',
    includeLabel: 'Include sections ({count})',
    count: '{n} of {total}',
    on: 'On',
    off: 'Off',
    languageLabel: 'Language',
    english: 'English',
    vietnamese: 'Vietnamese',
    logoLabel: 'Add institution logo',
    logoPlaceholder: '[INSTITUTION LOGO: upload to be confirmed]',
  },
  action: {
    download: 'Download PDF',
    hint: 'Your browser opens its print window. Choose Save as PDF as the destination.',
  },
  nav: {
    backToReport: 'Back to report',
  },
} as const;
