"use client";

import { useEffect, useState } from "react";
import type { Connector } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FieldDefinition {
  id: string;
  label: string;
  type: string;
}

interface ConnectorCardProps {
  connector: Connector;
  objects: string[];
  fieldsByObject: Record<string, FieldDefinition[]>;
}

interface SuggestedMapping {
  object: string;
  fields: string[];
}

export function ConnectorCard({ connector, objects, fieldsByObject }: ConnectorCardProps) {
  const { connectorSelections, updateConnector } = useUIStore();
  const selection = connectorSelections[connector.id];
  const [open, setOpen] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState<string[]>(selection.objects);
  const [selectedFields, setSelectedFields] = useState<Record<string, string[]>>(selection.fields);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestedMapping[] | null>(null);

  useEffect(() => {
    setSelectedObjects(selection.objects);
    setSelectedFields(selection.fields);
  }, [selection.objects, selection.fields]);

  useEffect(() => {
    if (!open) {
      setSuggestion(null);
    }
  }, [open]);

  const statusVariant = selection.status === "configured" ? "success" : selection.status === "syncing" ? "warning" : "secondary";
  const statusLabel = selection.status === "configured" ? "Configured" : selection.status === "syncing" ? "Syncing" : "Not configured";

  const handleToggleObject = (object: string) => {
    setSelectedObjects((current) => (current.includes(object) ? current.filter((item) => item !== object) : [...current, object]));
    setSelectedFields((current) => {
      if (current[object]) return current;
      return { ...current, [object]: [] };
    });
  };

  const handleToggleField = (object: string, fieldId: string) => {
    setSelectedFields((current) => {
      const objectFields = current[object] ?? [];
      return {
        ...current,
        [object]: objectFields.includes(fieldId)
          ? objectFields.filter((id) => id !== fieldId)
          : [...objectFields, fieldId],
      };
    });
  };

  const saveConfiguration = () => {
    updateConnector(connector.id, {
      objects: selectedObjects,
      fields: selectedFields,
      status: "configured",
    });
    setOpen(false);
  };

  const fetchSuggestion = async () => {
    try {
      setLoadingSuggestion(true);
      const response = await fetch("/api/mock/connectors");
      const payload = await response.json();
      setSuggestion(payload.mapping as SuggestedMapping[]);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{connector.name}</CardTitle>
          <CardDescription>Connect {connector.name} objects and fields to Beacon.</CardDescription>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          {selection.objects.length ? (
            <div className="space-y-1">
              <div className="font-medium text-foreground">Configured Objects</div>
              <div className="flex flex-wrap gap-2">
                {selection.objects.map((object) => (
                  <Badge key={object} variant="secondary">
                    {object}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p>No objects selected yet.</p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>Configure</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {connector.name}</DialogTitle>
              <DialogDescription>Select the objects and fields you want to sync.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground">Objects</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {objects.map((object) => {
                    const active = selectedObjects.includes(object);
                    return (
                      <Button
                        key={object}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleObject(object)}
                      >
                        {object}
                      </Button>
                    );
                  })}
                </div>
              </section>
              {selectedObjects.map((object) => (
                <section key={object} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-muted-foreground">{object} fields</h4>
                    <span className="text-xs text-muted-foreground">
                      {selectedFields[object]?.length ?? 0} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(fieldsByObject[object] ?? []).map((field) => {
                      const active = selectedFields[object]?.includes(field.id) ?? false;
                      return (
                        <Button
                          key={field.id}
                          type="button"
                          variant={active ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleField(object, field.id)}
                        >
                          {field.label}
                        </Button>
                      );
                    })}
                  </div>
                </section>
              ))}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground">AI Mapping Suggestion</h3>
                  <Button type="button" size="sm" variant="outline" onClick={fetchSuggestion} disabled={loadingSuggestion}>
                    {loadingSuggestion ? "Loading..." : "Suggest Mapping (AI)"}
                  </Button>
                </div>
                {loadingSuggestion ? <Skeleton className="h-16 w-full" /> : null}
                {suggestion ? (
                  <pre className="max-h-48 overflow-y-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(suggestion, null, 2)}
                  </pre>
                ) : null}
              </section>
            </div>
            <DialogFooter className="justify-between">
              <DialogClose>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={saveConfiguration} disabled={!selectedObjects.length}>
                Save configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
