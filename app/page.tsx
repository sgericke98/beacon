import { AgentGrid } from "@/components/AgentGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-10 shadow-xl">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-wide text-primary">Beacon demo</p>
          <h1 className="text-4xl font-semibold text-foreground">Orchestrate revenue with agentic copilots</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Explore five fully mocked agents that showcase Beacon&apos;s agentic workflow. Each run executes Plan → Gather → Analyze → Recommend → Draft steps, streaming traces, KPIs, and shareable artifacts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/agents/revenue-leakage">
              <Button size="lg">Start with Revenue Leakage</Button>
            </Link>
            <Link href="/agents/market-research">
              <Button size="lg" variant="outline">
                View market brief demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <AgentGrid />
    </div>
  );
}
