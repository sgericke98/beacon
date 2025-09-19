"use client";

import { useState } from "react";
import type { NewsletterConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface NewsletterDesignerProps {
  presets: NewsletterConfig[];
  onChange?: (config: NewsletterConfig) => void;
}

const DEFAULT_CONFIG: NewsletterConfig = {
  topic: "Beacon Revenue Insights",
  cadence: "weekly",
  sections: [
    { title: "Highlights", enabled: true },
    { title: "Risks", enabled: true },
    { title: "Opportunities", enabled: true },
  ],
  recipients: ["revops@beacon.ai"],
};

export function NewsletterDesigner({ presets, onChange }: NewsletterDesignerProps) {
  const [config, setConfig] = useState<NewsletterConfig>(DEFAULT_CONFIG);
  const [newRecipient, setNewRecipient] = useState("");
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);
  const { push } = useToast();

  const updateConfig = (next: NewsletterConfig) => {
    setConfig(next);
    onChange?.(next);
  };

  const loadPreset = (preset: NewsletterConfig) => {
    const clone = JSON.parse(JSON.stringify(preset)) as NewsletterConfig;
    updateConfig(clone);
    setPreviewHTML(null);
    push({ title: "Preset loaded", description: `Loaded ${preset.topic}` });
  };

  const toggleSection = (title: string) => {
    const nextSections = config.sections.map((section) =>
      section.title === title ? { ...section, enabled: !section.enabled } : section
    );
    updateConfig({ ...config, sections: nextSections });
  };

  const addRecipient = () => {
    if (!newRecipient.trim()) return;
    if (config.recipients.includes(newRecipient.trim())) {
      push({ title: "Recipient exists", description: `${newRecipient.trim()} already added.` });
      return;
    }
    const nextRecipients = [...config.recipients, newRecipient.trim()];
    updateConfig({ ...config, recipients: nextRecipients });
    setNewRecipient("");
  };

  const removeRecipient = (email: string) => {
    updateConfig({ ...config, recipients: config.recipients.filter((recipient) => recipient !== email) });
  };

  const preview = async () => {
    const response = await fetch("/api/mock/newsletter/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const payload = await response.json();
    setPreviewHTML(payload.html as string);
    push({ title: "Preview generated", description: "Review the HTML output below." });
  };

  const exportHTML = () => {
    if (!previewHTML) {
      push({ title: "No preview", description: "Generate a preview before exporting." });
      return;
    }
    const blob = new Blob([previewHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${config.topic.replace(/\s+/g, "-").toLowerCase()}-newsletter.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    push({ title: "Exported", description: "HTML downloaded." });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Topic</label>
            <Input value={config.topic} onChange={(event) => updateConfig({ ...config, topic: event.target.value })} />
          </section>
          <section className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Cadence</label>
            <Select value={config.cadence} onChange={(event) => updateConfig({ ...config, cadence: event.target.value as NewsletterConfig["cadence"] })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </Select>
          </section>
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-muted-foreground">Sections</label>
              <Button type="button" variant="outline" size="sm" onClick={() => updateConfig(DEFAULT_CONFIG)}>
                Reset
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.sections.map((section) => (
                <Badge
                  key={section.title}
                  variant={section.enabled ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSection(section.title)}
                >
                  {section.title}
                </Badge>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground">Recipients</label>
            <div className="flex gap-2">
              <Input
                value={newRecipient}
                placeholder="ops@beacon.ai"
                onChange={(event) => setNewRecipient(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addRecipient();
                  }
                }}
              />
              <Button type="button" onClick={addRecipient}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.recipients.map((recipient) => (
                <Badge key={recipient} variant="secondary" className="flex items-center gap-2">
                  {recipient}
                  <button type="button" onClick={() => removeRecipient(recipient)} className="text-xs text-muted-foreground">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Presets</label>
            <div className="grid gap-2">
              {presets.map((preset) => (
                <Button key={preset.topic} variant="outline" onClick={() => loadPreset(preset)}>
                  {preset.topic} – {preset.cadence}
                </Button>
              ))}
            </div>
          </section>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={preview}>
              Preview
            </Button>
            <Button type="button" variant="outline" onClick={exportHTML}>
              Export HTML
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {previewHTML ? (
            <div className="max-h-[500px] overflow-y-auto rounded-md border border-border bg-background p-4" dangerouslySetInnerHTML={{ __html: previewHTML }} />
          ) : (
            <p className="text-sm text-muted-foreground">Generate a preview to see the newsletter output.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
