/**
 * Sample data for the Cost Calculator, taken from the design prototype.
 * Always shown with the "Sample data" badge. The peer values are NOT real institutions.
 */
export type SamplePeer = {
  readonly id: string;
  readonly name: string;
  readonly netUsd: number;
};

export const costSample = {
  isSample: true as const,
  /** Starting numbers in the design. */
  start: { tuition: '34000', living: '9000', scholarship: 6000, includeLiving: true },
  peers: [
    { id: 'a', name: 'Peer A (sample)', netUsd: 27000 },
    { id: 'b', name: 'Peer B (sample)', netUsd: 36000 },
    { id: 'c', name: 'Peer C (sample)', netUsd: 44000 },
  ] as readonly SamplePeer[],
};
