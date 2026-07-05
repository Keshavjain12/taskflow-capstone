// Lightweight inline icon set (Tabler-style outline strokes) — avoids an
// extra runtime dependency while keeping a consistent, premium icon language
// across the app.
import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function base(children: React.ReactNode, props: IconProps) {
  const { className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconKanban = (p: IconProps) =>
  base(
    <>
      <rect x="4" y="4" width="6" height="16" rx="1.5" />
      <rect x="14" y="4" width="6" height="10" rx="1.5" />
    </>,
    p,
  );

export const IconFolder = (p: IconProps) =>
  base(<path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />, p);

export const IconSun = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>,
    p,
  );

export const IconMoon = (p: IconProps) => base(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />, p);

export const IconLogout = (p: IconProps) =>
  base(
    <>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>,
    p,
  );

export const IconSearch = (p: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>,
    p,
  );

export const IconPlus = (p: IconProps) => base(<path d="M12 5v14M5 12h14" />, p);

export const IconX = (p: IconProps) => base(<path d="M18 6 6 18M6 6l12 12" />, p);

export const IconTrash = (p: IconProps) =>
  base(
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </>,
    p,
  );

export const IconChevronDown = (p: IconProps) => base(<path d="m6 9 6 6 6-6" />, p);

export const IconUsers = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      <path d="M17 8.5a3 3 0 1 1 0-5.9M22 20c0-2.7-2.1-5-5-5.7" />
    </>,
    p,
  );

export const IconCheckCircle = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L15.5 9.5" />
    </>,
    p,
  );

export const IconAlertTriangle = (p: IconProps) =>
  base(
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <path d="M12 10v4M12 17.5v.01" />
    </>,
    p,
  );

export const IconInbox = (p: IconProps) =>
  base(
    <>
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M5.5 5h13l1.5 7v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6l1.5-7Z" />
    </>,
    p,
  );

export const IconMenu = (p: IconProps) => base(<path d="M4 6h16M4 12h16M4 18h16" />, p);

export const IconArrowLeft = (p: IconProps) => base(<path d="M19 12H5M11 18l-6-6 6-6" />, p);

export const IconCalendar = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>,
    p,
  );

export const IconSparkles = (p: IconProps) =>
  base(
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 13l.6 1.6L7 15l-1.4.6L5 17l-.6-1.4L3 15l1.4-.4L5 13Z" />,
    p,
  );

export const IconLayers = (p: IconProps) =>
  base(
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5M3 8v5M21 8v5" />
    </>,
    p,
  );

export const IconShield = (p: IconProps) =>
  base(<path d="M12 3 4.5 6v6c0 4.5 3.2 7.5 7.5 9 4.3-1.5 7.5-4.5 7.5-9V6L12 3Zm-2 9 1.6 1.6L15 10" />, p);

export const IconServer = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="4" width="17" height="6" rx="1.5" />
      <rect x="3.5" y="14" width="17" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </>,
    p,
  );

export const IconCommand = (p: IconProps) =>
  base(
    <path d="M8 4a2 2 0 1 1 2 2H8v4h4V8a2 2 0 1 1 2 2h-2v4h2a2 2 0 1 1-2 2v-2H8v2a2 2 0 1 1-2-2h2v-4H6a2 2 0 1 1 2-2h2V6H8a2 2 0 0 1-2-2Z" />,
    p,
  );

export const IconBell = (p: IconProps) =>
  base(
    <>
      <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
    </>,
    p,
  );

export const IconChartBar = (p: IconProps) =>
  base(
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
    </>,
    p,
  );

export const IconMessageCircle = (p: IconProps) =>
  base(<path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.2 3.8A7.96 7.96 0 0 1 21 12Z" />, p);

export const IconClock = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>,
    p,
  );

export const IconActivity = (p: IconProps) => base(<path d="M3 12h4l2 8 4-16 2 8h6" />, p);
