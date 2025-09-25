import { agentCatalog, verticalLabels } from "@/lib/agents";
import type { AgentDefinition } from "@/lib/types";
import { AgentCard } from "@/components/AgentCard";

export function AgentGrid() {
  const grouped = agentCatalog.reduce<Record<string, AgentDefinition[]>>((acc, agent) => {
    if (!acc[agent.vertical]) {
      acc[agent.vertical] = [];
    }
    acc[agent.vertical].push(agent);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([vertical, agents]) => (
        <section key={vertical} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              {verticalLabels[vertical as keyof typeof verticalLabels]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {describeVertical(vertical)}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function describeVertical(vertical: string) {
  switch (vertical) {
    case "quote-to-cash":
      return "Optimize and protect the revenue engine from lead to cash.";
    case "operations":
      return "Diagnose process velocity and unblock execution.";
    case "data":
      return "Harmonize and steward GTM data foundations.";
    case "strategy":
      return "Arm leadership with market intelligence and plays.";
    case "finance":
      return "Improve cash flow and financial guardrails.";
    case "post-sales":
      return "Delight customers and prevent churn.";
    case "sales-marketing":
      return "Fuel top-of-funnel impact and pricing discipline.";
    case "people":
      return "Enable teams with skills and engagement insights.";
    default:
      return "Explore agent concepts across the Beacon surface area.";
  }
}
