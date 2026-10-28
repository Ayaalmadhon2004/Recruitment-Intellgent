/**
 * Agent Strategy copy. Text in braces, such as {count}, is filled in by the feature from config
 * (the pilot numbers, the rating range, the factor count), so a changed config never needs a copy edit.
 */
export const agentStrategy = {
  meta: {
    title: 'Agent strategy',
    description: 'Choose agents, run a six-month pilot and forecast the result.',
  },
  hero: {
    title: 'Choose agents. Run a pilot. Forecast the result.',
    lead: '{agentCount} agents, {months} months, no exclusivity.',
    pilotMonths: '{months}-month pilot',
    pilotAgents: '{agentCount} agents',
    nonExclusive: 'Non-exclusive',
    exclusive: 'Exclusive',
    commission: '{min}-{max}% commission benchmark',
    chipsLabel: 'Pilot terms',
  },
  weights: {
    eyebrow: 'WHAT MATTERS',
    title: '{count} factors for choosing agents',
    sampleWeights: 'Sample weights',
    hint: 'Pick a factor to highlight it.',
    legendLabel: 'Factor weights',
    totalWeight: 'total weight',
    weightText: '{weight}%',
  },
  matrix: {
    eyebrow: 'AGENT SELECTION MATRIX',
    title: 'Rate each agent from {min} to {max}',
    sampleBadge: 'Sample data - agents and ratings are not real',
    caption: 'Weight in brackets. Weighted score is out of {max}.',
    regionLabel: 'Agent selection matrix, scrolls sideways on small screens',
    agentHeader: 'Agent',
    scoreHeader: 'Weighted score',
    factorHeader: '{name} ({weight})',
    select: 'Select',
    selected: 'Selected',
    rating: '{value} / {max}',
    score: '{score} / {max}',
    summaryEyebrow: 'SELECTED',
    summaryTitle: '{name} - {score} out of {max}',
    summaryDetail: 'Strongest: {strongest}. Weakest: {weakest}.',
    factorRating: '{factor} ({rating})',
  },
  pilot: {
    eyebrow: 'THE PILOT',
    title: '{months} months, month by month',
    listLabel: 'Pilot months',
    month: 'Month {n}',
    monthAria: 'Month {n}: {title}',
    detail: 'Month {n} - {phase}',
    phases: {
      choose: 'Choose',
      run: 'Run',
      review: 'Review',
    },
    months: {
      m1: {
        phase: 'choose',
        title: 'Shortlist',
        body: 'Score candidate agents with the matrix. Pick {agentCount}.',
      },
      m2: {
        phase: 'choose',
        title: 'Sign terms',
        body: 'Agree non-exclusive terms. Use the {min}-{max}% commission benchmark.',
      },
      m3: {
        phase: 'run',
        title: 'Launch',
        body: 'Brief each agent. Share scholarship examples and your visa and offer timeline.',
      },
      m4: {
        phase: 'run',
        title: 'Reply fast',
        body: 'Answer agent leads within 24-48 hours. Log every enquiry.',
      },
      m5: {
        phase: 'review',
        title: 'Compare',
        body: 'Compare applications, offers and enrolments for each agent.',
      },
      m6: {
        phase: 'review',
        title: 'Decide',
        body: 'Keep, expand or end each agent. Write down why.',
      },
    },
  },
  forecast: {
    eyebrow: 'FORECAST',
    title: 'From applications to enrolments',
    sampleBadge: 'Sample inputs - not a prediction',
    formula:
      'Qualified applications x offer rate x enrolment yield x visa and retention adjustment.',
    step: 'STEP {n}',
    operator: 'x',
    fields: {
      applications: { label: 'Qualified applications', running: 'Start: {value}' },
      offerRate: { label: 'Offer rate (%)', running: 'Offers: {value}' },
      enrolmentYield: { label: 'Enrolment yield (%)', running: 'Enrolled: {value}' },
      visaRetention: { label: 'Visa and retention adjustment (%)', running: 'Kept: {value}' },
    },
    resultEyebrow: 'FORECAST ENROLMENTS',
    resultLine: 'About {count} students from the sample pilot',
    calcLine: '{applications} x {offerRate}% x {enrolmentYield}% x {visaRetention}% = {result}',
    sampleNote: 'Sample data. Replace with your own numbers.',
  },
  cta: {
    title: 'Plan the pilot with a person',
    body: 'A Capstone advisor can help you pick {agentCount} agents.',
    photoPlaceholder: '[ADVISOR PHOTO]',
    channels: {
      whatsapp: 'WhatsApp',
      email: 'Email',
      call: 'Book a call',
    },
  },
} as const;
