import { NextResponse } from "next/server";
import invoices from "@/data/invoices.json" assert { type: "json" };
import opportunities from "@/data/opportunities.json" assert { type: "json" };
import accounts from "@/data/accounts.json" assert { type: "json" };
import customers from "@/data/customers.json" assert { type: "json" };

const NOW = new Date("2025-07-05");
const MS_IN_DAY = 24 * 60 * 60 * 1000;

type Invoice = (typeof invoices)[number];
type Opportunity = (typeof opportunities)[number];
type Account = (typeof accounts)[number];
interface HierarchyNode {
  id: string;
  name: string;
  children: HierarchyNode[];
}

export async function GET(request: Request, { params }: { params: { agentId: string } }) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  switch (params.agentId) {
    case "revenue-leakage":
      return NextResponse.json(buildRevenueLeakage(searchParams));
    case "l2c-analytics":
      return NextResponse.json(buildL2CAnalytics(searchParams));
    case "account-hierarchy":
      return NextResponse.json(buildAccountHierarchy(searchParams));
    default:
      return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }
}

function buildRevenueLeakage(searchParams: URLSearchParams) {
  const segment = searchParams.get("segment") ?? "all";
  const customerById = new Map(customers.map((customer) => [customer.customerId, customer]));

  const scopedInvoices = (invoices as Invoice[]).filter((invoice) => {
    const customer = customerById.get(invoice.customerId);
    if (!customer) return false;
    if (segment === "all") return true;
    if (segment === "enterprise") return customer.segment === "Enterprise";
    if (segment === "mid-market") return customer.segment === "Mid-Market";
    return true;
  });

  const causes = new Map<string, number>();
  let revenueAtRisk = 0;
  const anomalies = scopedInvoices
    .map((invoice) => {
      const customer = customerById.get(invoice.customerId);
      const dueDate = new Date(invoice.dueDate);
      const daysPastDue = Math.max(0, Math.floor((NOW.getTime() - dueDate.getTime()) / MS_IN_DAY));
      const discountLeakage = invoice.amount * invoice.discountPercent;
      const creditLeakage = invoice.creditMemo;
      const delayLeakage = daysPastDue > 0 ? invoice.amount * 0.01 * Math.ceil(daysPastDue / 30) : 0;
      const leakage = Math.round(discountLeakage + creditLeakage + delayLeakage);

      let cause = "Healthy";
      if (delayLeakage > discountLeakage && delayLeakage > creditLeakage && daysPastDue > 30) {
        cause = ">30 days late";
      } else if (creditLeakage > discountLeakage) {
        cause = "Credit memo";
      } else if (discountLeakage > 0) {
        cause = "Discount override";
      }

      if (cause !== "Healthy") {
        causes.set(cause, (causes.get(cause) ?? 0) + leakage);
      }
      if (invoice.status === "Overdue" || invoice.status === "Partially Paid") {
        revenueAtRisk += invoice.amount - invoice.creditMemo;
      }

      return {
        invoiceId: invoice.invoiceId,
        customer: customer?.name ?? invoice.customerId,
        amount: invoice.amount,
        leakage,
        cause,
        status: invoice.status,
        action:
          cause === "Discount override"
            ? "Review approval trail"
            : cause === "Credit memo"
              ? "Confirm memo justification"
              : cause === ">30 days late"
                ? "Escalate to collections"
                : "Monitor",
      };
    })
    .filter((row) => row.cause !== "Healthy")
    .sort((a, b) => b.leakage - a.leakage);

  const totalInvoiced = scopedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalLeakage = anomalies.reduce((sum, row) => sum + row.leakage, 0);
  const leakageRate = totalInvoiced === 0 ? 0 : totalLeakage / totalInvoiced;

  const topCauses = Array.from(causes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cause, amount]) => ({ cause, amount }));

  const recommendations = [
    {
      title: "Reset deep discounts",
      summary: "Renegotiate renewal discounts >10% and reinforce guardrails with AEs.",
    },
    {
      title: "Escalate aging enterprise invoices",
      summary: "Partner with Finance to secure promise-to-pay on >30 day accounts.",
    },
    {
      title: "Automate credit memo reviews",
      summary: "Route memos >$5k through shared RevOps and Finance review queue.",
    },
  ];

  return {
    metrics: {
      leakageRate,
      revenueAtRisk,
      flaggedCount: anomalies.length,
      topCauses,
    },
    anomalies,
    recommendations,
  };
}

