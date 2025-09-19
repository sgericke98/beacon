import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const dataDir = "data";
mkdirSync(dataDir, { recursive: true });

const connectors = [
  { id: "salesforce", name: "Salesforce", status: "not_configured" },
  { id: "netsuite", name: "NetSuite", status: "not_configured" },
];
writeFileSync(join(dataDir, "connectors.json"), JSON.stringify(connectors, null, 2));

const objects = ["Account", "Opportunity", "Quote", "Invoice", "Payment", "Product"];
writeFileSync(join(dataDir, "objects.json"), JSON.stringify(objects, null, 2));

const fields = {
  Account: [
    { id: "id", label: "Account ID", type: "string" },
    { id: "name", label: "Account Name", type: "string" },
    { id: "industry", label: "Industry", type: "string" },
    { id: "segment", label: "Segment", type: "string" },
    { id: "owner", label: "Owner", type: "string" },
    { id: "createdAt", label: "Created At", type: "date" },
  ],
  Opportunity: [
    { id: "id", label: "Opportunity ID", type: "string" },
    { id: "name", label: "Name", type: "string" },
    { id: "account", label: "Account", type: "string" },
    { id: "segment", label: "Segment", type: "string" },
    { id: "region", label: "Region", type: "string" },
    { id: "owner", label: "Owner", type: "string" },
    { id: "stage", label: "Stage", type: "string" },
    { id: "amount", label: "Amount", type: "number" },
    { id: "createdAt", label: "Created At", type: "date" },
    { id: "closeDate", label: "Close Date", type: "date" },
  ],
  Quote: [
    { id: "id", label: "Quote ID", type: "string" },
    { id: "opportunityId", label: "Opportunity", type: "string" },
    { id: "quoteNumber", label: "Quote #", type: "string" },
    { id: "owner", label: "Owner", type: "string" },
    { id: "amount", label: "Amount", type: "number" },
    { id: "status", label: "Status", type: "string" },
    { id: "createdAt", label: "Created At", type: "date" },
  ],
  Invoice: [
    { id: "id", label: "Invoice ID", type: "string" },
    { id: "quoteId", label: "Quote", type: "string" },
    { id: "invoiceNumber", label: "Invoice #", type: "string" },
    { id: "status", label: "Status", type: "string" },
    { id: "amount", label: "Amount", type: "number" },
    { id: "issuedAt", label: "Issued At", type: "date" },
    { id: "dueAt", label: "Due At", type: "date" },
  ],
  Payment: [
    { id: "id", label: "Payment ID", type: "string" },
    { id: "invoiceId", label: "Invoice", type: "string" },
    { id: "amount", label: "Amount", type: "number" },
    { id: "status", label: "Status", type: "string" },
    { id: "method", label: "Method", type: "string" },
    { id: "paidAt", label: "Paid At", type: "date" },
  ],
  Product: [
    { id: "id", label: "Product ID", type: "string" },
    { id: "name", label: "Product Name", type: "string" },
    { id: "sku", label: "SKU", type: "string" },
    { id: "category", label: "Category", type: "string" },
    { id: "price", label: "Price", type: "number" },
    { id: "active", label: "Active", type: "boolean" },
  ],
};
writeFileSync(join(dataDir, "fields.json"), JSON.stringify(fields, null, 2));

const owners = ["Alex Morgan", "Priya Patel", "Liam Chen", "Sofia Gomez", "Jordan Smith"];
const segments = ["Enterprise", "Commercial", "Mid-Market", "SMB"];
const regions = ["North America", "EMEA", "APAC", "LATAM"];
const stages = ["Qualification", "Proposal", "Negotiation", "Closed Won"];
const accountNames = [
  "Asteria Corp",
  "Lumos Labs",
  "Nova Networks",
  "QuantumSoft",
  "Helios Manufacturing",
  "Orion Retail",
  "Vertex Analytics",
  "Nimbus Logistics",
];

const rand = (seed) => {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};
const random = rand(42);

const opportunities = [];
const quotes = [];
const invoices = [];
const payments = [];

