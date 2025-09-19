import type { SVGProps, JSX } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function createIcon(path: JSX.Element) {
  const Icon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  );
  Icon.displayName = "Icon";
  return Icon;
}

export const Wrench = createIcon(
  <path d="M21 3a7 7 0 0 1-8.5 6.8L9 13.3V18l-3 3-3-3 3-3h4.7l3.5-3.5A7 7 0 1 1 21 3Z" />
);

export const Table = createIcon(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <path d="M9 4v16" />
    <path d="M15 4v16" />
  </>
);

export const Activity = createIcon(
  <path d="M3 12h3l2.5-5 4 10 2.5-5H21" />
);

export const FileWarning = createIcon(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M12 12v4" />
    <path d="M12 18h.01" />
  </>
);

export const Layers = createIcon(
  <>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </>
);

export const Newspaper = createIcon(
  <>
    <path d="M4 19a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h13l4 4v9a2 2 0 0 1-2 2Z" />
    <path d="M13 6v4h5" />
    <path d="M7 12h6" />
    <path d="M7 16h10" />
    <path d="M7 8h2" />
  </>
);

export const Sun = createIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.9 4.9 1.4 1.4" />
    <path d="m17.7 17.7 1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m4.9 19.1 1.4-1.4" />
    <path d="m17.7 6.3 1.4-1.4" />
  </>
);

export const Moon = createIcon(
  <path d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8Z" />
);

export const Menu = createIcon(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>
);

export const ChevronRight = createIcon(<path d="m9 6 6 6-6 6" />);
export const ChevronLeft = createIcon(<path d="m15 6-6 6 6 6" />);
export const ChevronDown = createIcon(<path d="m6 9 6 6 6-6" />);
export const Check = createIcon(<path d="m4 12 4 4 12-12" />);
export const X = createIcon(
  <>
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </>
);

export const Search = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const Download = createIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </>
);

export const Filter = createIcon(
  <>
    <path d="M4 4h16" />
    <path d="M7 12h10" />
    <path d="M10 20h4" />
  </>
);

export const Sparkles = createIcon(
  <>
    <path d="M5 3v4" />
    <path d="M3 5h4" />
    <path d="M19 10v4" />
    <path d="M17 12h4" />
    <path d="M8 18h8l-4 4Z" />
  </>
);

export const ArrowUpRight = createIcon(<path d="M7 17 17 7" />);
export const ArrowDownRight = createIcon(<path d="M7 7h10v10" />);
export const Upload = createIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5-5 5 5" />
    <path d="M12 5v14" />
  </>
);

export const Info = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>
);

export const BadgeCheck = createIcon(
  <>
    <path d="M12 2 2 7l10 5 10-5Z" />
    <path d="m12 22-10-5v-7" />
    <path d="m12 22 10-5v-7" />
    <path d="m8 12 2.5 2.5L16 9" />
  </>
);

export const Bell = createIcon(
  <>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>
);

export const List = createIcon(
  <>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </>
);

export const Rows = createIcon(
  <>
    <rect x="3" y="5" width="18" height="4" rx="1" />
    <rect x="3" y="11" width="18" height="4" rx="1" />
    <rect x="3" y="17" width="18" height="2" rx="1" />
  </>
);

export const Columns = createIcon(
  <>
    <rect x="5" y="3" width="4" height="18" rx="1" />
    <rect x="11" y="3" width="4" height="18" rx="1" />
    <rect x="17" y="3" width="2" height="18" rx="1" />
  </>
);

export const Grid = createIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </>
);

export const Calendar = createIcon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </>
);

export const Users = createIcon(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const Mail = createIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>
);

export const RefreshCcw = createIcon(
  <>
    <path d="M3 2v6h6" />
    <path d="M3.51 15a9 9 0 1 0 .49-9" />
    <path d="M21 22v-6h-6" />
  </>
);

export const SlidersHorizontal = createIcon(
  <>
    <path d="M21 4H7" />
    <path d="M17 8V4" />
    <path d="M21 12h-8" />
    <path d="M11 16v-4" />
    <path d="M21 20H9" />
    <path d="M15 20v-4" />
  </>
);

const icons = {
  Wrench,
  Table,
  Activity,
  FileWarning,
  Layers,
  Newspaper,
};

export default icons;
