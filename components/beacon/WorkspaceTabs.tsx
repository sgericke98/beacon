"use client";

import { topTabs } from "@/lib/demo-data";
import { useWorkspaceStore } from "@/store/workspace-store";
function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function WorkspaceTabs() {
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const setTab = useWorkspaceStore((state) => state.setTab);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border bg-background/70 p-2 shadow-sm">
      {topTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setTab(tab.id)}
          className={classNames(
            "rounded-2xl px-4 py-2 text-sm font-medium transition",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          )}
        >
          <div className="flex flex-col text-left leading-tight">
            <span>{tab.label}</span>
            <span className="text-xs text-muted-foreground/80">{tab.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
