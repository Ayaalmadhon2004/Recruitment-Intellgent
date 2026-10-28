import { en } from '@/domain/copy';
import { tbcConfig } from '@/domain/config/tbc.config';
import type { Tbc } from '@/domain/config/tbc.config';
import type { IconName } from '@/ui';
import type { ChannelId, TimeWindowId } from './validate';

type ChannelDefinition = {
  id: ChannelId;
  icon: IconName;
  inputType: 'tel' | 'email';
  autoComplete: 'tel' | 'email';
  /** Confirmed contact detail from config, or null (rendered as a labelled placeholder). */
  confirmed: Tbc<string>;
  copy: (typeof en.advisor.channels)[ChannelId];
};

/** Channel order and behaviour. Contact details are config values, never written here. */
export const channels: readonly ChannelDefinition[] = [
  {
    id: 'whatsapp',
    icon: 'chat',
    inputType: 'tel',
    autoComplete: 'tel',
    confirmed: tbcConfig.advisorWhatsapp,
    copy: en.advisor.channels.whatsapp,
  },
  {
    id: 'email',
    icon: 'mail',
    inputType: 'email',
    autoComplete: 'email',
    confirmed: tbcConfig.advisorEmail,
    copy: en.advisor.channels.email,
  },
  {
    id: 'call',
    icon: 'phone',
    inputType: 'tel',
    autoComplete: 'tel',
    confirmed: tbcConfig.advisorCallDetails,
    copy: en.advisor.channels.call,
  },
];

export const channelById = (id: ChannelId): ChannelDefinition =>
  channels.find((c) => c.id === id) ?? channels[0]!;

export const timeWindows: readonly { value: TimeWindowId; label: string }[] = [
  { value: 'morning', label: en.advisor.times.morning },
  { value: 'afternoon', label: en.advisor.times.afternoon },
  { value: 'evening', label: en.advisor.times.evening },
];

export const timeLabel = (id: TimeWindowId): string => en.advisor.times[id];

/** Fills `{token}` placeholders in a copy string. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), template);
