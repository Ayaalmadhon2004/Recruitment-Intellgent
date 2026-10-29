/**
 * Landing page copy. Text comes from design-reference/screens/Landing.dc.html.
 * {quickStart} and {total} are filled from config/audit.config.ts, never typed here.
 */
export const landing = {
  meta: {
    title: 'Vietnam Recruitment Intelligence | Capstone Education',
    description:
      'Answer {quickStart} questions and get a free first read of how ready your university is to recruit in Vietnam.',
  },
  hero: {
    eyebrow: 'FOR UNIVERSITIES RECRUITING IN VIETNAM',
    title: 'Know where you stand in Vietnam.',
    lead: 'Answer {quickStart} short questions and get a free first read of where your university stands in Vietnam, in about 3 minutes. No documents needed, and "Not sure" is always an acceptable answer.',
    primaryCta: 'Start the audit',
    secondaryCta: 'See how it works',
    photoAlt: 'Smiling graduate holding a diploma (temporary photo)',
    chipLabel: 'Sample data',
    chipScore: 'Readiness 68 of 100',
    chipAria: 'Sample score ring 68 of 100',
  },
  get: {
    eyebrow: 'WHAT YOU GET',
    title: 'Clear scores. Clear next steps.',
    scores: {
      title: 'Scores out of 100',
      body: 'See your strong and weaker areas at a glance, so you know where to focus first.',
      ringAria: 'Sample score ring, 78 of 100',
      ringCaption: 'out of 100',
    },
    stage: {
      title: 'Your recruitment stage',
      body: 'Know whether you are starting, building or growing, so you can plan with confidence.',
      aria: 'Sample stage steps, second of four highlighted',
    },
    steps: {
      title: 'Next steps in order',
      body: 'Start with the changes that make the biggest difference.',
      aria: 'Sample checklist of three next steps, two done',
    },
  },
  how: {
    eyebrow: 'HOW IT WORKS',
    title: 'Three steps',
    listLabel: 'Steps',
    steps: [
      {
        title: 'Answer {quickStart} questions',
        body: 'Simple choices, no documents needed. Not sure about one? Say so and carry on.',
        time: 'About 3 minutes',
      },
      {
        title: 'Get your free first read',
        body: 'Your recruitment stage and three preview scores, free.',
        time: 'Right after you finish',
      },
      {
        title: 'Complete the full audit',
        body: 'Open all six scores and a clear plan, whenever you are ready.',
        time: '{total} questions, at your own pace',
      },
    ],
  },
  compare: {
    eyebrow: 'FREE OR FULL',
    title: 'Start free. Go deeper when ready.',
    switchLabel: 'Report type',
    included: 'Included',
    locked: 'In the full report',
    priceLabel: 'Price',
    listLabel: 'What is in this report',
    pricePlaceholder: '[PRICING TO BE CONFIRMED WITH CAPSTONE]',
    free: {
      tab: 'Free report',
      title: 'Free report',
      sub: 'A first read after {quickStart} short questions.',
      price: 'Free',
      cta: 'Start the audit',
      items: [
        { label: 'Your recruitment stage', included: true },
        { label: '3 preview scores', included: true },
        { label: 'The areas still waiting on answers, listed', included: true },
        { label: 'All 6 area scores', included: false },
        { label: 'School Fit and Agent Attractiveness', included: false },
        { label: '6-month agent pilot plan and PDF', included: false },
      ],
    },
    full: {
      tab: 'Full report',
      title: 'Full report',
      sub: 'The whole picture from {total} questions.',
      cta: 'Start free first',
      items: [
        { label: 'Your recruitment stage', included: true },
        { label: 'All 6 area scores, each showing how firm it is', included: true },
        { label: 'School Fit and Agent Attractiveness', included: true },
        { label: 'Cost breakdown and agent matrix', included: true },
        { label: '6-month agent pilot plan', included: true },
        { label: 'PDF and advisor conversation', included: true },
      ],
    },
  },
  privacy: {
    label: 'Privacy',
    title: 'Your answers stay private.',
    body: 'Your answers are used only to build your audit.',
    policyLink: 'Read the privacy policy',
    policyPlaceholder: '[PRIVACY POLICY TO BE CONFIRMED WITH CAPSTONE]',
  },
  finalCta: {
    title: 'Ready to see your first read?',
    body: '{quickStart} short questions, about 3 minutes, and free. Not sure about one? Just say so.',
    primary: 'Start the audit',
    secondary: 'Visit capstonevietnam.com',
  },
} as const;
