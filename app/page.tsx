import Link from "next/link";
import datasets from "@/data/datasets.json" assert { type: "json" };
import connectors from "@/data/connectors.json" assert { type: "json" };
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NAV_CARDS = [
  {
    title: "Setup",
    description: "Connect Salesforce, NetSuite and configure object mappings.",
    href: "/setup",
  },
  {
    title: "Raw Data",
    description: "Explore unified datasets and export ad-hoc slices.",
    href: "/raw-data",
  },
  {
    title: "L2C Analysis",
    description: "Understand cycle times and conversion efficiency.",
    href: "/l2c-analysis",
  },
  {
    title: "Revenue Leakage",
    description: "Review risky contracts and quantify leakage impact.",
    href: "/revenue-leakage",
  },
  {
    title: "Data Cleaning – Hierarchy",
    description: "Resolve duplicates with AI-powered hierarchy suggestions.",
    href: "/data-cleaning-hierarchy",
  },
  {
    title: "AI Newsletter",
    description: "Curate an automated RevOps digest with Beacon insights.",
    href: "/ai-newsletter",
  },
];

export default function LandingPage() {
  const datasetCount = datasets.length;
  const totalRows = datasets.reduce((total, dataset) => total + dataset.rowCount, 0);
  const configuredConnectors = connectors.filter((connector) => connector.status !== "not_configured").length;

  return (
    <div className="space-y-12">
      <section className="grid gap-10 rounded-xl bg-gradient-to-br from-foreground/5 via-foreground/10 to-foreground/5 p-10 md:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-foreground">Welcome to Beacon</h1>
          <p className="text-lg text-muted-foreground">
            Accelerate your lead-to-cash operations with a unified workspace for data ingestion, cycle analytics, leakage detection
            and executive-ready updates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/setup">
              <Button size="lg">Start with setup</Button>
            </Link>
            <Link href="/l2c-analysis">
              <Button size="lg" variant="outline">
                View analytics
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryStat label="Datasets" value={datasetCount.toString()} caption="available" />
          <SummaryStat label="Total records" value={totalRows.toLocaleString()} caption="across mock sources" />
          <SummaryStat label="Connectors" value={`${configuredConnectors}/${connectors.length}`} caption="configured" />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Navigate Beacon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each workspace below is preloaded with representative mock data and workflows. Connectors will soon point to Supabase.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {NAV_CARDS.map((card) => (
            <Card key={card.href} className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </div>
              <CardContent>
                <Link href={card.href} className="inline-flex">
                  <Button variant="outline">Open</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card className="bg-background/70">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        <div className="text-3xl font-semibold text-foreground">{value}</div>
        <CardDescription>{caption}</CardDescription>
      </CardHeader>
    </Card>
  );
}
