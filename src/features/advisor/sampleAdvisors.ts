import type { ChannelId } from './validate';

export type SampleAdvisor = {
  id: string;
  name: string;
  title: string;
  /** Initials shown until a real photo is supplied by Capstone. */
  initials: string;
  specialisation: string;
  availability: ChannelId;
};

/**
 * SAMPLE DATA: illustrative profiles only, not real Capstone staff.
 * Replace with the confirmed team (open item: advisor names, photos and channels).
 */
export const sampleAdvisors: readonly SampleAdvisor[] = [
  {
    id: 'sample-1',
    name: 'Sample Advisor A',
    title: 'Senior Education & Recruitment Advisor',
    initials: 'SA',
    specialisation: 'Expert in university placements and agent matching.',
    availability: 'whatsapp',
  },
  {
    id: 'sample-2',
    name: 'Sample Advisor B',
    title: 'Partnerships & Agent Strategy Advisor',
    initials: 'SB',
    specialisation: 'Helps you compare agents and read their track record.',
    availability: 'email',
  },
  {
    id: 'sample-3',
    name: 'Sample Advisor C',
    title: 'Scholarships & Pricing Advisor',
    initials: 'SC',
    specialisation: 'Talks through price bands, scholarships and family budgets.',
    availability: 'call',
  },
];
