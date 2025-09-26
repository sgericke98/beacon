"use client";

import { WorkspaceContextBar } from "@/components/beacon/WorkspaceContextBar";
import { WorkspaceTabs } from "@/components/beacon/WorkspaceTabs";
import { OverviewTab } from "@/components/beacon/tabs/OverviewTab";
import { EntitiesTab } from "@/components/beacon/tabs/EntitiesTab";
import { AgentsTab } from "@/components/beacon/tabs/AgentsTab";
import { WorkflowsTab } from "@/components/beacon/tabs/WorkflowsTab";
import { ArtifactsTab } from "@/components/beacon/tabs/ArtifactsTab";
import { DeliverablesTab } from "@/components/beacon/tabs/DeliverablesTab";
import { AnalyticsTab } from "@/components/beacon/tabs/AnalyticsTab";
import { SecurityTab } from "@/components/beacon/tabs/SecurityTab";
import { RoadmapTab } from "@/components/beacon/tabs/RoadmapTab";
import { SettingsTab } from "@/components/beacon/tabs/SettingsTab";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function HomePage() {
  const activeTab = useWorkspaceStore((state) => state.activeTab);

  return (
    <div className="space-y-8">
      <WorkspaceContextBar />
      <WorkspaceTabs />
      <div className="space-y-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "entities" && <EntitiesTab />}
        {activeTab === "agents" && <AgentsTab />}
        {activeTab === "workflows" && <WorkflowsTab />}
        {activeTab === "artifacts" && <ArtifactsTab />}
        {activeTab === "deliverables" && <DeliverablesTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "roadmap" && <RoadmapTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
