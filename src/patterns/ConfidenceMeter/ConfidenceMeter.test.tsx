import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConfidenceMeter } from './ConfidenceMeter';

describe('ConfidenceMeter', () => {
  it.each([
    ['high', 'High'],
    ['medium', 'Medium'],
    ['low', 'Low'],
    ['none', 'None yet'],
  ] as const)('%s is stated in words', (level, word) => {
    render(<ConfidenceMeter level={level} label="Confidence" levelLabel={word} />);
    expect(screen.getByText(`Confidence: ${word}`)).toBeVisible();
  });

  it('fills as many bars as the level', () => {
    const { container } = render(
      <ConfidenceMeter level="medium" label="Confidence" levelLabel="Medium" />,
    );
    const bars = Array.from(container.querySelectorAll('[class*="bars"] > span'));
    expect(bars).toHaveLength(3);
    expect(bars.filter((b) => b.getAttribute('data-filled') === 'true')).toHaveLength(2);
  });
});
