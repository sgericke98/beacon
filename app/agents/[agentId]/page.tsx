import { notFound } from "next/navigation";
import { AgentRunView } from "@/components/AgentRunView";
import { getAgentById } from "@/lib/agents";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const agent = getAgentById(params.agentId);

  if (!agent) {
    notFound();
  }

  if (agent.status !== "core") {
    return (
      <div className="space-y-4 rounded-3xl border border-border bg-background/70 p-12 text-center shadow-lg">
        <h1 className="text-3xl font-semibold text-foreground">{agent.name}</h1>
        <p className="text-lg text-muted-foreground">This agent is still in design. Check back soon for a full mock run.</p>
      </div>
    );
  }

  return <AgentRunView agent={agent} />;
}
