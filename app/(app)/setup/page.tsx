import connectors from "@/data/connectors.json" assert { type: "json" };
import objects from "@/data/objects.json" assert { type: "json" };
import fields from "@/data/fields.json" assert { type: "json" };
import { PageHeader } from "@/components/PageHeader";
import { ConnectorCard } from "@/components/ConnectorCard";

export default function SetupPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Setup – Connect your systems" description="Select the objects and fields you want Beacon to ingest." />
      <div className="grid gap-6 lg:grid-cols-2">
        {connectors.map((connector) => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            objects={objects}
            fieldsByObject={fields as Record<string, { id: string; label: string; type: string }[]>}
          />
        ))}
      </div>
    </div>
  );
}
