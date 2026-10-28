import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { createMemoryRuntime } from '../../memory-runtime';
import { UnlockPage } from './UnlockPage';

const copy = en.unlock;

async function ready(runtime = createMemoryRuntime()): Promise<void> {
  render(<UnlockPage runtime={runtime} />);
  await screen.findByRole('heading', { level: 1, name: copy.hero.title });
  await screen.findByRole('region', { name: copy.split.sectionLabel }).catch(() => undefined);
}

describe('UnlockPage', () => {
  it('starts locked: the full list says Locked and the lock card offers the options', async () => {
    await ready();
    const full = screen.getByRole('article', { name: copy.split.fullTitle });
    expect(within(full).getAllByText(copy.split.lockedWord).length).toBeGreaterThan(1);
    expect(screen.getByRole('button', { name: copy.cta.seeOptions })).toBeVisible();
    expect(screen.queryByRole('group', { name: copy.choose.legend })).toBeNull();
  });

  it('shows the unconfirmed free and full line and options as placeholders', async () => {
    const user = userEvent.setup();
    await ready();
    expect(screen.getAllByText(en.status.tbc).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: copy.cta.seeOptions }));
    const group = screen.getByRole('group', { name: copy.choose.legend });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(within(group).getByText(copy.choose.placeholders.one)).toBeVisible();
    await user.click(within(group).getAllByRole('radio')[0] as HTMLElement);
    await user.click(screen.getByRole('button', { name: copy.flow.next }));
    const option = screen.getByText(copy.confirm.option).closest('div') as HTMLElement;
    expect(within(option).getByText(copy.choose.placeholders.one)).toBeVisible();
    expect(screen.queryByText(/\$|USD|VND/)).toBeNull();
  });

  it('cannot continue until an option is picked', async () => {
    const user = userEvent.setup();
    await ready();
    await user.click(screen.getByRole('button', { name: copy.cta.seeOptions }));
    expect(screen.getByRole('button', { name: copy.flow.next })).toBeDisabled();
    expect(screen.getByText(copy.choose.pickOne)).toBeVisible();
  });

  it('walks choose, confirm, then unlocks through the service', async () => {
    const user = userEvent.setup();
    const runtime = createMemoryRuntime();
    await ready(runtime);
    await user.click(screen.getByRole('button', { name: copy.cta.seeOptions }));
    await user.click(screen.getAllByRole('radio')[1] as HTMLElement);
    await user.click(screen.getByRole('button', { name: copy.flow.next }));
    await user.click(screen.getByRole('button', { name: copy.flow.submit }));
    expect(await screen.findByRole('heading', { name: copy.done.title })).toBeVisible();
    const stepper = screen.getByRole('list', { name: copy.flow.stepperLabel });
    expect(within(stepper).getAllByRole('listitem')).toHaveLength(3);
    expect(within(stepper).getByRole('listitem', { current: 'step' })).toHaveTextContent(
      copy.flow.stepDone,
    );
    expect(screen.getByRole('link', { name: copy.done.openReport })).toHaveAttribute(
      'href',
      routes.report,
    );
    expect((await runtime.service.getEntitlement('story-audit')).entitlement).toBe('unlocked');
    const full = screen.getByRole('article', { name: copy.split.fullTitle });
    expect(within(full).getAllByText(copy.split.unlockedWord).length).toBeGreaterThan(1);
  });

  it('goes back from Confirm to Choose keeping the pick', async () => {
    const user = userEvent.setup();
    await ready();
    await user.click(screen.getByRole('button', { name: copy.cta.seeOptions }));
    await user.click(screen.getAllByRole('radio')[2] as HTMLElement);
    await user.click(screen.getByRole('button', { name: copy.flow.next }));
    await user.click(screen.getByRole('button', { name: copy.flow.back }));
    expect(screen.getAllByRole('radio')[2]).toBeChecked();
  });

  it('says so and unlocks nothing when the request fails', async () => {
    const user = userEvent.setup();
    const runtime = createMemoryRuntime({ fail: 'request' });
    await ready(runtime);
    await user.click(screen.getByRole('button', { name: copy.cta.seeOptions }));
    await user.click(screen.getAllByRole('radio')[0] as HTMLElement);
    await user.click(screen.getByRole('button', { name: copy.flow.next }));
    await user.click(screen.getByRole('button', { name: copy.flow.submit }));
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.confirm.failed);
    expect(screen.queryByRole('heading', { name: copy.done.title })).toBeNull();
  });

  it('opens already-unlocked audits on the done state with no flow', async () => {
    await ready(createMemoryRuntime({ unlockedWith: 'placeholder-1' }));
    expect(screen.getByRole('heading', { name: copy.done.title })).toBeVisible();
    expect(screen.queryByRole('button', { name: copy.cta.seeOptions })).toBeNull();
    expect(screen.queryByRole('group', { name: copy.choose.legend })).toBeNull();
  });

  it('has nothing to unlock without an audit and points to the Quick Start', async () => {
    await ready(createMemoryRuntime({ hasAudit: false }));
    expect(screen.getByText(copy.empty.body)).toBeVisible();
    expect(screen.getByRole('link', { name: copy.empty.cta })).toHaveAttribute(
      'href',
      routes.quickStart,
    );
    expect(screen.queryByRole('button', { name: copy.cta.seeOptions })).toBeNull();
  });

  it('shows an error with a retry when the entitlement cannot be read', async () => {
    render(<UnlockPage runtime={createMemoryRuntime({ fail: 'load' })} />);
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.state.errorTitle);
    expect(screen.getByRole('button', { name: copy.state.retry })).toBeVisible();
  });

  it('labels sample data and the development service', async () => {
    render(
      <UnlockPage
        runtime={createMemoryRuntime()}
        isSample
        institutionName="Northbridge University"
      />,
    );
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByText(en.status.sample)).toBeVisible();
    expect(screen.getByRole('note')).toHaveTextContent(copy.dev.heading);
  });

  it('renders no main landmark of its own', async () => {
    await ready();
    expect(screen.queryByRole('main')).toBeNull();
  });
});
