import type { Confidence, DomainConfig, KnownEvidenceTag } from '../types';

/** Confidence for an evidence tag, from config. */
export function confidenceFor(tag: KnownEvidenceTag, config: DomainConfig): Confidence {
  return config.evidence.confidenceByTag[tag];
}
