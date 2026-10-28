/** Landing page copy. Text comes from design-reference/screens/Landing.dc.html. */
export const landing = {
  meta: {
    title: 'Vietnam Recruitment Intelligence | Capstone Education',
    description:
      'Answer 5 questions and get a free first read of how ready your university is to recruit in Vietnam.',
  },
  hero: {
    eyebrow: 'FOR UNIVERSITIES RECRUITING IN VIETNAM',
    title: 'Know where you stand in Vietnam.',
    lead: 'Answer 5 questions. Get a free first read in about 3 minutes.',
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
      body: 'See strong and weak areas at a glance.',
      ringAria: 'Sample score ring, 78 of 100',
      ringCaption: 'out of 100',
    },
    stage: {
      title: 'Your recruitment stage',
      body: 'Know if you are starting, building or growing.',
      aria: 'Sample stage steps, second of four highlighted',
    },
    steps: {
      title: 'Next steps in order',
      body: 'Start with the quick wins.',
      aria: 'Sample checklist of three next steps, two done',
    },
  },
  how: {
    eyebrow: 'HOW IT WORKS',
    title: 'Three steps',
    listLabel: 'Steps',
    steps: [
      {
        title: 'Answer 5 questions',
        body: 'Simple choices. No documents needed.',
        time: '3 minutes',
      },
      {
        title: 'Get your free first read',
        body: 'Your stage and three preview scores.',
        time: 'Instant',
      },
      {
        title: 'Complete the full audit',
        body: 'Unlock all scores and a clear plan.',
        time: '40 questions',
      },
    ],
  },
  compare: {
    eyebrow: 'FREE OR FULL',
    title: 'Start free. Go deeper when ready.',
    switchLabel: 'Report type',
    included: 'Included',
    locked: 'Locked',
    priceLabel: 'Price',
    listLabel: 'What is in this report',
    pricePlaceholder: '[PRICING TO BE CONFIRMED WITH CAPSTONE]',
    free: {
      tab: 'Free report',
      title: 'Free report',
      sub: 'A first read after 5 questions.',
      price: 'Free',
      cta: 'Start the audit',
      items: [
        { label: 'Your recruitment stage', included: true },
        { label: '3 preview scores', included: true },
        { label: 'Areas still to score, listed', included: true },
        { label: 'All 6 area scores', included: false },
        { label: 'School Fit and Agent Attractiveness', included: false },
        { label: '6-month agent pilot plan and PDF', included: false },
      ],
    },
    full: {
      tab: 'Full report',
      title: 'Full report',
      sub: 'The whole picture from 40 questions.',
      cta: 'Start free first',
      items: [
        { label: 'Your recruitment stage', included: true },
        { label: 'All 6 area scores with evidence tags', included: true },
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
    body: 'Used only for your audit.',
    policyLink: 'Read the privacy policy',
    policyPlaceholder: '[PRIVACY POLICY TO BE CONFIRMED WITH CAPSTONE]',
  },
  finalCta: {
    title: 'Ready to see your first read?',
    body: '5 questions. About 3 minutes. Free.',
    primary: 'Start the audit',
    secondary: 'Visit capstonevietnam.com',
  },
} as const;
