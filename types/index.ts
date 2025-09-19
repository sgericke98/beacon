export type ConnectorId = "salesforce" | "netsuite";

export interface Connector {
  id: ConnectorId;
  name: string;
  status: "not_configured" | "configured" | "syncing";
  lastSync?: string;
}

export interface DataObject {
  id: string;
  label: string;
  fields: DataField[];
}

export interface DataField {
  id: string;
  label: string;
  type: "string" | "number" | "date" | "boolean";
}

export interface DatasetMeta {
  id: string;
  label: string;
  rowCount: number;
  updatedAt: string;
}

export interface Row {
  [key: string]: string | number | boolean | null;
}

export interface KPI {
  id: string;
  label: string;
  value: number;
  deltaPct?: number;
}

export interface L2CMetric {
  id: string;
  label: string;
  value: number;
  unit?: "days" | "$" | "count";
}

export interface PivotConfig {
  rows: string[];
  cols: string[];
  values: { field: string; agg: "sum" | "avg" | "count" | "min" | "max" }[];
}

export interface LeakageFinding {
  id: string;
  contractId: string;
  category: string;
  description: string;
  impactUSD: number;
  severity: "low" | "medium" | "high";
}

export interface DedupSuggestion {
  id: string;
  entity: "account" | "contact" | "product";
  primaryId: string;
  duplicateId: string;
  similarity: number;
  suggestedAction: "merge" | "ignore";
}

export interface NewsletterConfig {
  topic: string;
  cadence: "daily" | "weekly";
  sections: { title: string; enabled: boolean }[];
  recipients: string[];
}
