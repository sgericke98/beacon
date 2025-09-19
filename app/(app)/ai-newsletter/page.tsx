import presets from "@/data/newsletter-presets.json" assert { type: "json" };
import { PageHeader } from "@/components/PageHeader";
import { NewsletterDesigner } from "@/components/NewsletterDesigner";

export default function AINewsletterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Newsletter"
        description="Design a RevOps newsletter, generate HTML previews and export for stakeholders."
      />
      <NewsletterDesigner presets={presets} />
    </div>
  );
}
