import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

function Demo({ onChange }: { onChange?: (v: boolean) => void }): React.ReactNode {
  const [on, setOn] = useState(true);
  return (
    <Switch
      label="Include living costs"
      checked={on}
      onChange={(v) => {
        setOn(v);
        onChange?.(v);
      }}
      onLabel="On"
      offLabel="Off"
    />
  );
}

describe('Switch', () => {
  it('is a switch with an accessible name and state', () => {
    render(<Demo />);
    const sw = screen.getByRole('switch', { name: 'Include living costs' });
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('toggles by click, Space and Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Demo onChange={onChange} />);
    const sw = screen.getByRole('switch');
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('Off')).toBeInTheDocument();
    sw.focus();
    await user.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(
      <Switch label="X" checked={false} onChange={onChange} onLabel="On" offLabel="Off" disabled />,
    );
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
