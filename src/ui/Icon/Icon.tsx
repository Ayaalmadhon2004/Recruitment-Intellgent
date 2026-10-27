import type { ReactNode } from 'react';

const shapes = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </>
  ),
  'circle-dashed': <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />,
  alert: (
    <>
      <path d="M12 3l10 17H2z" />
      <path d="M12 10v5M12 18v.01" />
    </>
  ),
  concern: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  minus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 12h9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.7v.01" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2M12 16.8v.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  users: (
    <path d="M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 8a3 3 0 010 6M21 20a6 6 0 00-4-5.6" />
  ),
  person: (
    <>
      <path d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M5 20a7 7 0 0114 0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  dollar: (
    <path d="M12 3v18M16.5 7.5C15.5 6.4 14 6 12 6c-2.5 0-4 1.1-4 3s1.5 2.6 4 3 4 1.2 4 3-1.5 3-4 3c-2 0-3.5-.5-4.5-1.6" />
  ),
  card: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof shapes;

export const iconNames = Object.keys(shapes) as IconName[];

export type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Set when the icon carries meaning on its own; otherwise it is decorative. */
  title?: string;
  className?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 2.2,
  title,
  className,
}: IconProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {shapes[name]}
    </svg>
  );
}
