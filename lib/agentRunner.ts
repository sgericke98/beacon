"use client";

import { synthesizeStepNarrative, summarizeKpis } from "@/lib/fakeLLM";
import type {
  AgentDefinition,
  AgentRunEvent,
  AgentRunResult,
  KPIValue,
  RunArtifact,
  StepLogEntry,
} from "@/lib/types";
import { formatUsd, formatPercent } from "@/lib/fakeLLM";

const RUN_DELAY = 420;

interface RevenueLeakageResponse {
  metrics: {
    leakageRate: number;
    revenueAtRisk: number;
    flaggedCount: number;
    topCauses: { cause: string; amount: number }[];
  };
  anomalies: {
    invoiceId: string;
    customer: string;
    amount: number;
    leakage: number;
    cause: string;
    status: string;
    action: string;
  }[];
  recommendations: { title: string; summary: string }[];
}

interface L2CAnalyticsResponse {
  metrics: {
    avgCycle: number;
    slowestStage: string;
    p95: number;
  };
  stages: { stage: string; avg: number }[];
  bottlenecks: { stage: string; insight: string; action: string }[];
}

interface AccountHierarchyResponse {
  metrics: {
    duplicateCount: number;
    depth: number;
    orphanCount: number;
  };
  tree: { id: string; name: string; children?: AccountHierarchyResponse["tree"] }[];
  duplicates: { domain: string; accounts: string[]; suggestion: string }[];
  recommendations: { title: string; summary: string }[];
}

