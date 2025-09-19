"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileWarning, Layers, Newspaper, Table, Wrench } from "lucide-react";
import type { IconProps } from "lucide-react";

const NAV_ITEMS: Array<{ name: string; href: string; icon: (props: IconProps) => JSX.Element }> = [
  { name: "Setup", href: "/setup", icon: Wrench },
  { name: "Raw Data", href: "/raw-data", icon: Table },
  { name: "L2C Analysis", href: "/l2c-analysis", icon: Activity },
  { name: "Revenue Leakage", href: "/revenue-leakage", icon: FileWarning },
  { name: "Data Cleaning – Hierarchy", href: "/data-cleaning-hierarchy", icon: Layers },
  { name: "AI Newsletter", href: "/ai-newsletter", icon: Newspaper },
];

interface BeaconNavProps {
  onNavigate?: () => void;
}

export function BeaconNav({ onNavigate }: BeaconNavProps) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
