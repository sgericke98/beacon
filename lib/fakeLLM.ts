import type { AgentStepId, KPIValue, RunArtifact } from "@/lib/types";

interface RevenueContext {
  summary: {
    leakageRate: number;
    revenueAtRisk: number;
    flaggedCount: number;
    topCauses: { cause: string; amount: number }[];
  };
}

interface L2CContext {
  summary: {
    avgCycle: number;
    slowestStage: string;
    p95: number;
  };
}

interface HierarchyContext {
  summary: {
    duplicateCount: number;
    depth: number;
    orphanCount: number;
  };
}

interface MarketContext {
  summary: {
    tamBand: string;
    competitorCount: number;
    icpFit: number;
    triggers: string[];
  };
}

interface CollectionsContext {
  summary: {
    dso: number;
    arTotal: number;
    pctOver60: number;
    cash30: number;
  };
}

export type AgentContextMap = {
  "revenue-leakage": RevenueContext;
  "l2c-analytics": L2CContext;
  "account-hierarchy": HierarchyContext;
  "market-research": MarketContext;
  "cash-collections": CollectionsContext;
};

export function synthesizeStepNarrative<TAgent extends keyof AgentContextMap>(
  agentId: TAgent,
  stepId: AgentStepId,
  context: AgentContextMap[TAgent]
): string[] {
  const narratives: Partial<Record<AgentStepId, string[]>> = {
    plan: ["Clarifying primary questions and decision horizon."],
    gather: ["Pulling structured signals from Beacon's mock data lake."],
    analyze: ["Running heuristics and agentic reasoning on top of the dataset."],
    cluster: ["Grouping related signals to spotlight patterns."],
    segment: ["Grouping accounts into actionable cohorts."],
    recommend: ["Scoring actions against impact and effort."],
    draft: ["Compiling outputs into shareable artifacts."],
  };

  const base = narratives[stepId] ?? ["Processing inputs."];

  switch (agentId) {
    case "revenue-leakage": {
      const details = context.summary;
      if (stepId === "plan") {
        return [
          "Goal: quantify near-term leakage risk",
          `Focus: ${details.flaggedCount} invoices with ${Math.round(details.leakageRate * 100)}% leakage rate.`,
        ];
      }
      if (stepId === "analyze") {
        return [
          `Computed leakage drivers: ${details.topCauses
            .map((cause) => `${cause.cause} (${formatUsd(cause.amount)})`)
            .join(", ")}.`,
          `Total revenue at risk: ${formatUsd(details.revenueAtRisk)}.`,
        ];
      }
      if (stepId === "recommend") {
        return [
          "Prioritizing playbooks: recover credit memos >$5k, negotiate discount resets, escalate >60 day invoices.",
        ];
      }
      break;
    }
    case "l2c-analytics": {
      const details = context.summary;
      if (stepId === "plan") {
        return [
          "Objective: compress lead-to-close cycle time",
          `Baseline cycle: ${Math.round(details.avgCycle)} days with ${details.slowestStage} as slowest stage.`,
        ];
      }
      if (stepId === "analyze") {
        return [
          `Derived stage deltas and P95 = ${Math.round(details.p95)} days to isolate outliers.`,
          "Flagging stages where variance exceeds 15%.",
        ];
      }
      if (stepId === "recommend") {
        return ["Recommending enablement on legal packaging and reintroducing pre-negotiation playbooks." ];
      }
      break;
    }
    case "account-hierarchy": {
      const details = context.summary;
      if (stepId === "plan") {
        return [
          "Mission: normalize CRM hierarchy",
          `${details.duplicateCount} potential duplicates and depth ${details.depth} detected.`,
        ];
      }
      if (stepId === "analyze") {
        return [
          `Tree analysis reveals ${details.orphanCount} orphans to merge and unify reporting.`,
          "Proposing golden records based on shared domains.",
        ];
      }
      if (stepId === "recommend") {
        return ["Sequencing merges by confidence score and impact on ARR dashboards."];
      }
      break;
    }
    case "market-research": {
      const details = context.summary;
      if (stepId === "plan") {
        return [
          "Intent: prep board-ready market brief",
          `Selected TAM band ${details.tamBand} with ${details.competitorCount} active competitors.`,
        ];
      }
      if (stepId === "cluster") {
        return [
          `Grouping ${details.triggers.length} macro signals to align GTM motions.`,
          "Mapping differentiators to competitor weaknesses.",
        ];
      }
      if (stepId === "recommend") {
        return ["Prioritizing triggers tied to subscription pivots and AI transformation budgets."];
      }
      break;
    }
    case "cash-collections": {
      const details = context.summary;
      if (stepId === "plan") {
        return [
          "North Star: reduce DSO",
          `Current DSO ${Math.round(details.dso)} days with ${Math.round(details.pctOver60 * 100)}% >60 days aging.`,
        ];
      }
      if (stepId === "analyze") {
        return [
          `Computed AR balance ${formatUsd(details.arTotal)} and forecast cash-in ${formatUsd(details.cash30)} over 30 days.`,
          "Identifying friction by payment behavior and segment.",
        ];
      }
      if (stepId === "segment") {
        return [
          "Grouping portfolios into friendly / firm / escalate cadences.",
          "Assigning owners to top 5 delinquent accounts.",
        ];
      }
      if (stepId === "draft") {
        return ["Generating tone-aware outreach drafts with clear ask and promise-to-pay trackers."];
      }
      break;
    }
    default:
      break;
  }

  return base;
}

export function summarizeKpis(kpis: KPIValue[]): string {
  if (kpis.length === 0) return "No KPIs produced.";
  const primary = kpis[0];
  return `${primary.label}: ${primary.value}`;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function renderArtifactAsHtml(artifact: RunArtifact): string {
  if (artifact.type === "richtext") {
    return artifact.html;
  }
  if (artifact.type === "list") {
    return `<ul>${artifact.items.map((item) => `<li><strong>${item.title}</strong>${item.caption ? ` — ${item.caption}` : ""}</li>`).join("" )}</ul>`;
  }
  if (artifact.type === "table") {
    const header = artifact.columns.map((col) => `<th>${col.label}</th>`).join("");
    const body = artifact.rows
      .map((row) => `<tr>${artifact.columns.map((col) => `<td>${row[col.id]}</td>`).join("")}</tr>`)
      .join("");
    return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
  }
  return "";
}
