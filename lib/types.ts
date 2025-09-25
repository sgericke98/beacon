export type AgentVertical =
  | "sales-marketing"
  | "quote-to-cash"
  | "post-sales"
  | "finance"
  | "strategy"
  | "data"
  | "operations"
  | "people";

export type AgentStepId =
  | "plan"
  | "gather"
  | "analyze"
  | "cluster"
  | "segment"
  | "recommend"
  | "draft";

export interface AgentStep {
  id: AgentStepId;
  label: string;
  description: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  vertical: AgentVertical;
  summary: string;
  headline: string;
  status: "core" | "coming-soon";
  features: string[];
  heroAction: string;
  steps: AgentStep[];
  defaultFilters?: Record<string, string>;
  filters?: FilterDefinition[];
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: "select" | "segmented";
  options: { label: string; value: string }[];
}

export interface StepLogEntry {
  id: string;
  stepId: AgentStepId;
  timestamp: number;
  message: string;
}

export interface RunArtifactTable {
  type: "table";
  id: string;
  title: string;
  description?: string;
  columns: { id: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, string | number>[];
}

export interface RunArtifactList {
  type: "list";
  id: string;
  title: string;
  description?: string;
  items: { title: string; caption?: string }[];
}

export interface RunArtifactRichText {
  type: "richtext";
  id: string;
  title: string;
  description?: string;
  html: string;
}

export interface RunArtifactChart {
  type: "chart";
  id: string;
  title: string;
  description?: string;
  data: { label: string; value: number }[];
}

export type RunArtifact = RunArtifactTable | RunArtifactList | RunArtifactRichText | RunArtifactChart;

export interface KPIValue {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  caption?: string;
}

export interface AgentRunResult {
  agentId: string;
  kpis: KPIValue[];
  artifacts: RunArtifact[];
  logs: StepLogEntry[];
  completedAt: number;
  filters: Record<string, string>;
}

export interface AgentRunEvent {
  type: "start" | "step" | "log" | "complete";
  stepId?: AgentStepId;
  payload?: unknown;
  log?: StepLogEntry;
  result?: AgentRunResult;
}

export interface RunHistoryEntry {
  id: string;
  agentId: string;
  startedAt: number;
  completedAt: number;
  summary: string;
  filters: Record<string, string>;
}