for (let i = 0; i < 60; i++) {
  const idNumber = 1001 + i;
  const id = `OPP-${idNumber}`;
  const created = new Date(2024, Math.floor(random() * 12), Math.floor(random() * 28) + 1);
  const cycle1 = Math.floor(random() * 30) + 5;
  const cycle2 = Math.floor(random() * 20) + 3;
  const cycle3 = Math.floor(random() * 25) + 1;
  const quoteDate = new Date(created.getTime() + cycle1 * 24 * 60 * 60 * 1000);
  const invoiceDate = new Date(quoteDate.getTime() + cycle2 * 24 * 60 * 60 * 1000);
  const paymentDate = new Date(invoiceDate.getTime() + cycle3 * 24 * 60 * 60 * 1000);
  const amount = Math.round((random() * 90000 + 10000) / 100) * 100;
  const account = accountNames[Math.floor(random() * accountNames.length)];
  const segment = segments[Math.floor(random() * segments.length)];
  const region = regions[Math.floor(random() * regions.length)];
  const owner = owners[Math.floor(random() * owners.length)];
  const stage = stages[Math.floor(random() * stages.length)];

  opportunities.push({
    id,
    name: `${account} Expansion ${i % 3 === 0 ? "Suite" : "Platform"}`,
    account,
    segment,
    region,
    owner,
    stage,
    amount,
    createdAt: created.toISOString(),
    closeDate: paymentDate.toISOString(),
  });

  const quoteId = `QT-${idNumber}`;
  quotes.push({
    id: quoteId,
    opportunityId: id,
    quoteNumber: `Q-${idNumber}`,
    owner,
    amount: amount * (0.95 + random() * 0.1),
    status: "Approved",
    createdAt: quoteDate.toISOString(),
  });

  const invoiceId = `INV-${idNumber}`;
  invoices.push({
    id: invoiceId,
    quoteId,
    invoiceNumber: `INV-${idNumber}`,
    status: random() > 0.1 ? "Paid" : "Open",
    amount: amount * (0.95 + random() * 0.08),
    issuedAt: invoiceDate.toISOString(),
    dueAt: new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  payments.push({
    id: `PAY-${idNumber}`,
    invoiceId,
    amount: amount * (0.94 + random() * 0.06),
    status: "Completed",
    method: random() > 0.5 ? "ACH" : "Wire",
    paidAt: paymentDate.toISOString(),
  });
}

writeFileSync(join(dataDir, "opportunities.json"), JSON.stringify(opportunities, null, 2));
writeFileSync(join(dataDir, "quotes.json"), JSON.stringify(quotes, null, 2));
writeFileSync(join(dataDir, "invoices.json"), JSON.stringify(invoices, null, 2));
writeFileSync(join(dataDir, "payments.json"), JSON.stringify(payments, null, 2));

const datasets = [
  { id: "opportunities", label: "Opportunities", rowCount: opportunities.length, updatedAt: new Date(2025, 0, 12).toISOString() },
  { id: "quotes", label: "Quotes", rowCount: quotes.length, updatedAt: new Date(2025, 0, 13).toISOString() },
  { id: "invoices", label: "Invoices", rowCount: invoices.length, updatedAt: new Date(2025, 0, 15).toISOString() },
  { id: "payments", label: "Payments", rowCount: payments.length, updatedAt: new Date(2025, 0, 16).toISOString() },
  { id: "accounts", label: "Accounts", rowCount: accountNames.length, updatedAt: new Date(2025, 0, 10).toISOString() },
  { id: "products", label: "Products", rowCount: 24, updatedAt: new Date(2025, 0, 8).toISOString() },
];
writeFileSync(join(dataDir, "datasets.json"), JSON.stringify(datasets, null, 2));

const leakageCategories = [
  "Underbilling",
  "Missing Indexation",
  "Unapproved Discounts",
  "Late Fees Waived",
  "Renewal Missed",
];
const severities = ["low", "medium", "high"];

const leakageFindings = Array.from({ length: 24 }, (_, i) => {
  const category = leakageCategories[i % leakageCategories.length];
  const severity = severities[i % severities.length];
  const impactUSD = Math.round(random() * 25000 + 2000);
  return {
    id: `LF-${1100 + i}`,
    contractId: `C-${9000 + i}`,
    category,
    description: `${category} identified for contract ${(9000 + i).toString()}.`,
    impactUSD,
    severity,
  };
});
writeFileSync(join(dataDir, "leakage-findings.json"), JSON.stringify(leakageFindings, null, 2));

const dedupEntities = ["account", "contact", "product"];
const cleaningSuggestions = Array.from({ length: 18 }, (_, i) => {
  const entity = dedupEntities[i % dedupEntities.length];
  return {
    id: `DU-${2000 + i}`,
    entity,
    primaryId: `${entity.slice(0, 2).toUpperCase()}-${3000 + i}`,
    duplicateId: `${entity.slice(0, 2).toUpperCase()}-${4000 + i}`,
    similarity: Math.round((0.72 + random() * 0.25) * 100) / 100,
    suggestedAction: "merge",
  };
});
writeFileSync(join(dataDir, "cleaning-suggestions.json"), JSON.stringify(cleaningSuggestions, null, 2));

const newsletterPresets = [
  {
    topic: "Salesforce L2C Tips",
    cadence: "weekly",
    sections: [
      { title: "Top Insights", enabled: true },
      { title: "Connectors Health", enabled: true },
      { title: "Automation Ideas", enabled: false },
    ],
    recipients: ["revops@beacon.ai", "opslead@beacon.ai"],
  },
  {
    topic: "AI in RevOps Daily",
    cadence: "daily",
    sections: [
      { title: "AI Workflow", enabled: true },
      { title: "Metrics to Watch", enabled: true },
      { title: "Customer Stories", enabled: true },
    ],
    recipients: ["newsletter@beacon.ai"],
  },
  {
    topic: "Executive Revenue Brief",
    cadence: "weekly",
    sections: [
      { title: "KPIs", enabled: true },
      { title: "Risks", enabled: true },
      { title: "Next Best Actions", enabled: true },
    ],
    recipients: ["ceo@beacon.ai", "cfo@beacon.ai"],
  },
];
writeFileSync(join(dataDir, "newsletter-presets.json"), JSON.stringify(newsletterPresets, null, 2));

console.log("Mock data generated");