function buildL2CAnalytics(searchParams: URLSearchParams) {
  const region = searchParams.get("region") ?? "global";
  const scoped = (opportunities as Opportunity[]).filter((opp) => (region === "global" ? true : opp.region === region));

  const totals = scoped.map((opp) =>
    Object.values(opp.stageDurations).reduce((sum, value) => sum + Number(value ?? 0), 0)
  );
  const avgCycle = totals.length ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;
  const sorted = [...totals].sort((a, b) => a - b);
  const p95Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  const p95 = sorted.length ? sorted[p95Index] : 0;

  const stageTotals = new Map<string, number>();
  scoped.forEach((opp) => {
    for (const [stage, value] of Object.entries(opp.stageDurations)) {
      stageTotals.set(stage, (stageTotals.get(stage) ?? 0) + Number(value ?? 0));
    }
  });

  const stages = Array.from(stageTotals.entries()).map(([stage, value]) => ({
    stage,
    avg: scoped.length ? value / scoped.length : 0,
  }));
  const slowestStage = stages.reduce((slow, stage) => (stage.avg > slow.avg ? stage : slow), stages[0] ?? { stage: "", avg: 0 });

  const bottlenecks = stages
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3)
    .map((stage) => ({
      stage: stage.stage,
      insight: stage.avg > (avgCycle / Math.max(1, stages.length)) ? "Stage variance above target" : "On watch",
      action:
        stage.stage === slowestStage.stage
          ? "Pair reps with legal playbook refresh"
          : "Add midpoint exit criteria review",
    }));

  return {
    metrics: {
      avgCycle,
      slowestStage: slowestStage?.stage ?? "",
      p95,
    },
    stages,
    bottlenecks,
  };
}

function buildAccountHierarchy(searchParams: URLSearchParams) {
  const region = searchParams.get("region") ?? "all";
  const scopedAccounts = (accounts as Account[]).filter((account) => (region === "all" ? true : account.region === region));

  const byId = new Map<string, HierarchyNode>(
    scopedAccounts.map((account) => [account.id, { id: account.id, name: account.name, children: [] }])
  );
  const roots: HierarchyNode[] = [];

  byId.forEach((node) => {
    const account = scopedAccounts.find((item) => item.id === node.id);
    if (account?.parentId && byId.has(account.parentId)) {
      byId.get(account.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const duplicates = Array.from(
    scopedAccounts.reduce((map, account) => {
      const key = account.domain.toLowerCase();
      if (!map.has(key)) {
        map.set(key, [] as Account[]);
      }
      map.get(key)!.push(account);
      return map;
    }, new Map<string, Account[]>())
  )
    .filter(([, list]) => list.length > 1)
    .map(([domain, list]) => ({
      domain,
      accounts: list.map((item) => item.name),
      suggestion: `Merge into ${list[0].name}`,
    }));

  const depth = computeDepth(roots);
  const orphanCount = scopedAccounts.filter((account) => account.parentId && !byId.has(account.parentId)).length;

  const recommendations = [
    {
      title: "Merge duplicate shells",
      summary: `Consolidate ${duplicates.length} duplicate domains to clean up reporting dashboards.`,
    },
    {
      title: "Assign parent for orphans",
      summary: `${orphanCount} child records lack active parents; attach to top-level orgs before pipeline roll-up.`,
    },
  ];

  return {
    metrics: {
      duplicateCount: duplicates.length,
      depth,
      orphanCount,
    },
    tree: roots,
    duplicates,
    recommendations,
  };
}

function computeDepth(nodes: HierarchyNode[], current = 1): number {
  if (nodes.length === 0) return current - 1;
  return nodes.reduce((max, node) => Math.max(max, computeDepth(node.children ?? [], current + 1)), current);
}