interface MarketBriefResponse {
  metrics: {
    tamBand: string;
    competitorCount: number;
    icpFit: number;
    triggers: string[];
  };
  tamSeries: { region: string; tam: number }[];
  competitors: {
    name: string;
    positioning: string;
    winRate: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  signals: { headline: string; signal: string; impact: string; summary: string }[];
}

interface CollectionsResponse {
  metrics: {
    dso: number;
    arTotal: number;
    pctOver60: number;
    cash30: number;
  };
  rows: {
    invoiceId: string;
    customer: string;
    dueDate: string;
    daysPastDue: number;
    balance: number;
    bucket: string;
    risk: string;
  }[];
  segments: { name: string; summary: string }[];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runAgent(
  agent: AgentDefinition,
  filters: Record<string, string>,
  onEvent: (event: AgentRunEvent) => void
) {
  let cancelled = false;
  const logs: StepLogEntry[] = [];

  async function execute() {
    onEvent({ type: "start" });
    const payload = await fetchPayload(agent, filters);
    const context = payload.context;

    for (const step of agent.steps) {
      if (cancelled) return;
      onEvent({ type: "step", stepId: step.id, payload: { status: "start" } });
      const messages = synthesizeStepNarrative(agent.id as never, step.id, context as never);
      for (const message of messages) {
        if (cancelled) return;
        await sleep(RUN_DELAY);
        const entry: StepLogEntry = {
          id: `${step.id}-${logs.length + 1}`,
          stepId: step.id,
          timestamp: Date.now(),
          message,
        };
        logs.push(entry);
        onEvent({ type: "log", stepId: step.id, log: entry });
      }
    }

    if (cancelled) return;

    const result: AgentRunResult = {
      agentId: agent.id,
      kpis: payload.kpis,
      artifacts: payload.artifacts,
      logs,
      completedAt: Date.now(),
      filters,
    };

    onEvent({ type: "complete", result });
  }

  execute().catch((error) => {
    console.error(error);
  });

  return () => {
    cancelled = true;
  };
}

async function fetchPayload(agent: AgentDefinition, filters: Record<string, string>): Promise<{
  kpis: KPIValue[];
  artifacts: RunArtifact[];
  context: unknown;
}> {
  switch (agent.id) {
    case "revenue-leakage": {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/agents/revenue-leakage?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as RevenueLeakageResponse;
      const kpis: KPIValue[] = [
        {
          id: "leakage-rate",
          label: "Leakage Rate",
          value: formatPercent(data.metrics.leakageRate),
          caption: `${data.metrics.flaggedCount} invoices flagged`,
        },
        {
          id: "revenue-risk",
          label: "Revenue at Risk",
          value: formatUsd(data.metrics.revenueAtRisk),
          caption: data.metrics.topCauses[0] ? `Top driver: ${data.metrics.topCauses[0].cause}` : undefined,
        },
      ];
      const artifacts: RunArtifact[] = [
        {
          type: "table",
          id: "invoice-anomalies",
          title: "Flagged Invoices",
          description: "Invoices requiring intervention ordered by impact.",
          columns: [
            { id: "invoiceId", label: "Invoice" },
            { id: "customer", label: "Customer" },
            { id: "amount", label: "Amount", align: "right" },
            { id: "leakage", label: "Leakage", align: "right" },
            { id: "cause", label: "Cause" },
            { id: "status", label: "Status" },
          ],
          rows: data.anomalies.map((row) => ({
            invoiceId: row.invoiceId,
            customer: row.customer,
            amount: formatUsd(row.amount),
            leakage: formatUsd(row.leakage),
            cause: row.cause,
            status: row.status,
          })),
        },
        {
          type: "list",
          id: "leakage-playbook",
          title: "Recommended Plays",
          items: data.recommendations.map((item) => ({ title: item.title, caption: item.summary })),
        },
      ];
      return { kpis, artifacts, context: { summary: data.metrics } };
    }
    case "l2c-analytics": {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/agents/l2c-analytics?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as L2CAnalyticsResponse;
      const kpis: KPIValue[] = [
        {
          id: "avg-cycle",
          label: "Avg Cycle",
          value: `${Math.round(data.metrics.avgCycle)} days`,
          caption: `P95 ${Math.round(data.metrics.p95)} days`,
        },
        {
          id: "slowest",
          label: "Slowest Stage",
          value: data.metrics.slowestStage,
        },
      ];
      const artifacts: RunArtifact[] = [
        {
          type: "chart",
          id: "stage-duration-chart",
          title: "Stage Duration",
          description: "Average days spent per stage across filtered opportunities.",
          data: data.stages.map((row) => ({ label: row.stage, value: Math.round(row.avg) })),
        },
        {
          type: "table",
          id: "stage-durations",
          title: "Stage Duration (days)",
          columns: [
            { id: "stage", label: "Stage" },
            { id: "avg", label: "Avg Days", align: "right" },
          ],
          rows: data.stages.map((row) => ({ stage: row.stage, avg: Math.round(row.avg) })),
        },
        {
          type: "list",
          id: "bottlenecks",
          title: "Bottleneck Notes",
          items: data.bottlenecks.map((item) => ({ title: item.stage, caption: `${item.insight} – ${item.action}` })),
        },
      ];
      return { kpis, artifacts, context: { summary: data.metrics } };
    }
    case "account-hierarchy": {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/agents/account-hierarchy?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as AccountHierarchyResponse;
      const kpis: KPIValue[] = [
        {
          id: "duplicates",
          label: "Potential Duplicates",
          value: String(data.metrics.duplicateCount),
          caption: `${data.metrics.orphanCount} orphan accounts`,
        },
        {
          id: "depth",
          label: "Hierarchy Depth",
          value: `${data.metrics.depth} levels`,
        },
      ];
      const artifacts: RunArtifact[] = [
        {
          type: "table",
          id: "hierarchy-tree",
          title: "Account Hierarchy",
          columns: [
            { id: "name", label: "Account" },
            { id: "path", label: "Path" },
          ],
          rows: flattenTree(data.tree).map((node) => ({
            name: node.name,
            path: node.path,
          })),
        },
        {
          type: "list",
          id: "duplicate-suggestions",
          title: "Merge Suggestions",
          items: data.duplicates.map((dup) => ({
            title: dup.domain,
            caption: `${dup.accounts.join(", ")} → ${dup.suggestion}`,
          })),
        },
      ];
      return { kpis, artifacts, context: { summary: data.metrics } };
    }
    case "market-research": {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/market/brief?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as MarketBriefResponse;
      const kpis: KPIValue[] = [
        {
          id: "tam",
          label: "TAM Band",
          value: data.metrics.tamBand,
          caption: `${data.metrics.competitorCount} competitors`,
        },
        {
          id: "icp",
          label: "ICP Fit",
          value: formatPercent(data.metrics.icpFit),
        },
      ];
      const artifacts: RunArtifact[] = [
        {
          type: "list",
          id: "competitors",
          title: "Battlecard",
          items: data.competitors.map((comp) => ({
            title: `${comp.name} • ${formatPercent(comp.winRate)} win rate`,
            caption: `${comp.positioning}. Strengths: ${comp.strengths.join(", ")}. Watch: ${comp.weaknesses.join(", ")}.`,
          })),
        },
        {
          type: "chart",
          id: "tam-chart",
          title: "TAM by Region",
          description: "Total addressable market in billions across the selected industry",
          data: data.tamSeries.map((entry) => ({ label: entry.region, value: Number(entry.tam.toFixed(2)) })),
        },
        {
          type: "list",
          id: "signals",
          title: "Top Trigger Signals",
          items: data.signals.map((signal) => ({
            title: `${signal.headline} (${signal.impact})`,
            caption: signal.summary,
          })),
        },
      ];
      return { kpis, artifacts, context: { summary: data.metrics } };
    }
    case "cash-collections": {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/finance/aging?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as CollectionsResponse;
      const draftRes = await fetch(`/api/finance/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceIds: data.rows.map((row) => row.invoiceId) }),
      });
      const draftPayload = (await draftRes.json()) as {
        drafts: { tone: string; subject: string; body: string }[];
      };
      const kpis: KPIValue[] = [
        {
          id: "dso",
          label: "DSO",
          value: `${Math.round(data.metrics.dso)} days`,
          caption: formatUsd(data.metrics.arTotal),
        },
        {
          id: "over60",
          label: ">60 Days",
          value: formatPercent(data.metrics.pctOver60),
          caption: `Cash-in 30d ${formatUsd(data.metrics.cash30)}`,
        },
      ];
      const artifacts: RunArtifact[] = [
        {
          type: "table",
          id: "aging-table",
          title: "Aging Detail",
          columns: [
            { id: "invoiceId", label: "Invoice" },
            { id: "customer", label: "Customer" },
            { id: "dueDate", label: "Due Date" },
            { id: "daysPastDue", label: "Days Past Due", align: "right" },
            { id: "balance", label: "Balance", align: "right" },
            { id: "bucket", label: "Bucket" },
            { id: "risk", label: "Risk" },
          ],
          rows: data.rows.map((row) => ({
            invoiceId: row.invoiceId,
            customer: row.customer,
            dueDate: row.dueDate,
            daysPastDue: row.daysPastDue,
            balance: formatUsd(row.balance),
            bucket: row.bucket,
            risk: row.risk,
          })),
        },
        {
          type: "list",
          id: "segments",
          title: "Playbook by Risk",
          items: data.segments.map((segment) => ({ title: segment.name, caption: segment.summary })),
        },
        {
          type: "richtext",
          id: "email-drafts",
          title: "Email Drafts",
          html: draftPayload.drafts
            .map((draft) => `<h4>${draft.tone} • ${draft.subject}</h4><p>${draft.body.replace(/\n/g, "<br/>")}</p>`)
            .join(""),
        },
      ];
      return { kpis, artifacts, context: { summary: data.metrics } };
    }
    default:
      return { kpis: [], artifacts: [], context: {} };
  }
}

function flattenTree(tree: AccountHierarchyResponse["tree"], prefix: string[] = []) {
  return tree.flatMap((node) => {
    const currentPath = [...prefix, node.name];
    const current = [{ name: node.name, path: currentPath.join(" › ") }];
    if (!node.children || node.children.length === 0) {
      return current;
    }
    return [...current, ...flattenTree(node.children, currentPath)];
  });
}

export function runAgentAndSummarize(
  agent: AgentDefinition,
  filters: Record<string, string>,
  onEvent: (event: AgentRunEvent) => void,
  onComplete: (result: AgentRunResult, summary: string) => void
) {
  return runAgent(agent, filters, (event) => {
    onEvent(event);
    if (event.type === "complete" && event.result) {
      const summary = summarizeKpis(event.result.kpis);
      onComplete(event.result, summary);
    }
  });
}
